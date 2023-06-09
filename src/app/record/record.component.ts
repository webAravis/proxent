import { ShepherdService } from 'angular-shepherd';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { RewardService } from '../reward/reward.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Item } from '../inventory/item.model';
import { PlayedPosition, RecordService } from './record.service';
import { Record } from './record.model';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';
import { StudioService } from '../studio/studio.service';
import { Position, PositionType } from '../core/position.model';
import { SkillsService } from '../skills/skills.service';
import { Skill, TreeSkills } from '../skills/treeskills.model';
import { Leader, LeaderActivity } from '../leaders/leader.model';
import { SettingsService } from '../core/settings.service';
import { ContractsService } from '../contracts/contracts.service';
import { Contract } from '../contracts/contract.model';
import { League } from '../leaders/league.model';
import { InventoryService } from '../inventory/inventory.service';

interface Trigger {
  triggerEffect: string;
  skillName: string;
  skillPicture: string;
  position: string;
  label: string;
  value: string;
  duration: number;
  chance: number;
}

@Component({
	selector: 'app-record',
	templateUrl: './record.component.html',
	styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, OnDestroy {
  // BATTLE
  @Input() isBattle: boolean = false;
  @Input() toBattle: Leader | League | undefined;
  @Input() metaScore: number = 0;
  @Input() metaCum: number = 0;
  @Output() recordResults: EventEmitter<{score: number, cum: number}> = new EventEmitter();
  leaderActivities: {id: number, activity: LeaderActivity}[] = [];
  leaderDisabledPositions: string[] = [];
  bonerMultiplier = 1;
  pickScene = false;
  trendingDisabled = false;

  _intervalPause: NodeJS.Timer | undefined;
  _intervalTriggers: NodeJS.Timer | undefined;
  _intervalLeaderActivity: NodeJS.Timer | undefined;

  playerGirls: Girl[] = [];
  girlIndex: number = 0;

  PositionType = PositionType;
	vid: HTMLVideoElement = document.createElement('video');
  volume: number = 0;
  _intervalVolume: NodeJS.Timer | undefined;
	timeoutscene: NodeJS.Timeout[] = [];
  timeoutCum: NodeJS.Timeout | undefined;

	record: Record = new Record();
	girl: Girl = new Girl();
	golds = 0;

  name: string = '';
	portrait: SafeUrl = '';
	recordUrl: SafeUrl = '';

	state = 'init';

	showPositions = false;
	showSkipButton = false;

	positions: Position[] = [];
	currentPosition: Position | undefined;
	positionsPlayed: PlayedPosition[] = [];
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

	boner = 1; // starts at 1 to reset to 0 when playing intro
	orgasmCount = 0;
	trendingPositions = 0;

  nbCombos = 2;
  comboBtns: { coordX: string; coordY: string; }[] = [];
  timeoutCombos: any[] = [];
  hitted = 0;
  comboMessage = false;
  comboDone = false;

  treeSkills: TreeSkills[] = [];
  sceneSkills: string[] = [];
  skillStatsModifiers: { stat: string, position: string, label: string, value: string }[] = [];
  triggers: Trigger[] = [];
  activeTriggers: { id: number, trigger: Trigger }[] = [];
  appliedSkills: Skill[] = [];

  basePath = '.';

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  private _fapInterval: NodeJS.Timer | undefined = undefined;

	constructor(
		private _girlsService: GirlsService,
		private _gameService: GameService,
		private _rewardService: RewardService,
		private _recordService: RecordService,
		private _cachingService: CachingService,
		private _studioService: StudioService,
    private _skillService: SkillsService,
    private _girlService: GirlsService,
    private _settingsService: SettingsService,
    private _contractService: ContractsService,
    private _shepherdService: ShepherdService,
    private _inventoryService: InventoryService,
		private _router: Router
	) {}

	ngOnInit(): void {
    this.basePath = (this._cachingService.mediasExist ? '.' : 'https://proxentgame.com');
    clearInterval(this._intervalTriggers);
    this._intervalTriggers = setInterval(() => {this._applyTriggers()}, 125);

    this._gameService.fapMode.pipe(takeUntil(this._unsubscribeAll)).subscribe((fapMode: boolean) => {
      if (this._fapInterval !== undefined) {
        clearInterval(this._fapInterval);
      }

      if (fapMode) {
        clearInterval(this._fapInterval);
        this._fapInterval = setInterval(() => {
          let comboBtns = <HTMLCollectionOf<Element>> document.getElementsByClassName('combo-btn');
          for (var i = 0; i < comboBtns.length; i++) {
            const btnElement = <HTMLElement> comboBtns.item(i);
            if (btnElement !== null) {
              btnElement.click();
            }
          }
        }, 500)
      }
    });

		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((gold: number) => (this.golds = gold));
		this.golds = this._gameService.golds;

    if (this.isBattle) {
      this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe((gameGirls: Girl[]) => {
        this.playerGirls = gameGirls.filter(girl => !girl.locked && girl.fullId !== this._gameService.girlfriend); // Girlfriend doesn't compete!
        this._selectGirl(this.playerGirls[this.girlIndex]);
      });
    } else {
      this._girlsService.currentGirl
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((girl: Girl) => {
        this._selectGirl(girl);
      });
    }

    clearInterval(this._intervalPause);
    this._intervalPause = setInterval(() => this._gameService.pauseGame(), 500);
	}

	ngOnDestroy(): void {
    clearInterval(this._fapInterval);
    clearInterval(this._intervalPause);
    clearInterval(this._intervalTriggers);
    clearInterval(this._intervalLeaderActivity);

		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();

		this._gameService.resumeGame();
	}

	get price(): number {
		return Math.round(
			(100 * (2.5 * this.girl.popularity) - 0.2 * this.girl.corruption) * this._settingsService.getSetting('record_golds_cost')
		);
	}

  changeGirl(index: number): void {
    if (this.girlIndex + index >= 0 && this.girlIndex + index <= this.playerGirls.length) {
      this.girlIndex += index;
    }

    this._selectGirl(this.playerGirls[this.girlIndex]);
  }

  startTutorial(): void {
    this._gameService.pauseGame();
    this._shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: {
        enabled: true
      },
      buttons: [
        {
          action: function() { this.back() },
          label: 'prev',
          text: 'Prev'
        },
        {
          action: function() { this.next() },
          label: 'next',
          text: 'Next'
        },
      ],
    };
    this._shepherdService.modal = true;
    this._shepherdService.confirmCancel = false;
    this._shepherdService.onTourFinish = () => {this._gameService.resumeGame()};
    this._shepherdService.addSteps([
      {
        title: 'Record activity tutorial',
        text: ['Are you new to the game?'],
        buttons: [
          {
            action: function() { this.cancel(); },
            label: 'prev',
            text: 'No, I already know the mechanics'
          },
          {
            action: function() { this.next() },
            label: 'next',
            text: 'Yes, take me for a tour!'
          },
        ]
      },
      {
        title: 'General informations and goals',
        text: 'Recording is an activity where your goal is to do the best record you can. By using scenes in the right moment, you will increase your record value measured in points. A record can be ended at any time, or when you cannot record more scenes. Record scenes count are limited by the selected girl\'s corruption level. By increasing her corruption level, you increase the number of scenes for each records'
      },
      {
        attachTo: {
          element: '.stats',
          on: 'top',
        },
        title: 'Stats bars',
        text: ['Here are you stats, keep an eye on it to manage your record'],
      },
      {
        attachTo: {
          element: '.orgasm',
          on: 'top',
        },
        title: 'Orgasm meter',
        text: ['This is the orgasm meter, fill it to get <i>Cum</i>'],
      },
      {
        attachTo: {
          element: '.stamina',
          on: 'top',
        },
        title: 'Boner meter',
        text: ['This is the boner meter, foreplay will increase it while other scenes will consume it. Scene\'s rewards are affected by the boner meter. Try to keep it high when going deep!'],
      },
      {
        attachTo: {
          element: '.pos',
          on: 'top',
        },
        title: 'Positions',
        text: ['This is the position meter. It indicates how many scenes are left for this record. When filled, record will automatically end'],
      },
      {
        attachTo: {
          element: '.score',
          on: 'top',
        },
        title: 'Score bar',
        text: ['Here is the general record value. When playing a scene, its output will summup with record\'s value. You will get rewards when ending the record'],
      },
      {
        attachTo: {
          element: '.positions-wrapper',
          on: 'top',
        },
        title: 'Scenes picker',
        text: ['This is the scene picker. You can choose a scene by clicking it. A scene can be disabled if current boner level is not high enough'],
      },
      {
        attachTo: {
          element: '.trending',
          on: 'top',
        },
        title: 'Trending scene',
        text: ['The trending scene! This indicates the current trending scene, it will give you x2 on all scene rewards! You should try to pick it when possible, be careful as a trending scene may be unavailable due to boner state. Trending scene management is the key to a good performance'],
      },
      {
        title: 'Advanced scenes',
        text: ['Scenes can have more advanced versions, unlocked by corruption or skills. When an advanced position is available, you will see popping buttons that you have to click before the end of the scene to advance to next scene\'s level. Advanced scenes will not consume more boner nor count as a new scene so it\'s like a free scene with bigger rewards. FAP Mode in settings will automatically pop bubbles to let you concentrate on your business'],
      },
      {
        title: 'End of record',
        text: ['When you end a record, a results screen will appear. You will see the record rating, which is based on what could potentially be done by this girl'],
      },
      {
        title: 'Summary',
        text: ['That\'s it! You know the basics of recording. Boner management and trending scenes are what makes the difference here'],
      }
    ]);
    this._shepherdService.start();
  }

	startRecord(): void {
    if (this.isBattle) {

      if (this.toBattle instanceof Leader) {
        if (this.toBattle.costItem === 'gold') {
          this._gameService.updateGolds(
            this.toBattle.costCurve(this.toBattle.lvl) * -1
          );
        } else {
          this._inventoryService.removeItemByName(
            this.toBattle.costItem,
            this.toBattle.costCurve(this.toBattle.lvl)
          );
        }
      }

      if (this.toBattle instanceof League) {
        for (const battleCostItem of this.toBattle.battleCost) {
          this._inventoryService.removeItemByName(battleCostItem.type, battleCostItem.quantity);
        }
      }

    }

    if (!this._gameService.tutorials.recordScreenDone) {
      this.startTutorial();
      this._gameService.tutorials.recordScreenDone = true;
    }

		this.girl.orgasmLevel = 0;
		this.state = 'recording';

    if (this.isBattle) {
      this._initLeaderActivity();
    } else {
      // simulate records to know grade
      this._recordService.recordSimulated.subscribe((record: Record) => {
        this.simulations.push(record);
      });
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
    }

		this.doStartRecord();
	}

  hasSkill(skillname: string): boolean {
    return this._skillService.hasSkill(skillname, this.girl);
  }

  simulateRecord(): void {
    const simulated = this._recordService.simulateRecord(
      this.girl,
      'player',
      false,
      this._studioService.getStudioQuality(),
      this.girl.recordCount + 1
    );

    this.fansWon = simulated.fans;
    this.goldsWon = simulated.money;
    this.xpWon = simulated.xp;
    for (let index = 0; index < simulated.orgasmCount; index++) {
      this.itemsWon.push(
        new Item({ name: 'cum', price: 100, quality: 'normal' })
      );
    }

    this._gameService.updateGolds(this.price * -1); // remove the record price

    this.record = this._recordService.addRecord(
      this.girl,
      simulated.score,
      simulated.studioscore,
      simulated.money,
      simulated.fans,
      'player'
    );

    this.finish();
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

	startScene(position: Position, isCombo: boolean = false): void {
    for (const timeout of this.timeoutCombos) {
      clearTimeout(timeout);
    }
    this.timeoutCombos = [];
    this.comboBtns.length = 0;

    clearTimeout(this.timeoutCum);
    this._fadeIn();

    let positionName = position.name;
    if (isCombo) {
      positionName = positionName.substring(0, positionName.length - 1);
    }

		if (this.trendingPosition === positionName) {
			this.trendingPositions++;
		}

		this.showPositions = false;
		this.currentPosition = position;

		this.recordUrl = this._cachingService.getVideo(this.girl, position.name);

		this.vid.load();
		this.vid.play().then(() => {
			this.showSkipButton = true;

			this._initCombos(position);

			this.timeoutscene.push(
				setTimeout(() => {
					this.endScene();
				}, (this.vid.duration*1000 - 500))
			);
		});

		const positionPlayedTimes = this.positionRepeated(position.name);
		let repeatedMultiplier = 1;
		for (let index = 1; index < positionPlayedTimes; index++) {
			repeatedMultiplier = repeatedMultiplier / 1.2;
		}

    const positionStats = this.positionStats(position);
		this.goldsWon += positionStats.golds;
		this.xpWon += positionStats.xp;
		this.fansWon += positionStats.fans;
		this.girl.orgasmLevel += positionStats.orgasm;
    if (this.activeTriggers.map(trigger => trigger.trigger.triggerEffect).includes('orgasmmultiplier')) {
      const triggersMultiplier = this.activeTriggers.filter(trigger => trigger.trigger.triggerEffect === 'orgasmmultiplier');
      for (const trigger of triggersMultiplier) {
        this.girl.orgasmLevel += positionStats.orgasm * parseInt(trigger.trigger.value);
      }
    }

    let computedBoner = positionStats.boner;
    if (this.activeTriggers.map(trigger => trigger.trigger.triggerEffect).includes('bonermultiplier')) {
      const triggersMultiplier = this.activeTriggers.filter(trigger => trigger.trigger.triggerEffect === 'bonermultiplier');
      for (const trigger of triggersMultiplier) {
        computedBoner = computedBoner * parseInt(trigger.trigger.value);
      }
    }

    if (!isCombo || computedBoner > 0) {
      this.boner += computedBoner;
      this.boner = Math.max(this.boner, 0);
      this.boner = Math.min(this.boner, 100);
    }

    if (!isCombo && !this.activeTriggers.map(trigger => trigger.trigger.triggerEffect).includes('freescenes')) {
      this.nbScenes++;
    }

		this.positionsPlayed.push({
      position: position,
      fans: positionStats.fans,
      golds: positionStats.golds,
      xp: positionStats.xp
    });
	}

  positionStats(position: Position, nextPosition: boolean = false): {golds: number, xp: number, fans: number, boner: number, orgasm: number} {
    let positionPlayedTimes = this.positionRepeated(position.name);
    if (nextPosition) {
      positionPlayedTimes++;
    }
		let repeatedMultiplier = 1;
		for (let index = 1; index < positionPlayedTimes; index++) {
			repeatedMultiplier = repeatedMultiplier / 1.2;
		}

    const stats = this._recordService.positionStats(this.girl, position, repeatedMultiplier, this.boner, this.trendingPosition, this.skillStatsModifiers);
    stats.boner = stats.boner * this.bonerMultiplier;

    if (this.isFetish(position.name)) {
      stats.orgasm *= 3;
      stats.boner += 50;
      stats.fans *= 2;
    }

    return stats;
  }

	endScene(isCombo: boolean = false): void {
    this._fadeOut();

		if (this.girl.orgasmLevel >= 100 && !isCombo) {
      const nbOrgasm = Math.trunc(this.girl.orgasmLevel / 100);

			this.girl.orgasmLevel = this.girl.orgasmLevel % 100;
			this.orgasmCount += nbOrgasm;

      if (!this.isBattle) {
        for (let i = 0; i < nbOrgasm; i++) {
          this.itemsWon.push(
            new Item({ name: 'cum', price: 100, quality: 'normal' })
          );
        }
      }

      setTimeout(() => { // timeout to wait for previous end of scene fadeout
        this.recordUrl = this._cachingService.getVideo(this.girl, 'orgasm');
        this.vid.load();
        this._fadeIn(true);

        this.vid.play().then(() => {
          clearTimeout(this.timeoutCum);
          this.timeoutCum = setTimeout(() => {
            this._fadeOut();
          }, this.vid.duration*1000);
        });
      }, 500);
		}

    if (this.comboDone) {
      this.comboDone = false;

      // automatically plays next scene!
      this.endScene(true);
      setTimeout(() => {
        if (this.currentPosition?.unlocker) {
          this.startScene(this.currentPosition.unlocker, true);
        }
      }, 500);
      return;
    }

		if (this.timeoutscene.length > 0) {
			for (const timeout of this.timeoutscene) {
				clearTimeout(timeout);
			}
		}
		this.timeoutscene = [];
    this.comboBtns.length = 0;
		this.showSkipButton = false;

    if (!isCombo) {
      this._checkTriggers();

      // time to change position or end of recording based on corruption!
      if (this.nbScenes >= this.girl.corruption || (this.isBattle && this.score >= this.metaScore && this.orgasmCount >= this.metaCum)) {
        this.endRecord();
      } else {
        this.showPositions = true;

        if (!this.trendingDisabled) {
          this.pickTrendingPosition();
        }

        if (this.pickScene) {
          this.pickScene = false;
          this.startScene(this.pickPosition(), false);
        }
      }
    }

		this.score = this._recordService.getScore(
			this.girl,
			this.positionsPlayed,
			this.trendingPositions,
			this.orgasmCount,
			this._studioService.getStudioQuality(),
      this.toBattle
		);

	}

  pickPosition(): Position {
    let availablePositions = this.girl.unlockedPositions.filter(
			(position) => position !== this.trendingPosition && position !== 'intro' && isNaN(parseInt(position.charAt(position.length - 1)))
		);
    availablePositions = [...availablePositions, ...this.sceneSkills.filter(scene => isNaN(parseInt(scene.charAt(scene.length - 1))))];

    // removing duplicates
    availablePositions = [...new Set(availablePositions)];

    const picked = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    return this.positions.find(position => position.name === picked) ?? new Position()
  }

	pickTrendingPosition(): void {
		let availablePositions = this.girl.unlockedPositions.filter(
			(position) => position !== this.trendingPosition && position !== 'intro' && isNaN(parseInt(position.charAt(position.length - 1)))
		);
    availablePositions = [...availablePositions, ...this.sceneSkills.filter(scene => isNaN(parseInt(scene.charAt(scene.length - 1))))];

    // removing duplicates
    availablePositions = [...new Set(availablePositions)];

    const positionsWithCount: {position: string, count: number}[] = [];
    for (const position of availablePositions) {
      if (position !== '') {
        positionsWithCount.push({position: position, count: this.positionRepeated(position)});
      }
    }

    positionsWithCount.sort((a, b) => a.count - b.count);

    const lowestCount = positionsWithCount[0].count;
    const positionsToPick: string[] = positionsWithCount.filter(position => position.count === lowestCount && position.position !== '').map(position => position.position);

		this.trendingPosition = positionsToPick[Math.floor(Math.random() * positionsToPick.length)];
	}

	positionRepeated(positionName: string): number {
		return this.positionsPlayed.filter(
			(positionPlayed) => positionName === positionPlayed.position.name
		).length;
	}

	endRecord(): void {
		// Compute scores
		this.score = this._recordService.getScore(
			this.girl,
			this.positionsPlayed,
			this.trendingPositions,
			this.orgasmCount,
			this._studioService.getStudioQuality(),
      this.toBattle
		);
		this.scorePositions = this._recordService.getScorePositions(
			this.positionsPlayed, true
		);
		this.scoreGirl = this._recordService.getScoreGirl(this.girl, true);
		this.scoreStudio = this._recordService.getScoreStudio(
			this._studioService.getStudioQuality(), true
		);
		this.scoreExtra = this._recordService.getScoreExtra(
			this.trendingPositions,
			this.orgasmCount,
      true
		);

    if (this.isBattle) {

      this.recordResults.emit({score: this.score, cum: this.orgasmCount});

    } else {

      this._gameService.updateGolds(this.price * -1); // remove the record price

      this.record = this._recordService.addRecord(
        this.girl,
        this.score,
        this.scoreStudio,
        this.goldsWon * (1 - this.girl.freedom),
        this.fansWon * (1 - this.girl.freedom),
        'player'
      );

      this.state = 'end';

    }
	}

	getGrade(): string {
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

    // check if we completed a contract
    const contracts = this._contractService.contracts.getValue().filter((contract: Contract) => contract.picked && contract.activity === 'recording');
    for (const contract of contracts) {
      let completed = true;
      for (const attribute of contract.girlAttributes) {
        if (!this.girl.attributes.includes(attribute)) {
          completed = false;
        }
      }

      if (contract.requires) {
        if (contract.requires.requirement === 'girl level' && this.girl.level < parseInt(contract.requires.value)) {
          completed = false;
        }

        if (contract.requires.requirement === 'girl fans' && this.girl.fans < parseInt(contract.requires.value)) {
          completed = false;
        }

        if (contract.requires.requirement === 'orgasms' && this.orgasmCount < parseInt(contract.requires.value)) {
          completed = false;
        }

        if (contract.requires.requirement === 'record rank') {
          let allowedRanks: string[] = [];
          switch (contract.requires.value) {
            case 'S':
              allowedRanks = ['S'];
              break;
            case 'A':
              allowedRanks = ['A', 'S'];
              break;
            case 'B':
              allowedRanks = ['B', 'A', 'S'];
              break;
          }

          if (!allowedRanks.includes(this.getGrade())) {
            completed = false;
          }
        }
      }

      if (completed) {
        this._contractService.completeContract(contract);
      }
    }

		this._gameService.resumeGame();
		this._router.navigate(['girls']);
	}

	isAllowed(positionName: string): boolean {
		return this.girl.unlockedPositions.includes(positionName) || this.sceneSkills.includes(positionName);
	}

  isLeaderPositionDisabled(positionName: string): boolean {
    return this.leaderDisabledPositions.includes(positionName)
  }

  isFetish(positionName: string): boolean {
    return (this.toBattle !== undefined && this.toBattle.fetish.length > 0 && !this.toBattle.fetish.map(fetish => fetish.toLowerCase()).includes(positionName));
  }

	comboHit(event: MouseEvent): void {

    if (event.target) {
      let targetElement = <HTMLElement> event.target;
      if (targetElement.tagName.toUpperCase() !== 'DIV') {
        targetElement = targetElement.closest('.combo-btn') ?? <HTMLElement> event.target;
      }

      if (!targetElement.classList.contains("animate__bounceOut")) {
        targetElement.classList.add("animate__bounceOut");
        this.hitted++;

        if (this.hitted === this.nbCombos && this.currentPosition !== undefined && this.currentPosition.unlocker !== undefined) {
          this.nbCombos++;

          this.comboMessage = true;
          this.comboDone = true;
          setTimeout(() => {
            this.comboMessage = false;
          }, 500);
        }
      }
    }

	}

  exit(): void {
		this._gameService.resumeGame();
		this._router.navigate(['girls']);
  }

  exitLeaders(): void {
		this._gameService.resumeGame();
		this._router.navigate(['battle']);
  }

  filteredPositions(positionTypes: PositionType[]): Position[] {
    return this.positions.filter(position => positionTypes.includes(position.type) && this.isAllowed(position.name));
  }

  canCombo(position: Position): boolean {
    return position.unlocker !== undefined && this.isAllowed(position.unlocker.name)
  }

	private _initCombos(position: Position): void {
    this.comboBtns.length = 0;
    this.hitted = 0;

    if (this.canCombo(position)) {

      for (let index = 1; index <= this.nbCombos; index++) {
        this.timeoutCombos.push(setTimeout(() => {
          this.comboBtns.push({
            coordX: Math.random() * (75 - 25) + 25 + 'vw',
            coordY: Math.random() * (75 - 25) + 25 + 'vh',
          });
        }, 10));
      }

    } else {
      this.nbCombos = 2;
    }
	}

  private _selectGirl(girl: Girl): void {
    this.positions = [];
    this.sceneSkills = [];
    this.skillStatsModifiers = [];
    this.triggers = [];
    this.appliedSkills = [];

    this.girl = girl;
    if (this.girl.name === '') {
      this._router.navigate(['girls']);
    }

    this.name = girl.name;
    this.portrait = this._cachingService.getPhoto(girl, '1_' + girl.corruptionName);

    const positions = girl.positions;
    if (positions) {
      this.positions = [...this.positions, ...positions];
    }

    this.treeSkills = girl.skills.filter((tree: TreeSkills) => (tree.name === 'special' || (this.isBattle ? tree.name === 'battle' : tree.name === 'recording')));

    for (const treeSkill of this.treeSkills) {
      for (const skillTiers of treeSkill.skillTiers) {
        for (const skill of skillTiers.skills.filter(skill => skill.level > 0)) {
          if (skill.effects.length >= skill.level) {
            for (const effects of skill.effects[skill.level-1]) {
              switch (effects.stat) {
                case 'scene':
                  const sceneRank = parseInt(effects.value.charAt(effects.value.length-1));

                  if (!isNaN(sceneRank)) {
                    const sceneName = effects.value.slice(0, -2).toLowerCase().replaceAll(' ', '');
                    for (let index = sceneRank; index > 1; index--) {
                      this.sceneSkills.push(sceneName + index);
                    }
                    this.sceneSkills.push(sceneName);
                  } else {
                    this.sceneSkills.push(effects.value.toLowerCase().replaceAll(' ', ''));
                  }
                  break;
                case 'trigger':
                  this.triggers.push({
                    chance: effects.chance,
                    duration: effects.duration,
                    label: effects.label,
                    position: effects.position,
                    triggerEffect: effects.triggerEffect,
                    value: effects.value,
                    skillName: skill.name,
                    skillPicture: skill.picture
                  });
                  break;
                default:
                  this.skillStatsModifiers.push(effects);
                  break;
              }
            }

            this.appliedSkills.push(skill);
          }
        }
      }
    }
  }

  getRemainingTime(trigger: {id: number, trigger: Trigger}): number {
    return Math.round( ((trigger.id+trigger.trigger.duration) - new Date().getTime()) / 1000 );
  }

  private _initLeaderActivity(): void {
    clearInterval(this._intervalLeaderActivity);
    this._intervalLeaderActivity = setInterval(() => {
      if (this._leaderWillAct()) {
        this._pickLeaderActivity();
      }
    }, 2000);
  }

  private _leaderWillAct(): boolean {
    if (this.toBattle instanceof Leader) {
      return Math.random() < this.toBattle.activityProb(this.toBattle.lvl);
    }

    if (this.toBattle instanceof League) {
      return Math.random() < this.toBattle.activityProb;
    }

    return false;
  }

  private _pickLeaderActivity(): void {
    let activities: LeaderActivity[] = [];
    if (this.activeTriggers.map(trigger => trigger.trigger.triggerEffect).includes('activities')) {
      return;
    }

    if (this.toBattle instanceof Leader) {
      const toCheck: Leader = this.toBattle;
      activities = this.toBattle.activities.filter(activity =>
        !this.leaderActivities.map(activeActivity => activeActivity.activity.effect).includes(activity.effect)
        && (toCheck.lvl >= activity.minLevel && toCheck.lvl <= activity.maxLevel)
      );
    }

    if (this.toBattle instanceof League) {
      activities = this.toBattle.activities.filter(activity =>
        !this.leaderActivities.map(activeActivity => activeActivity.activity.effect).includes(activity.effect)
      );
    }

    if (activities.length === 0) {
      return;
    }

    const activity = activities[Math.floor(Math.random() * activities.length)];
    switch (activity.effect) {
      case 'trending':
        this.trendingDisabled = true;
        this.trendingPosition = '';

        if (activity.duration !== 0) {
          setTimeout(() => {
            this.trendingDisabled = false;
          }, activity.duration);
        }
        break;
      case 'pick':
        this.pickScene = true;
        break;
      case 'boner gains':
        this.bonerMultiplier = (100 - activity.value) / 100;
        if (activity.duration !== 0) {
          setTimeout(() => {
            this.bonerMultiplier = 1;
          }, activity.duration);
        }
        break;
      case 'boner':
        this.boner += activity.value;
        this.boner < 0 ? this.boner = 0 : undefined;
        break;
      case 'position':
        let allPositions: string[] = [
          ...this.girl.unlockedPositions.filter(scene => scene !== 'intro'),
          ...this.sceneSkills
        ].filter(scene => isNaN(parseInt(scene.charAt(scene.length - 1))));

        for (let index = 0; index < activity.value; index++) {
          if (allPositions.length > 0) {
            const positionToDisable = allPositions[Math.floor(Math.random() * allPositions.length)];
            this.leaderDisabledPositions.push(positionToDisable);
            allPositions = allPositions.filter(positionName => positionName !== positionToDisable);
          }
        }

        if (activity.duration !== 0) {
          setTimeout(() => {
            this.leaderDisabledPositions = [];
          }, activity.duration);
        }
        break;
      case 'cum':
        this.orgasmCount += activity.value;
        this.orgasmCount < 0 ? this.orgasmCount = 0 : undefined;
        break;

      default:
        break;
    }

    const activityId = new Date().getTime();
    this.leaderActivities.push({id: activityId, activity: activity});
    const durationActivity = activity.duration > 0 ? activity.duration : 2000;
    setTimeout(() => {
      this.leaderActivities = this.leaderActivities.filter(leaderActivity => leaderActivity.id !== activityId);
    }, durationActivity);
  }

  private _fadeOut(): void {
    clearInterval(this._intervalVolume);
    this.volume = this.vid.volume;

    // volume control
    this._intervalVolume = setInterval(() => {
      if (this.volume <= 0.1) {
        this.volume = 0;
        clearInterval(this._intervalVolume);
      } else if (this.volume - 0.1 > 0) {
        this.volume -= 0.1;
      }
      this.vid.volume = this.volume * this._settingsService.getSetting('game_sound');
    }, 50);
  }

  private _fadeIn(muted = false): void {
    clearInterval(this._intervalVolume);

    // volume control
    this._intervalVolume = setInterval(() => {
      if (this.volume >= 0.9) {
        this.volume = 1;
        clearInterval(this._intervalVolume);
      } else if (this.volume + 0.1 < 1) {
        this.volume += 0.1;
      }
      this.vid.volume = muted ? 0.2 * this._settingsService.getSetting('game_sound') : this.volume * this._settingsService.getSetting('game_sound');
    }, 50);
  }

  private _checkTriggers(): void {
    for (const trigger of this.triggers) {
      const chance = trigger.chance ?? 1;
      const roll = Math.random();
      if (roll <= chance) {
        // applying trigger!
        this._addTrigger(trigger);
      }
    }
  }

  private _addTrigger(trigger: Trigger): void {
    // removing existing
    this.activeTriggers = this.activeTriggers.filter(activeTrigger => activeTrigger.trigger.skillName !== trigger.skillName);

    const triggerTicker = new Date().getTime();
    this.activeTriggers.push({id: triggerTicker, trigger: trigger});

    if (trigger.duration > 0) {
      setTimeout(() => {
        this.activeTriggers = this.activeTriggers.filter(activeTrigger => activeTrigger.id !== triggerTicker);
      }, trigger.duration);
    }
  }

  private _applyTriggers(): void {
    for (const trigger of this.activeTriggers) {
      switch (trigger.trigger.triggerEffect) {
        case 'boner':
          this.boner += parseInt(trigger.trigger.value) / 8;
          break;
        case 'orgasm':
          this.girl.orgasmLevel += parseInt(trigger.trigger.value) / 8;
          break;

        default:
          break;
      }

      if (trigger.trigger.duration === 0) {
        this.activeTriggers = this.activeTriggers.filter(activeTrigger => activeTrigger.id !== trigger.id);
      }
    }
  }
}
