import { Subject, takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/core/game.service';
import { Setting, SettingType, SettingsService } from 'src/app/core/settings.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { GirlsService } from 'src/app/core/girls/girls.service';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from 'src/app/core/caching.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

  show = true;
  settings: Setting[] = [];
  difficultyPreset: string[] = ['easy', 'normal', 'hard'];
  selectedDifficulty = 'normal';

  girls: Girl[] = [];
	portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();

  girlfriend: Girl = new Girl();

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _settingsService: SettingsService,
    private _gameService: GameService,
    private _girlService: GirlsService,
    private _router: Router,
    private _cachingService: CachingService
  ) { }

  ngOnInit(): void {
    this._settingsService.settings.pipe(takeUntil(this._unsubscribeAll)).subscribe(settings => {
      this.settings = settings;
    });

    this._gameService.newGame.pipe(takeUntil(this._unsubscribeAll)).subscribe(show => this.show = show);

    this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe((girls: Girl[]) => {
      this.girls = girls;

      for (const girl of this.girls) {
        this.portraits.set(
          girl.name,
          this._cachingService.getPhoto(girl, '1_normal')
        );
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  get costs(): Setting[] {
    return this.settings.filter(setting => setting.type === SettingType.cost);
  }

  get rewards(): Setting[] {
    return this.settings.filter(setting => setting.type === SettingType.reward);
  }

  get difficultySettings(): Setting[] {
    return this.settings.filter(setting => setting.type === SettingType.reward || setting.type === SettingType.cost);
  }

  setDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;

    switch (difficulty) {
      case 'easy':
        for (const setting of this.costs) {
          setting.value = 50;
        }
        for (const setting of this.rewards) {
          setting.value = 150;
        }
        break;
      case 'normal':
        for (const setting of this.difficultySettings) {
          setting.value = 100;
        }
        break;
      case 'hard':
        for (const setting of this.rewards) {
          setting.value = 50;
        }
        for (const setting of this.costs) {
          setting.value = 150;
        }
        break;
    }
  }

  getMultipliers(girl: Girl): {percent: number, stat: string}[] {
    const multipliers: {percent: number, stat: string}[] = [];

    if (girl.xpModifier !== 1) {
      multipliers.push({percent: girl.xpModifier*100, stat: 'experience'});
    }

    if (girl.cumModifier !== 1) {
      multipliers.push({percent: girl.cumModifier*100, stat: 'cum'});
    }

    if (girl.fansModifier !== 1) {
      multipliers.push({percent: girl.fansModifier*100, stat: 'fans'});
    }

    if (girl.goldsModifier !== 1) {
      multipliers.push({percent: girl.goldsModifier*100, stat: 'golds'});
    }

    if (girl.pointsModifier !== 1) {
      multipliers.push({percent: girl.pointsModifier*100, stat: 'pts'});
    }

    return multipliers;
  }

  selectGirlfriend(girl: Girl): void {
    this.girlfriend = girl;
  }

	getPortrait(girl: Girl): SafeUrl | undefined {
		return this.portraits.get(girl.name);
	}

  cancel(): void {
    this.show = false;
  }

  startGame(): void {
    if (this.girlfriend.name !== '') {
      this._gameService.girlfriend = this.girlfriend.fullId;

      this.girlfriend.freedom = 0;
      this._girlService.addGirl(this.girlfriend);

      this.show = false;
      this._gameService.startGame(true);

      this._router.navigate(['/girls']);
    }
  }


}
