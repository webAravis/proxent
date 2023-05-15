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
import { Position } from '../core/position.model';

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
		100, 500, 2000, 4500, 6000, 8000, 12_000, 15_000, 19_000, 25_000,
	];

	itemsGrid: { itemName: string; quantity: number }[] = [
		{ itemName: 'cum', quantity: 5 },
		{ itemName: 'cum', quantity: 6 },
		{ itemName: 'cum', quantity: 7 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
		{ itemName: 'cum', quantity: 8 },
	];

	portrait: SafeUrl = '';
	corrupt: SafeUrl = '';

	corrupting = false;
	canEnd = false;

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
		private _cachingService: CachingService
	) {}

	ngOnInit(): void {
		this._girlsService.currentGirl
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((girl: Girl) => {
				this.girl = girl;

				this.portrait = this._cachingService.getPhoto(girl.name, '1_' + girl.corruptionName);

        const positions = this._girlsService.getTimingRecord(girl);
        if (positions) {
          this.positionsDef = positions.filter(position => position.name !== 'intro');
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
		return this.girl.corruption < this.priceGrid.length
			? this.priceGrid[this.girl.corruption]
			: this.priceGrid[this.priceGrid.length - 1];
	}

	get itemsRequired(): { itemName: string; quantity: number } {
		if (this.girl.name === 'Yiny') {
			return { itemName: '', quantity: 0 };
		}

		return this.girl.corruption < this.itemsGrid.length
			? this.itemsGrid[this.girl.corruption]
			: this.itemsGrid[this.itemsGrid.length - 1];
	}

	doCorrupt(): void {
		if (!this.canCorrupt()) {
			return;
		}
		this.corrupting = true;

		setTimeout(() => {
			this.canEnd = true;
		}, 3000);
	}

	selectPosition(position: Position): void {
		if (this.positionRequirementsMet(position)) {
			this.selectedPosition = position;

			this.corrupt = this._cachingService.getVideo(this.girl.name, this.selectedPosition.name);

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
			1,
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
		if (this.newPositions.length === 0) {
			this.reasonCorruptDisabled =
				'You already unlocked all positions for ' + this.girl.name;
			return false;
		}

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

	get newPositions(): Position[] {
		return this.positionsDef.filter(
			(x) => !this.girl.unlockedPositions.includes(x.name)
		);
	}
}
