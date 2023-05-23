import { Component } from '@angular/core';
import { GameService } from '../core/game.service';
import { SaveService } from '../core/save.service';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
})
export class StartComponent {
	constructor(
		private _gameService: GameService,
		private _saveService: SaveService
	) {}

	get hasSave(): boolean {
		return this._saveService.hasSave();
	}

	continue(): void {
    this._saveService.showSaveChooser.next(true);
	}

	newGame(): void {
    this._gameService.newGame.next(true);
	}
}
