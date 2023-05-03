import { Component, OnDestroy, OnInit } from '@angular/core';
import { InventoryService } from './inventory.service';
import { Item } from './item.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, OnDestroy {
	items: [string, string][] = [];
	itemsInventory: Item[] = [];

	private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(private _inventoryService: InventoryService) {}

	ngOnInit(): void {
		this._inventoryService.items
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((items) => {
				this.itemsInventory = items;

				this.items = [...this.groupBy(this.itemsInventory)];
			});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
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
