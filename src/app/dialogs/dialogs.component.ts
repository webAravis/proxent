import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogsService } from './dialogs.service';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';

@Component({
	selector: 'app-dialogs',
	templateUrl: './dialogs.component.html',
	styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit, OnDestroy {
	shown = false;
	dialog: { character: string; text: string }[] = [];
	step = 0;

  girlfriend: Girl = new Girl();
  girlFriendPortrait: SafeUrl | string = '';

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _dialogService: DialogsService,
		private _gameService: GameService,
    private _cachingService: CachingService,
    private _girlService: GirlsService
	) {}

	ngOnInit(): void {
		this._dialogService.dialogShown
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((shown) => {
        // retrieving girlfriend's datas
        this.girlfriend = this._girlService.gameGirls.getValue().find(girl => girl.fullId === this._gameService.girlfriend) ?? new Girl();
        this.girlFriendPortrait = './assets/mods/' + this.girlfriend.girlFolder + '/photos/dialogs.png';

        console.log('girlfriend', this.girlfriend);
        console.log('girlFriendPortrait', this.girlFriendPortrait);

				this.shown = shown;
				this.step = 0;

				if (shown) {
					this._gameService.pauseGame();
				}
			});

		this._dialogService.dialog
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((dialog: { character: string; text: string }[]) =>{
          for (const entry of dialog) {
            if (entry.character !== 'player') {
              entry.text = entry.text.replace('girlfriend_name', this.girlfriend.name);
            }
          }
					this.dialog = dialog;
			});
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
