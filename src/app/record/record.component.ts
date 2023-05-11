import { Component, OnDestroy, OnInit } from '@angular/core';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { RewardService } from '../reward/reward.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Item } from '../inventory/item.model';
import { RecordService } from './record.service';
import { Record } from './record.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';
import { StudioService } from '../studio/studio.service';
import { Position } from '../core/position.model';

@Component({
	selector: 'app-record',
	templateUrl: './record.component.html',
	styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, OnDestroy {
	vid: HTMLVideoElement = document.createElement('video');
	timeoutscene: NodeJS.Timeout[] = [];

	record: Record = new Record();
	girl: Girl = new Girl();
	golds = 0;

	portrait: SafeUrl = '';
	recordUrl: SafeUrl = '';

	state = 'init';

	showPositions = false;
	showSkipButton = false;

	sceneDuration = 0;
	comboWrapperTranslateX = 0;
	comboBtns: number[] = [];
	intervalTranslateX: NodeJS.Timer | undefined;
	comboMessage: Subject<string> = new Subject();
	comboText = '';
	displayComboText = false;

	positions: Position[] = [];
	currentPosition: Position | undefined;
	positionsPlayed: Position[] = [];
	trendingPosition = '';

	nbScenes = 0;

	xpmultiplier = 1;
	goldmultiplier = 1;
	fansmultiplier = 1;

	goldsWon = 0;
	fansWon = 0;
	xpWon = 0;
	itemsWon: Item[] = [];

	score = 0;
	scorePositions = 0;
	scoreGirl = 0;
	scoreStudio = 0;
	scoreExtra = 0;

	simulations: Record[] = [];

	staminaUsed = 0;
	orgasmCount = 0;
	trendingPositions = 0;
	repetitions = 0;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _girlsService: GirlsService,
		private _gameService: GameService,
		private _rewardService: RewardService,
		private _recordService: RecordService,
		private _cachingService: CachingService,
		private _sanitizer: DomSanitizer,
		private _studioService: StudioService,
		private _router: Router
	) {}

	ngOnInit(): void {
		this._girlsService.currentGirl
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((girl: Girl) => {
				this.girl = girl;
				if (this.girl.name === '') {
					this._router.navigate(['girls']);
				}

				const blobDatas = this._cachingService.getPhoto(
					girl.name,
					'1_' + girl.corruptionName
				);
				if (blobDatas === undefined) {
					return;
				}
				const objectURL = URL.createObjectURL(blobDatas);
				this.portrait = this._sanitizer.bypassSecurityTrustUrl(objectURL);

        const positions = this._girlsService.getTimingRecord(girl);
        if (positions) {
          this.positions = positions;
        }
			});

		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((gold: number) => (this.golds = gold));
		this.golds = this._gameService.golds;

		this.comboMessage
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((message: string) => {
				this.comboText = message;
				this.displayComboText = true;
				setTimeout(() => {
					this.displayComboText = false;
				}, 100);
				setTimeout(() => {
					this.comboText = '';
				}, 500);
			});

		this._gameService.pauseGame();
	}

	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();

		this._gameService.resumeGame();
	}

	get price(): number {
		return Math.round(
			100 * (2.5 * this.girl.popularity) - 0.2 * this.girl.corruption
		);
	}

	startRecord(): void {
		this.girl.orgasmLevel = 0;
		this.state = 'recording';

		// simulate records to know grade
		this._recordService.recordSimulated.subscribe((record: Record) =>
			this.simulations.push(record)
		);
		this._recordService.simulateRecord(
			this.girl,
			'',
			false,
			Math.random() * (20 - 0.1) + 0.1,
			this.girl.recordCount + 1
		);
		this._recordService.simulateRecord(
			this.girl,
			'',
			false,
			Math.random() * (20 - 0.1) + 0.1,
			this.girl.recordCount + 1
		);
		this._recordService.simulateRecord(
			this.girl,
			'',
			false,
			Math.random() * (20 - 0.1) + 0.1,
			this.girl.recordCount + 1
		);
		this._recordService.simulateRecord(
			this.girl,
			'',
			false,
			Math.random() * (20 - 0.1) + 0.1,
			this.girl.recordCount + 1
		);
		this._recordService.simulateRecord(
			this.girl,
			'',
			false,
			Math.random() * (20 - 0.1) + 0.1,
			this.girl.recordCount + 1
		);

		this.doStartRecord();
	}

	doStartRecord(): void {
		this.vid = <HTMLVideoElement>document.querySelector('#video-record');
		if (this.vid === null) {
			setTimeout(() => {
				// prevent to much attempts
				this.doStartRecord();
			}, 10);
			return;
		}

		this.vid.addEventListener(
			'error',
			() => {
				this.showSkipButton = true;
			},
			true
		);

		this.startScene(this.positions[0]);
	}

	startScene(position: Position): void {
		this.nbScenes++;
		this.positionsPlayed.push(position);
		if (this.trendingPosition === position.name) {
			this.trendingPositions++;
			this.fansmultiplier = Math.round(this.fansmultiplier * 1.2 * 100) / 100;
		}

		this.staminaUsed += position.stamcost;

		this.showPositions = false;
		this.currentPosition = position;

		let objectURL =
			'https://proxentgame.com/medias/' +
			this.girl.name.toLowerCase() +
			'/videos/record/' +
			position.name +
			'.webm';
		const blobDatas = this._cachingService.getVideo(
			this.girl.name,
			position.name
		);
		if (blobDatas !== undefined) {
			objectURL = URL.createObjectURL(blobDatas);
		}
		this.recordUrl = this._sanitizer.bypassSecurityTrustUrl(objectURL);

		this.vid.load();
		this.vid.play().then(() => {
			this.showSkipButton = true;

			this._initCombos(position.timing, position.timeout);

			this.timeoutscene.push(
				setTimeout(() => {
					this.endScene();
				}, position.timeout)
			);
		});

		this.fansmultiplier += Math.round(0.01 * this.girl.popularity * 100) / 100;

		const positionPlayedTimes = this.positionsPlayed.filter(
			(positionPlayed) => position.name === positionPlayed.name
		);
		let repeatedMultiplier = 1;
		for (let index = 1; index < positionPlayedTimes.length; index++) {
			repeatedMultiplier = repeatedMultiplier / 1.2;
		}

		if (positionPlayedTimes.length > 1) {
			this.repetitions++;
		}

		this.goldsWon += Math.round(position.gold * repeatedMultiplier);
		this.xpWon += Math.round(position.xp * repeatedMultiplier);
		this.fansWon += Math.round(position.fans * repeatedMultiplier);
	}

	endScene(): void {
		clearInterval(this.intervalTranslateX);
		this.comboBtns = [];
		this.comboWrapperTranslateX = 0;

		if (this.timeoutscene.length > 0) {
			for (const timeout of this.timeoutscene) {
				clearTimeout(timeout);
			}
		}
		this.timeoutscene = [];

		this.showSkipButton = false;
		this.girl.orgasmLevel += this.currentPosition?.orgasm ?? 0;

		if (this.girl.orgasmLevel >= 100) {
			let objectURL =
				'https://proxentgame.com/medias/' +
				this.girl.name.toLowerCase() +
				'/videos/record/orgasm.webm';
			const blobDatas = this._cachingService.getVideo(this.girl.name, 'orgasm');
			if (blobDatas !== undefined) {
				objectURL = URL.createObjectURL(blobDatas);
			}
			this.recordUrl = this._sanitizer.bypassSecurityTrustUrl(objectURL);

			this.vid.load();
			this.vid.play();

      const nbOrgasm = Math.trunc(this.girl.orgasmLevel / 100);

			this.girl.orgasmLevel = this.girl.orgasmLevel % 100;
			this.orgasmCount += nbOrgasm;

			this.staminaUsed -= 250;

      for (let i = 0; i < nbOrgasm; i++) {
        this.itemsWon.push(
          new Item({ name: 'cum', price: 100, quality: 'normal' })
        );
      }

		} else {
			this.vid.pause();
		}

		// time to change position or end of recording based on corruption!
		if (this.nbScenes >= this.girl.corruption) {
			this.endRecord();
		} else {
			this.showPositions = true;
			this.pickTrendingPosition();
		}
	}

	pickTrendingPosition(): void {
		const availablePositions = this.girl.unlockedPostions.filter(
			(position) => position !== this.trendingPosition
		);
		this.trendingPosition =
			availablePositions[Math.floor(Math.random() * availablePositions.length)];
	}

	positionRepeated(positionName: string): number {
		return this.positionsPlayed.filter(
			(positionPlayed) => positionName === positionPlayed.name
		).length;
	}

	comboHit(): void {
		const inPerfectRange = this.comboBtns.some((comboButton: number) =>
			this._nearInt(Math.abs(this.comboWrapperTranslateX), comboButton, 170)
		);
		const inGoodRange = this.comboBtns.some((comboButton: number) =>
			this._nearInt(Math.abs(this.comboWrapperTranslateX), comboButton, 200)
		);

		this.comboMessage.next(
			inPerfectRange ? 'perfect' : inGoodRange ? 'good' : 'miss'
		);
		const hitMultiplier = inPerfectRange ? 1 : inGoodRange ? 0.5 : -0.5;

    if (inPerfectRange) {
      this.girl.orgasmLevel += 10;
    }

    // remove nearest combo
    if (inPerfectRange) {
      let seenCombo = false;
      this.comboBtns = this.comboBtns.filter((comboButton: number) => {
          if (seenCombo) {
              return true;
          }
          seenCombo = this._nearInt(Math.abs(this.comboWrapperTranslateX), comboButton, 170);
          return !seenCombo;
      });
    } else if (inGoodRange) {
      let seenCombo = false;
      this.comboBtns = this.comboBtns.filter((comboButton: number) => {
          if (seenCombo) {
              return true;
          }
          seenCombo = this._nearInt(Math.abs(this.comboWrapperTranslateX), comboButton, 200);
          return !seenCombo;
      });
    }

		if (this.currentPosition && this.currentPosition.name !== '') {
			// multiply by the current position's combo multiplier
			this.xpmultiplier += (0.25 / this.currentPosition.timing.length) * hitMultiplier;
			this.goldmultiplier += (0.4 / this.currentPosition.timing.length) * hitMultiplier;

      this.xpmultiplier = Math.max(this.xpmultiplier, .1);
      this.goldmultiplier = Math.max(this.goldmultiplier, .1);
		}
	}

	endRecord(): void {
		this._gameService.updateGolds(this.price * -1); // remove the record price

		// rewards
		this.xpWon = this.xpWon * this.xpmultiplier + 15 * this.girl.popularity;

		// rewards from orgasms
		this.xpWon = this.xpWon * (1 + 0.1 * this.orgasmCount);

		this.goldsWon = this._recordService.getMoney(
			this.girl,
			this.positionsPlayed,
			this.orgasmCount,
			this.goldmultiplier
		);
		this.fansWon = this._recordService.getFans(
			this.girl,
			this.positionsPlayed,
			this.orgasmCount,
			this.goldmultiplier
		);

		// save record
		this.score = this._recordService.getScore(
			this.girl,
			this.positionsPlayed,
			this.trendingPositions,
			this.orgasmCount,
			this.repetitions,
			this._studioService.getStudioQuality()
		);
		this.scorePositions = this._recordService.getScorePositions(
			this.positionsPlayed
		);
		this.scoreGirl = this._recordService.getScoreGirl(this.girl);
		this.scoreStudio = this._recordService.getScoreStudio(
			this._studioService.getStudioQuality()
		);
		this.scoreExtra = this._recordService.getScoreExtra(
			this.trendingPositions,
			this.orgasmCount,
			this.repetitions
		);

		this.record = this._recordService.addRecord(
			this.girl,
			this.score,
			this.scoreStudio,
			this.goldsWon,
			this.fansWon,
			'player'
		);

		this.state = 'end';
	}

	get grade(): string {
		// grades S, A, B, C, D
		let grade = 0;

		this.simulations = this.simulations.sort((a, b) => a.score - b.score);
		for (const simulation of this.simulations) {
			if (this.score > simulation.score) {
				grade++;
			}
		}

		return ['E', 'D', 'C', 'B', 'A', 'S'][grade] ?? 'S';
	}

	finish(): void {
		this._rewardService.giveReward(
			this.fansWon,
			this.xpWon,
			this.goldsWon,
			this.itemsWon,
			0,
			this.girl
		);

		this._gameService.resumeGame();
		this._router.navigate(['girls']);
	}

	isAllowed(positionName: string): boolean {
		return this.girl.unlockedPostions.includes(positionName);
	}

	private _initCombos(timings: number[], timeout: number): void {
		if (timings.length > 0) {
			this.comboBtns = timings;

			this.sceneDuration = timeout;
			this.intervalTranslateX = setInterval(() => {
				this.comboWrapperTranslateX -=
					this.sceneDuration / (this.sceneDuration / 5);
			}, 5);

      // slowdown on combo hit
      // for (const comboHit of this.comboBtns) {
      //   setTimeout(() => {
      //     this.vid.playbackRate = 0.5;
      //     setTimeout(() => {
      //       this.vid.playbackRate = 1;
      //     }, 200);
      //   }, comboHit-200);
      // }
		}
	}

	private _nearInt(op: number, target: number, range: number) {
		return op < target + range && op > target - range;
	}
}
