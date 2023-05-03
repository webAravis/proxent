import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudioService } from './studio.service';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { StudioModifier } from './studiomodifier.model';
import { InventoryService } from '../inventory/inventory.service';

@Component({
	selector: 'app-studio',
	templateUrl: './studio.component.html',
	styleUrls: ['./studio.component.scss'],
})
export class StudioComponent implements OnInit, OnDestroy {
	opened = false;
	price = 10_000;
	golds = 0;
	modifiers: StudioModifier[] = [];

	otherStudio = 'Brazzers';
	showOtherStudio = true;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _studioService: StudioService,
		private _gameService: GameService,
		private _inventoryService: InventoryService
	) {}

	ngOnInit(): void {
		this._studioService.opened
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((opened) => (this.opened = opened));
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds) => (this.golds = golds));

		this.golds = this._gameService.golds;

		this._studioService.modifiers
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((modifiers) => (this.modifiers = modifiers));
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	get studioQuality(): number {
		return this._studioService.getStudioQuality();
	}

	open(): void {
		this._studioService.open(this.price);
	}

	hasBadge(modifier: StudioModifier): boolean {
		return this._inventoryService.hasItemByName(modifier.badge + '_badge', 1);
	}

	levelup(modifier: StudioModifier): void {
		if (this.canLevelUp(modifier)) {
			this._studioService.levelupModifier(modifier);
		}
	}

	canLevelUp(modifier: StudioModifier): boolean {
		return !!(
			(modifier.nextLvlCost.type === 'gold' &&
				modifier.nextLvlCost.value(modifier.level) <= this.golds) ||
			this._inventoryService.hasItemByName(
				modifier.nextLvlCost.type,
				modifier.nextLvlCost.value(modifier.level)
			)
		);
	}

	changeStudio(studioName: string): void {
		this.showOtherStudio = false;
		this.otherStudio = studioName;

		setTimeout(() => {
			this.showOtherStudio = true;
		}, 10);
	}
}
