import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FreedomService } from '../freedom.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { GameService } from 'src/app/core/game.service';
import { InventoryService } from 'src/app/inventory/inventory.service';
import { GirlsService } from 'src/app/core/girls/girls.service';
import { Item } from 'src/app/inventory/item.model';
import { SettingsService } from 'src/app/core/settings.service';

@Component({
	selector: 'app-freedom',
	templateUrl: './freedom.component.html',
	styleUrls: ['./freedom.component.scss'],
})
export class FreedomComponent implements OnInit, OnDestroy {
	show = false;
	girl: Girl = new Girl();
	golds = 0;
	items: Item[] = [];

	indexPricing = 0;

	priceGrid: number[] = [
		100, 500, 2000, 4500, 6000, 8000, 12_000, 15_000, 19_000, 25_000,
	];

	itemsGrid: { itemName: string; quantity: number }[] = [
		{ itemName: 'cum', quantity: 2 },
		{ itemName: 'cum', quantity: 3 },
		{ itemName: 'cum', quantity: 4 },
		{ itemName: 'cum', quantity: 5 },
		{ itemName: 'cum', quantity: 6 },
		{ itemName: 'cum', quantity: 7 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 9 },
		{ itemName: 'cum', quantity: 10 },
		{ itemName: 'cum', quantity: 11 },
	];

	reasonDisabled = '';

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _freedomService: FreedomService,
		private _gameService: GameService,
		private _inventoryService: InventoryService,
		private _girlsService: GirlsService,
    private _settingsService: SettingsService
	) {}

	ngOnInit(): void {
		this._freedomService.showFreedomReducer
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((girl: Girl) => {
				this.girl = girl;

				this.indexPricing = Math.round((1 - this.girl.freedom) * 10);
				this.show = true;
			});

		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((gold: number) => (this.golds = gold));

		this.golds = this._gameService.golds;

		this._inventoryService.items
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((items) => (this.items = items));
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	get price(): number {
		return Math.round( (this.priceGrid[this.indexPricing] ?? this.priceGrid[this.priceGrid.length - 1]) * this._settingsService.getSetting('girl_freedom_golds_cost') );
	}

	get itemsRequired(): { itemName: string; quantity: number } {

    const items = this.itemsGrid[this.indexPricing] ?? this.itemsGrid[this.itemsGrid.length - 1];

		return {itemName: items.itemName, quantity: Math.round(items.quantity * this._settingsService.getSetting('girl_freedom_item_cost'))}
	}

	close(): void {
		this.girl = new Girl();
		this.show = false;
	}

	canReduce(): boolean {
		if (this.price > this.golds) {
			this.reasonDisabled =
				'You need more cash to reduce ' + this.girl.name + "'s independency";
			return false;
		}

		if (
			this.itemsRequired.quantity > 0 &&
			this.itemsRequired.quantity >
				this.items.filter((item) => item.name === this.itemsRequired.itemName)
					.length
		) {
			this.reasonDisabled =
				'You need at least ' +
				this.itemsRequired.quantity +
				' ' +
				this.itemsRequired.itemName +
				' to reduce ' +
				this.girl.name +
				"'s independency";
			return false;
		}

		return true;
	}

	doReduce(): void {
		this._gameService.updateGolds(this.price * -1);
		this._inventoryService.removeItemByName(
			this.itemsRequired.itemName,
			this.itemsRequired.quantity
		);

		this.girl.freedom -= 0.1;
    if (this.girl.freedom < 0.1) {
      this.girl.freedom = 0;
    }
		this._girlsService.updateGirl(this.girl);

		this.close();
	}
}
