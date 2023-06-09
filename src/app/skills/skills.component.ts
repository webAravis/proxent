import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkillsService } from './skills.service';
import { GameService } from '../core/game.service';
import { Skill, TreeSkills } from './treeskills.model';
import { GirlsService } from '../core/girls/girls.service';
import { InventoryService } from '../inventory/inventory.service';
import { Girl } from '../core/girls/girl.model';
import { CachingService } from '../core/caching.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {

  golds = 0;
  girl: Girl = new Girl();
  basePath = '.';

  treeSkills: TreeSkills[] = [];
  resetPrice: { type: string; quantity: number }[] = [
    { type: 'gold', quantity: 15_000 },
    { type: 'recordmonthly_badge', quantity: 2 },
  ];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _skillService: SkillsService,
    private _girlService: GirlsService,
    private _gameService: GameService,
    private _cachingService: CachingService,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this.basePath = (this._cachingService.mediasExist ? '.' : 'https://proxentgame.com');

    this._gameService.goldChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((golds) => (this.golds = golds));
    this.golds = this._gameService.golds;

    this._girlService.currentGirl.pipe(takeUntil(this._unsubscribeAll)).subscribe(girl => {
      this.girl = girl;
      this.treeSkills = this.girl.skills;
      if (this.girl.fullId === this._gameService.girlfriend) { // disable battle tree for girlfriend
        this.treeSkills = this.treeSkills.filter(tree => tree.name !== 'battle');
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  get skillPointsSpent(): number {
    let total = 0;
    for (const treeSkills of this.treeSkills) {
      for (const skillTier of treeSkills.skillTiers) {
        for (const skill of skillTier.skills) {
          total += skill.level
        }
      }
    }

    return total;
  }

  skillPrice(skill: Skill): { type: string, quantity: number}[] {
    return skill.unlockPrice[skill.level] ?? skill.unlockPrice[skill.unlockPrice.length - 1];
  }

  canAfford(price: { type: string, quantity: number}): boolean {
    if (price.type === 'gold' && price.quantity >= this.golds) {
      return false;
    }

    if (
      price.type !== 'gold' &&
      !this._inventoryService.hasItemByName(price.type, price.quantity)
    ) {
      return false;
    }

    return true;
  }

  canAffordSkill(skill: Skill): boolean {
    for (const price of this.skillPrice(skill)) {
      if (!this.canAfford(price)) {
        return false;
      }
    }

    return true;
  }

  canUnlock(skill: Skill): boolean {
    if ((this.girl.skillPoints - this.skillPointsSpent) <= 0) {
      return false;
    }

    if (skill.level >= skill.maxlevel) {
      return false;
    }

    if (skill.unlockPrice.length === 0) {
      return false;
    }

    if (!this.canAffordSkill(skill)) {
      return false;
    }

    if (skill.requires !== undefined && !this._skillService.hasSkills(skill.requires, this._girlService.currentGirl.getValue())) {
      return false;
    }

    return true;
  }

  upgradeSkill(skill: Skill): void {
    if (this.canUnlock(skill)) {

      for (const price of this.skillPrice(skill)) {
        if (price.type === 'gold') {
          this._gameService.updateGolds(price.quantity * -1);
        } else {
          this._inventoryService.removeItemByName(price.type, price.quantity);
        }
      }

      this._skillService.updateSkillLevel(skill, skill.level+1);
    }
  }

  getDivPosition(divId: string, treeId: string): {x: number, y: number} {
    const searched = <HTMLElement> document.getElementById(divId);
    const containerTree = <HTMLElement> document.getElementById(treeId);

    if (searched) {
      const boundings = searched.getBoundingClientRect();
      const boundingsTree = containerTree.getBoundingClientRect();

      return {
        x: boundings.left - boundingsTree.left + (boundings.width/2),
        y: boundings.top - boundingsTree.top + (boundings.height/2)
      }
    }

    return {
      x: 0,
      y: 0
    }
  }

  canReset(): boolean {
    for (const price of this.resetPrice) {
      if (!this.canAfford(price)) {
          return false;
      }
    }

    return true;
  }

  resetAll(): void {
    if (this.canReset() && confirm('Are you sure you want to reset all skills? NO REFUND FOR SPENT MATERIALS!')) {

      for (const price of this.resetPrice) {
        if (price.type === 'gold') {
          this._gameService.updateGolds(price.quantity * -1);
        } else {
          this._inventoryService.removeItemByName(price.type, price.quantity);
        }
      }

      for (const treeSkills of this.treeSkills) {
        for (const skillTier of treeSkills.skillTiers) {
          for (const skill of skillTier.skills) {
            this._skillService.updateSkillLevel(skill, 0);
          }
        }
      }
    }
  }

  itemQuantity(itemName: string): number {
    return this._inventoryService.quantity(itemName);
  }

}
