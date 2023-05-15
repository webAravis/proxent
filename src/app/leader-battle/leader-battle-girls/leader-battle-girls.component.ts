import { takeUntil, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { Girl } from 'src/app/core/girls/girl.model';
import { GirlsService } from 'src/app/core/girls/girls.service';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from 'src/app/core/caching.service';
import { EventEmitter } from '@angular/core';
import { BattleSetup } from '../leader-battle.component';
import { Position } from 'src/app/core/position.model';

@Component({
  selector: 'app-leader-battle-girls',
  templateUrl: './leader-battle-girls.component.html',
  styleUrls: ['./leader-battle-girls.component.scss']
})
export class LeaderBattleGirlsComponent implements OnInit, OnDestroy {

  @Output() battleSetup: EventEmitter<BattleSetup[]> = new EventEmitter();

  show = false;
  girls: Girl[] = [];
  positions: Position[] = [];
	portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();

  setup: BattleSetup[] = [];

  selectedGirl: Girl | undefined;
  selectedPosition: Position | undefined;

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _girlService: GirlsService,
    private _cachingService: CachingService
  ) {}

  ngOnInit(): void {
    this._girlService.playerGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe((girls: Girl[]) => {
      girls = girls.sort((a, b) => a.id - b.id);
      this.girls = girls.filter((girl: Girl) => girl.id !== 1);

      for (const girl of this.girls) {
        this.portraits.set(
          girl.name,
          this._cachingService.getPhoto(girl.name, '1_' + girl.corruptionName)
        );
      }
    });

    setTimeout(() => {
      this.show = true;
    }, 500);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

	getPortrait(girl: Girl): SafeUrl | undefined {
		return this.portraits.get(girl.name);
	}

  chooseGirl(girl: Girl): void {
    const positions = this._girlService.getTimingRecord(girl);
    if (positions) {
      this.positions = positions.filter((position: Position) => girl.unlockedPositions.includes(position.name));
    }

    this.selectedGirl = girl;
  }

  unselectGirl() : void {
    this.selectedGirl = undefined;
    this.selectedPosition = undefined;
    this.positions = [];
  }

  lockSetup(): void {
    if (this.selectedGirl && this.selectedPosition) {
      this.setup.push({girl: this.selectedGirl, position: this.selectedPosition});
      this.unselectGirl();

      if (this.setup.length === 5) {
        this.battleSetup.next(this.setup);
        this.show = false;
      }
    }
  }

}
