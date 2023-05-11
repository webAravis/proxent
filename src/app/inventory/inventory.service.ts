import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from './item.model';
import { GameService } from '../core/game.service';

@Injectable({
	providedIn: 'root',
})
export class InventoryService {
	items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

	constructor(private _gameService: GameService) {}

	addItem(item: Item): void {
		const items = this.items.getValue();
		items.push(item);

		this.items.next(items);
	}

	removeItem(itemtoremove: Item): void {
		const items = this.items.getValue();
		const toSave = [];

		let removed = false;
		for (const item of items) {
			if (!removed && item.name === itemtoremove.name) {
				removed = true;
				continue;
			}

			toSave.push(item);
		}

		this.items.next(toSave);
	}

	removeItemByName(name: string, quantity: number): void {
		const items = this.items.getValue();
		const toSave = [];

		let removed = 0;
		for (const item of items) {
			if (removed < quantity && item.name === name) {
				removed++;
				continue;
			}

			toSave.push(item);
		}

		this.items.next(toSave);
	}

	hasItemByName(name: string, quantity: number): boolean {
		return (
			this.items.getValue().filter((item: Item) => item.name === name).length >=
			quantity
		);
	}

	sellItem(item: Item): void {
		this.removeItem(item);
		this._gameService.updateGolds(item.price);
	}
}
