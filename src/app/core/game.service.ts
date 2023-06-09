import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogsService } from '../dialogs/dialogs.service';

@Injectable({
	providedIn: 'root',
})
export class GameService {
  tutorials = {
    girlScreenDone: false,
    shootingScreenDone: false,
    recordScreenDone: false,
    leaderScreenDone: false,
    contractScreenDone: false
  };

  newGame: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
	msDayTicker = 4000;

	dialogsStarted: boolean[] = [false, false, false];

	isPaused = true;
  gameState: BehaviorSubject<boolean> = new BehaviorSubject(true);

  girlLimit: BehaviorSubject<number> = new BehaviorSubject<number>(2);
  girlfriend: string = '';

	constructor(private _dialogsService: DialogsService) {
    this._dialogsService.dialogShown.subscribe((shown) => shown ? this.pauseGame() : this.resumeGame());
  }

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

    let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		clearInterval(this.dayTicker);
		this.dayTicker = setInterval(() => {
			this.day++;
			if (this.day > monthLengths[this.month-1]) {
				this.day = 1;
				this.month++;
				this.month === 13 ? this.monthChanged.next(1) : this.monthChanged.next(this.month);
			}

			if (this.month >= 13) {
				this.year++;
				this.month = 1;
				this.yearChanged.next(this.year);
			}

			this.dayChanged.next(this.day);
		}, this.msDayTicker);
	}

	updateGolds(amount: number): void {
		this.golds += amount;
    this.golds = Math.max(this.golds, 0);

		this.goldChanged.next(this.golds);
	}
}
