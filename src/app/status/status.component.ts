import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../inventory/inventory.service';
import { SaveService } from '../core/save.service';
import { League } from '../leaders/league.model';
import { MastersService } from '../leaders/masters.service';

@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit, OnDestroy {
	golds = 0;
	day = 1;
	month = 1;
	year = 1;
  secondsSave = 0;

	badges: string[] = [
		'recordmonthly',
		'recordyearly',
		'studiomonthly',
		'studioyearly',
		'money',
		'fans',
	];

  league: League = new League();

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  private _intervalSave: NodeJS.Timer | undefined;

	constructor(
		private _gameService: GameService,
		private _inventoryService: InventoryService,
    private _masterService: MastersService,
    private _saveService: SaveService
	) {}

	ngOnInit() {
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds) => (this.golds = golds));
		this._gameService.dayChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(() => {
				this.day = this._gameService.day;
				this.month = this._gameService.month;
				this.year = this._gameService.year;
			});

    this._masterService.leagues.pipe(takeUntil(this._unsubscribeAll)).subscribe(leagues => this.league = leagues.find(league => league.isCurrentLeague) ?? new League());

    clearInterval(this._intervalSave);
    this._intervalSave = setInterval(() => this.secondsSave = Math.round(Math.abs((this._saveService.saved.getValue().getTime() - new Date().getTime()) / 1000)), 1000);
	}

	ngOnDestroy(): void {
    clearInterval(this._intervalSave);

		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

  hasBadge(badge: string): boolean {
		return this._inventoryService.hasItemByName(badge + '_badge', 1);
	}

  badgeQuantity(badge: string): number {
		return this._inventoryService.quantity(badge + '_badge');
	}

  itemQuantity(itemName: string): number {
    return this._inventoryService.quantity(itemName);
  }

  saveGame(): void {
    this._saveService.saveGame();
  }
}
