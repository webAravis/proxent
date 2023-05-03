import { Component } from '@angular/core';
import { SaveService } from './core/save.service';
import { CachingService } from './core/caching.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'proxent';
	ready = false;

	loadProgress = 0;

	constructor(
		private _router: Router,
		private _saveService: SaveService,
		private _cachingService: CachingService
	) {
		this._router.navigate(['/']);

		this._cachingService.loadedPercent.subscribe((percent: number) => {
			this.loadProgress = percent;
			if (this.loadProgress === 100) {
				setTimeout(() => {
					this.ready = true;
				}, 500);
			}
		});
	}
}
