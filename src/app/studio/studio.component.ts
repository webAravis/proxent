import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudioService } from './studio.service';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { StudioModifier } from './studiomodifier.model';
import { InventoryService } from '../inventory/inventory.service';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.component.html',
  styleUrls: ['./studio.component.scss'],
})
export class StudioComponent implements OnInit, OnDestroy {
  pickedGirl: Girl = new Girl();
  girls: Girl[] = [];
	portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();

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
    private _girlService: GirlsService,
    private _cachingService: CachingService,
    private _inventoryService: InventoryService
  ) { }

  ngOnInit(): void {
    this._studioService.opened.pipe(takeUntil(this._unsubscribeAll)).subscribe((opened) => (this.opened = opened));
    this._gameService.goldChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((golds) => (this.golds = golds));

    this.golds = this._gameService.golds;

    this._studioService.modifiers.pipe(takeUntil(this._unsubscribeAll)).subscribe((modifiers) => (this.modifiers = modifiers));
    this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => {
      this.girls = girls.filter(girl => girl.fullId !== this._gameService.girlfriend);

      for (const girl of this.girls) {
        this.portraits.set(
          girl.name,
          this._cachingService.getPhoto(girl, '1_normal')
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  pickGirl(girl: Girl): void {
    this.pickedGirl = girl;
  }

	getPortrait(girl: Girl): SafeUrl | undefined {
		return this.portraits.get(girl.name);
	}

  get studioQuality(): number {
    return this._studioService.getStudioQuality();
  }

  open(): void {
    this._studioService.open(this.price, this.pickedGirl);
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
