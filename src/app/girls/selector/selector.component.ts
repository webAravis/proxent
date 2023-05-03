import {
	Component,
	EventEmitter,
	Input,
	Output,
	AfterViewInit,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { GameService } from 'src/app/core/game.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { InventoryService } from 'src/app/inventory/inventory.service';

@Component({
	selector: 'app-selector',
	templateUrl: './selector.component.html',
	styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements AfterViewInit {
	@Input() girls: Girl[] = [];
	@Input() allGirls: Girl[] = [];
	@Input() selectedGirl: Girl = new Girl();
	@Input() portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();
	@Input() golds = 0;

	@Output() selected = new EventEmitter<Girl>();
	@Output() girlUnlocked = new EventEmitter<Girl>();

	clickAgain = 0;

	private _scroller: HTMLElement = document.createElement('div');

	constructor(
		private _inventoryService: InventoryService,
		private _gameService: GameService
	) {}

	ngAfterViewInit(): void {
		const element = <HTMLElement>document.querySelector('#scroller');
		if (element !== null) {
			this._scroller = element;
		}

		if (this.selectedGirl.name === '') {
			this.selectGirl(this.girls[0]);
		} else {
			this.selectGirl(this.selectedGirl);
		}
	}

	onWheel(event: WheelEvent): void {
		event.preventDefault();
		this._scroller.scrollLeft += event.deltaY;
	}

	selectGirl(girl: Girl): void {
		if (this.clickAgain === girl.id) {
			this._unlockGirl(girl);
		}

		if (!this.isLocked(girl)) {
			this.selectedGirl = girl;
			this.selected.emit(girl);

			setTimeout(() => {
				const element = document.querySelector('#girl-' + girl.id);
				if (element !== null) {
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					});
				}
			}, 201);
		} else if (this.canAfford(girl)) {
			this.clickAgain = girl.id;
		}
	}

	getPortrait(girl: Girl): SafeUrl | undefined {
		return this.portraits.get(girl.name);
	}

	isLocked(girl: Girl): boolean {
		return !this.girls.some(
			(unlockedGirl: Girl) => unlockedGirl.id === girl.id
		);
	}

	canAfford(girl: Girl): boolean {
		if (girl.unlockPrice.length === 0) {
			return false;
		}

		for (const price of girl.unlockPrice) {
			if (price.type === 'gold' && price.quantity >= this.golds) {
				return false;
			}

			if (
				price.type !== 'gold' &&
				!this._inventoryService.hasItemByName(price.type, price.quantity)
			) {
				return false;
			}
		}

		return true;
	}

	private _unlockGirl(girl: Girl): void {
		this.girls.push(girl);

		for (const price of girl.unlockPrice) {
			if (price.type === 'gold') {
				this._gameService.updateGolds(price.quantity * -1);
			} else {
				this._inventoryService.removeItemByName(price.type, price.quantity);
			}
		}

		this.clickAgain = 0;
		this.girlUnlocked.emit(girl);
	}
}
