import { GirlsService } from './../core/girls/girls.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Girl } from '../core/girls/girl.model';
import { RewardService } from '../reward/reward.service';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from '../core/game.service';
import { CachingService } from '../core/caching.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-shooting',
	templateUrl: './shooting.component.html',
	styleUrls: ['./shooting.component.scss'],
})
export class ShootingComponent implements OnInit, OnDestroy {
	started = false;

	intervalScore: NodeJS.Timer | undefined;
	score = 25;
	countingUp = 1;

	indexPhoto = 0;

	photos: SafeUrl[] = [];

	globalScore = 0;

	girl = new Girl();

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _router: Router,
		private _girlsService: GirlsService,
		private _rewardService: RewardService,
		private _gameService: GameService,
		private _cachingService: CachingService,
		private _sanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this._girlsService.currentGirl
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((girl: Girl) => {
				this.girl = girl;
				this.photos = [];

				if (this.girl.name === '') {
					this._router.navigate(['girls']);
				}

				const photosBlob = this._cachingService.getAllPhotos(
					girl.name,
					girl.corruptionName
				);
				for (const blobDatas of photosBlob) {
					const objectURL = URL.createObjectURL(blobDatas);
					this.photos.push(this._sanitizer.bypassSecurityTrustUrl(objectURL));
				}
			});

		this._gameService.pauseGame();
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();

		this._gameService.resumeGame();
	}

	startShoot(): void {
		this.intervalScore = setInterval(() => {
			this.count();
		}, 15);
		this.started = true;
	}

	count(): void {
		this.score = this.score + 1 * this.countingUp;

		if (this.score == 100 || this.score == 25) {
			this.countingUp *= -1;
		}
	}

	shoot(): void {
		this.globalScore = this.globalScore + Math.abs(this.score);

		if (this.indexPhoto + 1 === this.photos.length) {
			this.endShoot();
			return;
		}

		this.indexPhoto++;
	}

	endShoot(): void {
		// rewards based on score
		const score = this.globalScore / this.photos.length;
		const maxXp = 50 + 100 * this.girl.popularity + 100 * this.girl.level;
		const maxMoney = 200 + 100 * this.girl.popularity;
		const maxFans = 150 + 100 * this.girl.popularity + 100 * this.girl.level;

		const xpWon = Math.round(maxXp * (score / 100));
		const moneyWon = Math.round(maxMoney * (score / 100));
		const fansWon = Math.round(maxFans * (score / 100));

		this.girl.shootingCount++;
		this._rewardService.giveReward(fansWon, xpWon, moneyWon, [], 0, this.girl);

		this._gameService.resumeGame();
		this._router.navigate(['girls']);
	}
}
