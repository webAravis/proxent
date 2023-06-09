import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { StudioService } from '../studio/studio.service';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from '../core/game.service';
import { BootController } from 'src/boot-control';
import { Router } from '@angular/router';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
	studioUnlocked = false;
  fapMode = false;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
    private _studioService: StudioService,
		private _gameService: GameService,
    private _ngZone: NgZone,
    private _router: Router
  ) {}

	ngOnInit(): void {
		this._studioService.studioUnlocked
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((studioUnlocked) => (this.studioUnlocked = studioUnlocked));
    this._gameService.fapMode.pipe(takeUntil(this._unsubscribeAll)).subscribe(fapMode => this.fapMode = fapMode);
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

  toggleFapMode(): void {
    this._gameService.fapMode.next(!this.fapMode);
  }

  goToMenu(): void {
    this._ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
    this._router.navigate(['/']);
  }
}
