import { Component, OnDestroy, OnInit } from '@angular/core';
import { RewardService } from './reward.service';
import { Reward } from '../core/reward.model';
import { Subject, takeUntil } from 'rxjs';
import { Item } from '../inventory/item.model';

@Component({
	selector: 'app-reward',
	templateUrl: './reward.component.html',
	styleUrls: ['./reward.component.scss'],
})
export class RewardComponent implements OnInit, OnDestroy {
	show = false;
	reward: Reward = new Reward();
	items: [string, string][] = [];

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(private _rewardService: RewardService) {}

	ngOnInit(): void {
		this._rewardService.show
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((reward: Reward) => {
				this.reward = reward;
				this.items = [...this.groupBy(this.reward.items)];

				this.show = true;
			});
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	close(): void {
		this.show = false;
		this.reward = new Reward();
	}

	groupBy(list: Item[]) {
		const map = new Map();
		for (const item of list) {
			const key = item.name;
			const collection = map.get(key);
			if (collection) {
				collection.push(item);
			} else {
				map.set(key, [item]);
			}
		}
		return map;
	}
}
