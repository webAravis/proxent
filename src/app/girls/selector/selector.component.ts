import {
	Component,
	EventEmitter,
	Input,
	Output,
	AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { SettingsService } from 'src/app/core/settings.service';
import { InventoryService } from 'src/app/inventory/inventory.service';

@Component({
	selector: 'app-selector',
	templateUrl: './selector.component.html',
	styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() allGirls: Girl[] = [];
	@Input() selectedGirl: Girl = new Girl();
	@Input() portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();
	@Input() golds = 0;

	@Output() selected = new EventEmitter<Girl>();
	@Output() girlUnlocked = new EventEmitter<Girl>();

	clickAgain = "0";
  girlLimit = 0;

	private _scroller: HTMLElement = document.createElement('div');
  private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _inventoryService: InventoryService,
		private _gameService: GameService,
    private _settingsService: SettingsService
	) {}

  ngOnInit(): void {
    this._gameService.girlLimit.pipe(takeUntil(this._unsubscribeAll)).subscribe((girlLimit: number) => {
      this.girlLimit = girlLimit;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

	ngAfterViewInit(): void {
		const element = <HTMLElement>document.querySelector('#scroller');
		if (element !== null) {
			this._scroller = element;
		}

		if (this.selectedGirl.name === '') {
			this.selectGirl(this.allGirls.filter(girl => !girl.locked)[0]);
		} else {
			this.selectGirl(this.selectedGirl);
		}
	}

  get girlLimitReached(): boolean {
    return this.allGirls.filter(girl => !girl.locked).length-1 >= this.girlLimit;
  }

	onWheel(event: WheelEvent): void {
		event.preventDefault();
		this._scroller.scrollLeft += event.deltaY;
	}

	selectGirl(girl: Girl): void {
    if (this.isLocked(girl) && this.girlLimitReached) {
      return;
    }

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
		return girl.locked
	}

	canAfford(girl: Girl): boolean {
		if (girl.unlockPrice.length === 0) {
			return false;
		}

		for (const price of girl.unlockPrice) {
			if (price.type === 'gold' && this.getPrice(price) >= this.golds) {
				return false;
			}

			if (
				price.type !== 'gold' &&
				!this._inventoryService.hasItemByName(price.type, this.getPrice(price))
			) {
				return false;
			}
		}

		return true;
	}

  getPrice(unlockPrice: {type: string, quantity: number}): number {
    let price = unlockPrice.quantity;

    if (unlockPrice.type === 'gold') {
      price = Math.round(price * this._settingsService.getSetting('girl_unlock_golds'));
    } else {
      price = Math.round(price * this._settingsService.getSetting('girl_unlock_items'));
    }

    return price;
  }

	private _unlockGirl(girl: Girl): void {

		for (const price of girl.unlockPrice) {
			if (price.type === 'gold') {
				this._gameService.updateGolds(this.getPrice(price) * -1);
			} else {
				this._inventoryService.removeItemByName(price.type, this.getPrice(price));
			}
		}

		this.clickAgain = "0";
		this.girlUnlocked.emit(girl);

	}
}
