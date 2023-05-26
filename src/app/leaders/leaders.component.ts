import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeadersService } from './leaders.service';
import { Leader } from './leader.model';
import { GameService } from '../core/game.service';
import { InventoryService } from '../inventory/inventory.service';
import { Router } from '@angular/router';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit, OnDestroy {

  leaders: Leader[] = [];
	golds = 0;

  girls: Girl[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
		private _gameService: GameService,
		private _inventoryService: InventoryService,
    private _router: Router,
    private _girlService: GirlsService
  ) {}

  ngOnInit(): void {
    this._leaderService.leaders.pipe(takeUntil(this._unsubscribeAll)).subscribe((leaders: Leader[]) => this.leaders = leaders);
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds: number) => (this.golds = golds));

		this.golds = this._gameService.golds;

    this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => this.girls = girls.filter(girl => !girl.locked));
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
			(leader.costItem === 'gold' &&
      leader.costCurve(leader.lvl) <= this.golds) ||
			this._inventoryService.hasItemByName(
				leader.costItem,
				leader.costCurve(leader.lvl)
			)
		);
  }

  battle(leader: Leader): void {
    if (this.canBattle(leader)) {

      if (leader.costItem === 'gold') {
        this._gameService.updateGolds(
          leader.costCurve(leader.lvl) * -1
        );
      } else {
        this._inventoryService.removeItemByName(
          leader.costItem,
          leader.costCurve(leader.lvl)
        );
      }

      this._leaderService.leaderBattle.next(leader);
      this._router.navigate(['battle']);

    }
  }

  getGirlWithAttribute(attribute: string): string {
    const matching = this.girls.filter(girl => girl.attributes.includes(attribute)).map(girl => girl.name).join(', ');
    return matching !== '' ? matching : 'No girl match';
  }

  getGirlWithPosition(position: string): string {
    const matching = this.girls
      .filter(
        girl =>
          girl.unlockedPositions.includes(position) ||
          girl.skills.filter(treeskill => treeskill.skillTiers.filter(skilltier => skilltier.skills.filter(skill => skill.effects[skill.level] !== undefined && skill.effects[skill.level].map(skilleffect => skilleffect.stat).includes('scene') && skill.effects[skill.level].map(skilleffect => skilleffect.value.toLowerCase()).includes(position.toLowerCase()) ).length > 0).length > 0)
      )
      .map(girl => girl.name).join(', ');

    return matching !== '' ? matching : 'No girl match';
  }

}
