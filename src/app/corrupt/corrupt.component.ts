import { Component, OnDestroy, OnInit } from '@angular/core';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { GameService } from '../core/game.service';
import { RewardService } from '../reward/reward.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/item.model';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';
import { Position, PositionType } from '../core/position.model';
import { SettingsService } from '../core/settings.service';

@Component({
	selector: 'app-corrupt',
	templateUrl: './corrupt.component.html',
	styleUrls: ['./corrupt.component.scss'],
})
export class CorruptComponent implements OnInit, OnDestroy {
	girl: Girl = new Girl();
	golds = 0;
	items: Item[] = [];

	priceGrid: number[] = [
		100,
    500,
    2000,
    4500,
    6000,
    8000,
    12_000,
    15_000,
    19_000,
    25_000,
    28_000,
    32_000,
    48_000,
    55_000,
    62_000,
    72_000,
    90_000,
    125_000,
    160_000,
    190_000,
    230_000,
    280_000,
    350_000,
    440_000,
    580_000,
    700_000,
    900_000,
    1_125_000,
	];

	itemsGrid: { itemName: string; quantity: number }[] = [
		{ itemName: 'cum', quantity: 0 },
		{ itemName: 'cum', quantity: 0 },
		{ itemName: 'cum', quantity: 1 },
		{ itemName: 'cum', quantity: 1 },
		{ itemName: 'cum', quantity: 3 },
		{ itemName: 'cum', quantity: 3 },
		{ itemName: 'cum', quantity: 4 },
		{ itemName: 'cum', quantity: 5 },
		{ itemName: 'cum', quantity: 6 },
		{ itemName: 'cum', quantity: 7 },
		{ itemName: 'cum', quantity: 9 },
		{ itemName: 'cum', quantity: 11 },
		{ itemName: 'cum', quantity: 12 },
		{ itemName: 'cum', quantity: 14 },
		{ itemName: 'cum', quantity: 16 },
		{ itemName: 'cum', quantity: 17 },
		{ itemName: 'cum', quantity: 19 },
		{ itemName: 'cum', quantity: 20 },
		{ itemName: 'cum', quantity: 22 },
		{ itemName: 'cum', quantity: 24 },
		{ itemName: 'cum', quantity: 26 },
		{ itemName: 'cum', quantity: 28 },
		{ itemName: 'cum', quantity: 30 },
		{ itemName: 'cum', quantity: 32 },
		{ itemName: 'cum', quantity: 34 },
		{ itemName: 'cum', quantity: 37 },
	];

	portrait: SafeUrl = '';
	corrupt: SafeUrl = '';

	corrupting = false;

	reasonCorruptDisabled = '';

	positions: Position[] = [];
	selectedPosition: Position = new Position();

	positionsDef: Position[] = [];

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _girlsService: GirlsService,
		private _gameService: GameService,
		private _rewardService: RewardService,
		private _router: Router,
		private _inventoryService: InventoryService,
		private _cachingService: CachingService,
    private _settingsService: SettingsService
	) {}

	ngOnInit(): void {
		this._girlsService.currentGirl
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((girl: Girl) => {
				this.girl = girl;

				this.portrait = this._cachingService.getPhoto(girl, '1_' + girl.corruptionName);

        const positions = girl.positions;
        if (positions) {
          this.positionsDef = positions.filter(position => !this._prohibitedType(position));

          const comboPositions: Position[] = [];
          for (const position of this.positionsDef) {
            let currentPosition = position;
            while (this.girl.unlockedPositions.includes(currentPosition.name) && currentPosition.unlocker !== undefined && !this._prohibitedType(currentPosition.unlocker)) {
              comboPositions.push(currentPosition.unlocker);
              currentPosition = currentPosition.unlocker;
            }
          }

          this.positionsDef = [...this.positionsDef, ...comboPositions];
        }
			});
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((gold: number) => (this.golds = gold));

		this.golds = this._gameService.golds;

		this._inventoryService.items
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((items) => (this.items = items));

		this._gameService.pauseGame();
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();

		this._gameService.resumeGame();
	}

	get price(): number {
		return Math.round(
      (this.girl.corruption < this.priceGrid.length
			? this.priceGrid[this.girl.corruption]
			: this.priceGrid[this.priceGrid.length - 1]) * this._settingsService.getSetting('corruption_golds'));
	}

	get itemsRequired(): { itemName: string; quantity: number } {
		if (this.girl.name === 'Yiny') {
			return { itemName: '', quantity: 0 };
		}

    const items = this.girl.corruption < this.itemsGrid.length
    ? this.itemsGrid[this.girl.corruption]
    : this.itemsGrid[this.itemsGrid.length - 1];

		return {itemName: items.itemName, quantity: Math.round(items.quantity * this._settingsService.getSetting('corruption_cum'))}
	}

	doCorrupt(): void {
		if (!this.canCorrupt()) {
			return;
		}
		this.corrupting = true;
	}

	selectPosition(position: Position): void {
		if (this.positionRequirementsMet(position)) {
			this.selectedPosition = position;

			this.corrupt = this._cachingService.getVideo(this.girl, this.selectedPosition.name);

			const vid = <HTMLVideoElement>document.querySelector('#video-position');

			vid.load();
			vid.play();
		}
	}

	endCorrupt(): void {
		this._gameService.updateGolds(this.price * -1);
		this._inventoryService.removeItemByName(
			this.itemsRequired.itemName,
			this.itemsRequired.quantity
		);

		const updatedGirl = this._rewardService.giveReward(
			0,
			0,
			0,
			[],
			Math.round(1 * this._settingsService.getSetting('corruption_positions')),
			this.girl
		);
		this._girlsService.unlockPosition(this.selectedPosition.name, updatedGirl);

		this._gameService.resumeGame();
		this._router.navigate(['girls']);
	}

	positionRequirementsMet(position: Position): boolean {
		let requirementsMet = true;

		if (position.corruption > this.girl.corruption) {
			requirementsMet = false;
		}

		return requirementsMet;
	}

	canCorrupt(): boolean {
		if (this.price > this.golds) {
			this.reasonCorruptDisabled =
				'You need more cash to corrupt ' + this.girl.name;
			return false;
		}

		if (
			this.itemsRequired.quantity > 0 &&
			this.itemsRequired.quantity >
				this.items.filter((item) => item.name === this.itemsRequired.itemName)
					.length
		) {
			this.reasonCorruptDisabled =
				'You need at least ' +
				this.itemsRequired.quantity +
				' ' +
				this.itemsRequired.itemName +
				' to corrupt ' +
				this.girl.name;
			return false;
		}

		return true;
	}

	getPositionDef(positionName: string): Position {
		return (
			this.positionsDef.find((position) => position.name === positionName) ??
			new Position()
		);
	}

  exit(): void {
		this._gameService.resumeGame();
		this._router.navigate(['girls']);
  }

	get newPositions(): Position[] {
		return this.positionsDef.filter(
			(x) => !this.girl.unlockedPositions.includes(x.name)
		);
	}

  private _prohibitedType(position: Position): boolean {
    return position.type === PositionType.INTRO || position.type === PositionType.SKILL || position.type === PositionType.FOREPLAY_SKILL || position.type === PositionType.SPECIAL
  }
}
