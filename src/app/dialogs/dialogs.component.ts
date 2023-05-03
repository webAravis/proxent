import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogsService } from './dialogs.service';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-dialogs',
	templateUrl: './dialogs.component.html',
	styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit, OnDestroy {
	shown = false;
	dialog: { character: string; text: string }[] = [];
	step = 0;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _dialogService: DialogsService,
		private _gameService: GameService
	) {}

	ngOnInit(): void {
		this._dialogService.dialogShown
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((shown) => {
				this.shown = shown;
				this.step = 0;

				if (shown) {
					this._gameService.pauseGame();
				}
			});

		this._dialogService.dialog
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(
				(dialog: { character: string; text: string }[]) =>
					(this.dialog = dialog)
			);
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	nextStep(): void {
		if (this.step + 1 === this.dialog.length) {
			this._dialogService.endDialog();
			this._gameService.resumeGame();
		}

		this.step++;
	}
}
