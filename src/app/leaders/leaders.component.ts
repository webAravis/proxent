import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeadersService } from './leaders.service';
import { Leader } from './leader.model';
import { GameService } from '../core/game.service';
import { InventoryService } from '../inventory/inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit, OnDestroy {

  leaders: Leader[] = [];
	golds = 0;

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
		private _gameService: GameService,
		private _inventoryService: InventoryService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._leaderService.leaders.pipe(takeUntil(this._unsubscribeAll)).subscribe((leaders: Leader[]) => this.leaders = leaders);
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds: number) => (this.golds = golds));

		this.golds = this._gameService.golds;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(false);
    this._unsubscribeAll.complete();
  }

  hasTrophy(leader: Leader): boolean {
    return true;
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


}
