import { Component, OnDestroy, OnInit } from '@angular/core';
import { Setting, SettingType, SettingsService } from '../core/settings.service';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings: Setting[] = [];
  difficultyPreset: string[] = ['easy', 'normal', 'hard'];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _settingsService: SettingsService,
    private _gameService: GameService,
    private _router: Router
  ) {
    this._settingsService.settings.pipe(takeUntil(this._unsubscribeAll)).subscribe(settings => {
      this.settings = settings;
    });
  }

  ngOnInit(): void {
    this._gameService.pauseGame();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();

    this._gameService.resumeGame();
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

  get gameSettings(): Setting[] {
    return this.settings.filter(setting => setting.type === SettingType.sound);
  }

  setDifficulty(difficulty: string): void {
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

  saveAll(): void {
    this._router.navigate(['girls']);
  }

}
