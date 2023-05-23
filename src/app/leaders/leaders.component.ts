import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeadersService } from './leaders.service';
import { Leader } from './leader.model';
import { GameService } from '../core/game.service';
import { InventoryService } from '../inventory/inventory.service';
import { Router } from '@angular/router';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { SkillsService } from '../skills/skills.service';
import { TreeSkills } from '../skills/treeskills.model';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit, OnDestroy {

  leaders: Leader[] = [];
	golds = 0;

  girls: Girl[] = [];
  treeskills: TreeSkills[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
		private _gameService: GameService,
		private _inventoryService: InventoryService,
    private _router: Router,
    private _girlService: GirlsService,
    private _skillsService: SkillsService
  ) {}

  ngOnInit(): void {
    this._leaderService.leaders.pipe(takeUntil(this._unsubscribeAll)).subscribe((leaders: Leader[]) => this.leaders = leaders);
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds: number) => (this.golds = golds));

		this.golds = this._gameService.golds;

    this._girlService.playerGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => this.girls = girls);
    this._skillsService.treeSkills.pipe(takeUntil(this._unsubscribeAll)).subscribe(treeskills => this.treeskills = treeskills);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(false);
    this._unsubscribeAll.complete();
  }

  getMetaScore(leader: Leader) {
    return this._leaderService.getMetaScore(leader);
  }

  getMetaCum(leader: Leader) {
    return this._leaderService.getMetaCum(leader);
  }

  canBattle(leader: Leader): boolean {
		return !!(
			(leader.nextLvlCost.type === 'gold' &&
      leader.nextLvlCost.value(leader.lvl) <= this.golds) ||
			this._inventoryService.hasItemByName(
				leader.nextLvlCost.type,
				leader.nextLvlCost.value(leader.lvl)
			)
		);
  }

  battle(leader: Leader): void {
    if (this.canBattle(leader)) {

      if (leader.nextLvlCost.type === 'gold') {
        this._gameService.updateGolds(
          leader.nextLvlCost.value(leader.lvl) * -1
        );
      } else {
        this._inventoryService.removeItemByName(
          leader.nextLvlCost.type,
          leader.nextLvlCost.value(leader.lvl)
        );
      }

      this._leaderService.leaderBattle.next(leader);
      this._router.navigate(['battle']);

    }
  }

  getRewards(name: string): {text: string, item: string} {
    let rewards: {text: string, item: string} = {text: '', item: ''};
    switch (name.toLowerCase()) {
      case 'expandor':
        rewards = {text: 'Girl limit increased!', item: ''};
        break;
      case 'skillus':
        rewards = {text: '+1', item: 'basic_skill_gem'};
        break;
      case 'aniter':
      case 'multiplor':
      case 'blows':
      case 'savager':
        rewards = {text: '+1', item: 'advanced_skill_gem'};
        break;
    }

    return rewards;
  }

  getGirlWithAttribute(attribute: string): string {
    const matching = this.girls.filter(girl => girl.attributes.includes(attribute)).map(girl => girl.name).join(', ');
    return matching !== '' ? matching : 'No girl match';
  }

  getGirlWithPosition(position: string): string {
    const matchingPositions = this.girls.filter(girl => girl.unlockedPositions.includes(position)).map(girl => girl.name);
    const matchingSkills = this.treeskills.filter(treeskill => treeskill.skillTiers.filter(skilltier => skilltier.skills.filter(skill => skill.effects[skill.level] !== undefined && skill.effects[skill.level].map(skilleffect => skilleffect.stat).includes('scene') && skill.effects[skill.level].map(skilleffect => skilleffect.value.toLowerCase()).includes(position.toLowerCase()) ).length > 0).length > 0).map(treeskill => treeskill.girl.name);

    const matching = matchingPositions.filter(matchingGirl => !matchingSkills.includes(matchingGirl)).join(', ');
    return matching !== '' ? matching : 'No girl match';
  }

}
