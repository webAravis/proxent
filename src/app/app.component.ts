import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CachingService } from './core/caching.service';
import { Router } from '@angular/router';
import { GameService } from './core/game.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

import packageJson from '../../package.json';
import { ContractsService } from './contracts/contracts.service';
import { Contract } from './contracts/contract.model';
import { GirlsService } from './core/girls/girls.service';
import { LeadersService } from './leaders/leaders.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'proxent';
	ready = false;

	loadProgress = 0;
  gamePaused = true;
  version = packageJson.version;

  contractNotifications: {contract: Contract, completed: boolean, expired: boolean}[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _router: Router,
		private _cachingService: CachingService,
    private _gameService: GameService,
    private _girlService: GirlsService,
    private _leaderService: LeadersService,
    private _contractService: ContractsService,
    private _cdr: ChangeDetectorRef
	) { }

  ngOnInit(): void {
    this._contractService.contractNotifications.pipe(takeUntil(this._unsubscribeAll)).subscribe(notifications => this.contractNotifications = notifications);
    this._gameService.gameState.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      this.gamePaused = state;
      this._cdr.detectChanges();
    });

		this._router.navigate(['/']);

    combineLatest([
      this._cachingService.loadedPercent,
      this._girlService.loaded,
      this._leaderService.loaded,
      this._cachingService.online,
      this._cachingService.hasMedias,
    ]).pipe(takeUntil(this._unsubscribeAll)).subscribe((status: [cacheLoadedPercent: number, isOnline: boolean, mediasExist: boolean, girlsLoaded: boolean, leadersLoaded: boolean]) => {
      this.loadProgress = status[0];
			if ((this.loadProgress === 100 || status[3] || status[4]) && status[1] && status[2]) {
        this.ready = true;
			}
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  mediasNotExit(): void {
    this._cachingService.mediasExist = false;
    this._cachingService.hasMedias.next(true);
  }
}
