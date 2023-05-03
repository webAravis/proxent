import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../inventory/inventory.service';

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

	badges: string[] = [
		'recordmonthly',
		'recordyearly',
		'studiomonthly',
		'studioyearly',
		'money',
		'fans',
	];

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _gameService: GameService,
		private _inventoryService: InventoryService
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
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	hasBadge(badge: string): boolean {
		return this._inventoryService.hasItemByName(badge + '_badge', 1);
	}
}
