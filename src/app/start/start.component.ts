import { Component } from '@angular/core';
import { GameService } from '../core/game.service';
import { Router } from '@angular/router';
import { SaveService } from '../core/save.service';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
})
export class StartComponent {
	constructor(
		private _gameService: GameService,
		private _router: Router,
		private _saveService: SaveService
	) {}

	get hasSave(): boolean {
		return this._saveService.hasSave();
	}

	continue(): void {
		this._saveService.loadGame().subscribe(() => {
			setTimeout(() => {
				this._gameService.startGame(false);
			}, 100);
		});

		this._router.navigate(['/girls']);
	}

	newGame(): void {
		this._gameService.startGame(true);

		this._router.navigate(['/girls']);
	}
}
