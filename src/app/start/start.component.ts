import { Component } from '@angular/core';
import { GameService } from '../core/game.service';
import { SaveService } from '../core/save.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
})
export class StartComponent {
	constructor(
		private _gameService: GameService,
		private _saveService: SaveService,
    private _router: Router
	) {}

	get hasSave(): boolean {
		return this._saveService.hasSave();
	}

  get saves(): any[] {
    return this._saveService.saves;
  }

	continue(): void {
    this._saveService.saveIndex = 0;

    this._saveService.loadGame().subscribe(() => {
      setTimeout(() => {
        this._gameService.startGame(false);
      }, 100);
    });

    this._router.navigate(['/girls']);
	}

	newGame(): void {
    this._gameService.newGame.next(true);
	}

	load(): void {
    this._saveService.showSaveChooser.next(true);
	}
}
