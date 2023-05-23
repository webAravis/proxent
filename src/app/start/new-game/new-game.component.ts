import { Subject, takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/core/game.service';
import { Setting, SettingType, SettingsService } from 'src/app/core/settings.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

  show = false;
  settings: Setting[] = [];
  difficultyPreset: string[] = ['easy', 'normal', 'hard'];
  selectedDifficulty = 'normal';

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _settingsService: SettingsService,
    private _gameService: GameService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._settingsService.settings.pipe(takeUntil(this._unsubscribeAll)).subscribe(settings => {
      this.settings = settings;
    });

    this._gameService.newGame.pipe(takeUntil(this._unsubscribeAll)).subscribe(show => this.show = show);
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
        for (const setting of this.settings) {
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

  cancel(): void {
    this.show = false;
  }

  startGame(): void {
    this.show = false;
		this._gameService.startGame(true);

		this._router.navigate(['/girls']);
  }


}
