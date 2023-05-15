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
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';
import { StudioService } from '../studio/studio.service';
import { Position, PositionType } from '../core/position.model';

@Component({
	selector: 'app-record',
	templateUrl: './record.component.html',
	styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, OnDestroy {
  PositionType = PositionType;
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

	positions: Position[] = [];
	currentPosition: Position | undefined;
	positionsPlayed: Position[] = [];
	trendingPosition = '';

	nbScenes = 0;

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

	bonner = 1; // starts at 1 to reset to 0 when playing intro
	orgasmCount = 0;
	trendingPositions = 0;
	repetitions = 0;

  nbCombos = 2;
  comboBtns: { coordX: string; coordY: string; }[] = [];
  hitted = 0;
  comboMessage = false;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(
		private _girlsService: GirlsService,
		private _gameService: GameService,
		private _rewardService: RewardService,
		private _recordService: RecordService,
		private _cachingService: CachingService,
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

				this.portrait = this._cachingService.getPhoto(girl.name, '1_' + girl.corruptionName);

        const positions = this._girlsService.getTimingRecord(girl);
        if (positions) {
          this.positions = positions;
        }
			});

		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((gold: number) => (this.golds = gold));
		this.golds = this._gameService.golds;

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
		}

		this.bonner += position.bonner;
    this.bonner = Math.max(this.bonner, 0);

		this.showPositions = false;
		this.currentPosition = position;

		this.recordUrl = this._cachingService.getVideo(this.girl.name, position.name);

		this.vid.load();
		this.vid.play().then(() => {
			this.showSkipButton = true;

			this._initCombos(position);

			this.timeoutscene.push(
				setTimeout(() => {
					this.endScene();
				}, position.timeout)
			);
		});

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

		this.goldsWon += Math.round(position.getGold(this.trendingMultiplier(position)) * repeatedMultiplier);
		this.xpWon += Math.round(position.getXp(this.trendingMultiplier(position)) * repeatedMultiplier);
		this.fansWon += Math.round(position.getFans(this.trendingMultiplier(position)) * repeatedMultiplier);
	}

	endScene(): void {
		if (this.timeoutscene.length > 0) {
			for (const timeout of this.timeoutscene) {
				clearTimeout(timeout);
			}
		}
		this.timeoutscene = [];

		this.showSkipButton = false;
		this.girl.orgasmLevel += this.currentPosition?.getOrgasm(this.bonner, this.trendingMultiplier(this.currentPosition)) ?? 0;

		if (this.girl.orgasmLevel >= 100) {
			this.recordUrl = this._cachingService.getVideo(this.girl.name, 'orgasm');

			this.vid.load();
			this.vid.play();

      const nbOrgasm = Math.trunc(this.girl.orgasmLevel / 100);

			this.girl.orgasmLevel = this.girl.orgasmLevel % 100;
			this.orgasmCount += nbOrgasm;

			this.bonner -= 50;

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
		const availablePositions = this.girl.unlockedPositions.filter(
			(position) => position !== this.trendingPosition && position !== 'intro'
		);
		this.trendingPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
	}

  trendingMultiplier(position: Position): number {
    return this.trendingPosition === position.name ? 4 : 1;
  }

	positionRepeated(positionName: string): number {
		return this.positionsPlayed.filter(
			(positionPlayed) => positionName === positionPlayed.name
		).length;
	}

	endRecord(): void {
		this._gameService.updateGolds(this.price * -1); // remove the record price

		// rewards from orgasms
		this.xpWon = this.xpWon * (1 + 0.1 * this.orgasmCount);

		this.goldsWon = this._recordService.getMoney(
			this.positionsPlayed,
			this.orgasmCount
		);
		this.fansWon = this._recordService.getFans(
			this.positionsPlayed,
			this.orgasmCount
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
		return this.girl.unlockedPositions.includes(positionName);
	}

	comboHit(event: MouseEvent): void {

    if (event.target) {
      let targetElement = <HTMLElement> event.target;
      if (targetElement.tagName.toUpperCase() !== 'DIV') {
        targetElement = targetElement.closest('.combo-btn') ?? <HTMLElement> event.target;
      }

      targetElement.classList.add("animate__bounceOut");
      targetElement.outerHTML = targetElement.outerHTML;

      this.hitted++;
      if (this.hitted === this.nbCombos && this.currentPosition !== undefined && this.currentPosition.unlocker !== undefined) {
        this.nbCombos++;

        this.comboMessage = true;
        setTimeout(() => {
          this.comboMessage = false;
        }, 500);

        // automatically plays next scene!
        this.endScene();
        this.startScene(this.currentPosition.unlocker);
      }
    }

	}

  private _closestAncestor(el: any, selector: any, stopSelector: any) {
    var retval = null;
    while (el) {
      if (el.matches(selector)) {
        retval = el;
        break
      } else if (stopSelector && el.matches(stopSelector)) {
        break
      }
      el = el.parentElement;
    }
    return retval;
  }

	private _initCombos(position: Position): void {
    this.comboBtns = [];
    this.hitted = 0;

    if (position.unlocker !== undefined) {

      for (let index = 1; index <= this.nbCombos; index++) {
        setTimeout(() => {
          this.comboBtns.push({
            coordX: Math.random() * (75 - 25) + 25 + 'vw',
            coordY: Math.random() * (75 - 25) + 25 + 'vh',
          });
        }, index * (Math.random() * (1500 - 500) + 500));
      }

    } else {
      this.nbCombos = 2;
    }
	}
}
