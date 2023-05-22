import { Component, OnDestroy, OnInit } from '@angular/core';
import { CachingService } from './core/caching.service';
import { Router } from '@angular/router';
import { GameService } from './core/game.service';
import { Subject, takeUntil } from 'rxjs';
import packageJson from '../../package.json';

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

  private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _router: Router,
		private _cachingService: CachingService,
    private _gameService: GameService
	) { }

  ngOnInit(): void {
    this._gameService.gameState.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => this.gamePaused = state);

		this._router.navigate(['/']);

		this._cachingService.loadedPercent.subscribe((percent: number) => {
			this.loadProgress = percent;
			if (this.loadProgress === 100) {
				setTimeout(() => {
					this.ready = true;
				}, 500);
			}
		});

    this.ready = !this._cachingService.isOnline;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  mediasNotExit(): void {
    this._cachingService.mediasExist = false;
  }
}
