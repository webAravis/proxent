import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SkillsService } from './skills.service';
import { GameService } from '../core/game.service';
import { Skill, TreeSkills } from './treeskills.model';
import { GirlsService } from '../core/girls/girls.service';
import { InventoryService } from '../inventory/inventory.service';
import { Girl } from '../core/girls/girl.model';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {

  golds = 0;
  girl: Girl = new Girl();

  treeSkills: TreeSkills[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _skillService: SkillsService,
    private _girlService: GirlsService,
    private _gameService: GameService,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this._skillService.treeSkills
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((treeSkills: TreeSkills[]) => {
        this.treeSkills = treeSkills.filter((tree: TreeSkills) => tree.girl.id === 0 || tree.girl.id === this._girlService.currentGirl.getValue().id);
      });

    this._gameService.goldChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((golds) => (this.golds = golds));
    this.golds = this._gameService.golds;

    this._girlService.currentGirl.pipe(takeUntil(this._unsubscribeAll)).subscribe(girl => this.girl = girl);
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

    for (const price of skill.unlockPrice) {
      if (!this.canAfford(price)) {
          return false;
      }
    }

    if (skill.requires !== undefined && !this._skillService.hasSkill(skill.requires, this._girlService.currentGirl.getValue())) {
      return false;
    }

    return true;
  }

  upgradeSkill(skill: Skill): void {
    if (this.canUnlock(skill)) {

      // for (const price of skill.unlockPrice) {
      //   if (price.type === 'gold') {
      //     this._gameService.updateGolds(price.quantity * -1);
      //   } else {
      //     this._inventoryService.removeItemByName(price.type, price.quantity);
      //   }
      // }

      this._skillService.upgradeSkill(skill);
    }
  }

  getDivPosition(divId: string): {x: number, y: number} {
    const searched = <HTMLElement> document.getElementById(divId);
    if (searched) {
      const boundings = searched.getBoundingClientRect();

      return {
        x: boundings.left + (boundings.width/2),
        y: boundings.top + (boundings.height/2)
      }
    }

    return {
      x: 0,
      y: 0
    }
  }

}
