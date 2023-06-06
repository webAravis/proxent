import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CeremonyService } from './ceremony.service';
import { Record } from '../record/record.model';
import { Item } from '../inventory/item.model';
import { InventoryService } from '../inventory/inventory.service';
import { GameService } from '../core/game.service';

@Component({
	selector: 'app-ceremony',
	templateUrl: './ceremony.component.html',
	styleUrls: ['./ceremony.component.scss'],
})
export class CeremonyComponent implements OnInit, OnDestroy {
	show = false;

	rewards: { studio: string; value: number }[] = [];
	ceremonyMode = 'monthly';

	records: Record[] = [];
	intervalCheck: NodeJS.Timer | undefined;

	awards = ['record', 'studio', 'money', 'fans'];
	indexCheck = 0;

	private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _ceremonyService: CeremonyService,
		private _inventoryService: InventoryService,
		private _gameService: GameService
	) {}

	ngOnInit(): void {
		this._ceremonyService.monthlyRewards
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((records) => {
				this.ceremonyMode = 'monthly';
				this.initCeremony(records);
			});

		this._ceremonyService.yearlyRewards
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((records) => {
				this.ceremonyMode = 'yearly';
				this.initCeremony(records);
			});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();

		clearInterval(this.intervalCheck);
	}

	initCeremony(records: Record[]): void {
		this._gameService.pauseGame();

		this.records = records;

		this.show = true;
		this.indexCheck = 0;
		this.rewards = [];

    clearInterval(this.intervalCheck);
		this.intervalCheck = setInterval(() => this.checkAward(), 200);
	}

	checkAward(): void {
		if (this.indexCheck < this.awards.length) {
			const awardToCheck = this.awards[this.indexCheck];
			let won = new Record();

			switch (awardToCheck) {
				case 'record': {
					won = [...this.records].sort((a, b) => b.score - a.score)[0];
					this.rewards.push({
						studio: won.studioName,
						value: Math.round(won.score),
					});
					break;
				}
				case 'studio': {
					won = [...this.records].sort(
						(a, b) => b.studioscore - a.studioscore
					)[0];
					this.rewards.push({
						studio: won.studioName,
						value: Math.round(won.studioscore),
					});
					break;
				}
				case 'money': {
					won = [...this.records].sort((a, b) => b.money - a.money)[0];
					this.rewards.push({
						studio: won.studioName,
						value: Math.round(won.money),
					});
					break;
				}
				case 'fans': {
					won = [...this.records].sort((a, b) => b.fans - a.fans)[0];
					this.rewards.push({
						studio: won.studioName,
						value: Math.round(won.fans),
					});
					break;
				}
			}

			won.studioName === 'player' ? this._giveBadge(awardToCheck) : undefined;
		} else {
			clearInterval(this.intervalCheck);
		}

		this.indexCheck++;
	}

	close(): void {
		this._gameService.resumeGame();
		clearInterval(this.intervalCheck);
		this.show = false;
	}

	private _giveBadge(awardToCheck: string): void {
		let badgeName = awardToCheck;
		if (awardToCheck === 'record' || awardToCheck === 'studio') {
			badgeName += this.ceremonyMode;
		}
		badgeName += '_badge';

		const badge = new Item();
		badge.name = badgeName;
		badge.price = 10_000;
		badge.quality = 'epic';

		this._inventoryService.addItem(badge);
	}
}
