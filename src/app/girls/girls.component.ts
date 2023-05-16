import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { FreedomService } from './freedom.service';
import { CachingService } from '../core/caching.service';
import { GameService } from '../core/game.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-girls',
	templateUrl: './girls.component.html',
	styleUrls: ['./girls.component.scss'],
})
export class GirlsComponent implements OnInit, OnDestroy, AfterContentChecked {
	girls: Girl[] = [];
	allGirls: Girl[] = [];
	portraits: Map<string, SafeUrl> = new Map<string, SafeUrl>();

	golds = 0;
  girlLimit = 0;

	girl: Girl = new Girl();

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _girlsService: GirlsService,
		private _freedomService: FreedomService,
		private _cachingService: CachingService,
		private _gameService: GameService,
		private _router: Router,
    private _cdRef: ChangeDetectorRef
	) {}

  ngAfterContentChecked() {

    this._cdRef.detectChanges();

  }

	ngOnInit(): void {
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds) => (this.golds = golds));
		this.golds = this._gameService.golds;

    this._gameService.girlLimit.pipe(takeUntil(this._unsubscribeAll)).subscribe((girlLimit) => (this.girlLimit = girlLimit));

		combineLatest([
			this._girlsService.gameGirls,
			this._girlsService.playerGirls,
			this._girlsService.currentGirl,
		])
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((value: unknown[]) => {
				if (value.length === 3) {
					let gameGirls: Girl[] = <Girl[]>value[0];
					gameGirls = gameGirls.sort((a: Girl, b: Girl) => a.id - b.id);

					let savedGirls: Girl[] = <Girl[]>value[1];
					savedGirls = savedGirls.sort((a: Girl, b: Girl) => a.id - b.id);

					// setting girl's portraits
					const girlPortraits = [];
					for (const girl of gameGirls) {
						const savedGirl = savedGirls.find(
							(inSave: Girl) => inSave.id === girl.id
						);
						if (savedGirl) {
							girlPortraits.push(savedGirl);
						} else {
							girlPortraits.push(girl);
						}
					}

					for (const girl of girlPortraits) {
						this.portraits.set(
							girl.name,
							this._cachingService.getPhoto(girl.name, '1_' + girl.corruptionName)
						);
					}

					this.girls = savedGirls;
					const currentGirl = <Girl>value[2];
					if (currentGirl.name !== '') {
						this.girl = currentGirl;
					}
					this.allGirls = gameGirls;
				}
			});
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	selectGirl(girl: Girl): void {
		this.girl =
			this.girls.find((myGirl: Girl) => myGirl.id === girl.id) ?? girl;
		this._girlsService.currentGirl.next(this.girl);
	}

	addGirl(girl: Girl): void {
		this._girlsService.addGirl(girl);
	}

  girlFreeable(): boolean {
    return this.girl.id !== 1 && this.girl.unlockPrice.length > 0;
  }

  cancelContract(): void {
    if (confirm('Are you sure you want to cancel this contract?')) {
      this._girlsService.removeGirl(this.girl);
      this.selectGirl(this.girls[0]);
    }
  }

	shooting(): void {
		this._router.navigate(['shooting']);
	}

	corrupt(): void {
		this._router.navigate(['corrupt']);
	}

	record(): void {
		this._router.navigate(['record']);
	}

	showFreedomReducer(): void {
		this._freedomService.showFreedomReducer.next(this.girl);
	}
}
