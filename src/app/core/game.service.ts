import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogsService } from '../dialogs/dialogs.service';

@Injectable({
	providedIn: 'root',
})
export class GameService {
  fapMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	golds = 3000;
	goldChanged: BehaviorSubject<number> = new BehaviorSubject<number>(3000);

	day = 1;
	dayChanged: BehaviorSubject<number> = new BehaviorSubject<number>(1);
	month = 1;
	monthChanged: BehaviorSubject<number> = new BehaviorSubject<number>(1);
	year = 1;
	yearChanged: BehaviorSubject<number> = new BehaviorSubject<number>(1);

	dayTicker: NodeJS.Timer | undefined;
	msDayTicker = 2000;

	dialogsStarted: boolean[] = [false, false, false];

	isPaused = true;
  gameState: BehaviorSubject<boolean> = new BehaviorSubject(true);

  girlLimit: BehaviorSubject<number> = new BehaviorSubject<number>(2);

	constructor(private _dialogsService: DialogsService) {}

	startGame(newgame = false): void {
		if (newgame) {
			// it's a new game, start intro dialog
			setTimeout(() => {
				// todo: replace with a splash screen introducing teaser
				this._dialogsService.startDialog(0);
			}, 200);
		}

		this.resumeGame();
	}

	pauseGame(): void {
		this.isPaused = true;
    this.gameState.next(true);

		clearInterval(this.dayTicker);
	}

	resumeGame(): void {
		this.isPaused = false;
    this.gameState.next(false);

		clearInterval(this.dayTicker);

		this.dayTicker = setInterval(() => {
			this.day++;
			if (this.day >= 31) {
				this.day = 1;
				this.month++;
				this.month === 13 ? undefined : this.monthChanged.next(this.month);
			}

			if (this.month >= 13) {
				this.year++;
				this.month = 1;
				this.yearChanged.next(this.year);
			}

			this.goldChanged.next(this.golds);
			this.dayChanged.next(this.day);
		}, this.msDayTicker);
	}

	updateGolds(amount: number): void {
		this.golds += amount;
		this.goldChanged.next(this.golds);
	}
}
