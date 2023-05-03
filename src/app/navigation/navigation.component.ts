import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudioService } from '../studio/studio.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
	studioUnlocked = false;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(private _studioService: StudioService) {}

	ngOnInit(): void {
		this._studioService.studioUnlocked
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((studioUnlocked) => (this.studioUnlocked = studioUnlocked));
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}
}
