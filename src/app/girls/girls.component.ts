import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { FreedomService } from './freedom.service';
import { CachingService } from '../core/caching.service';
import { GameService } from '../core/game.service';
import { SafeUrl } from '@angular/platform-browser';
import { ShepherdService } from 'angular-shepherd';

@Component({
  selector: 'app-girls',
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.scss'],
})
export class GirlsComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
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
    private _shepherdService: ShepherdService,
    private _cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (!this._gameService.tutorials.girlScreenDone) {
      this.startTutorial();
      this._gameService.tutorials.girlScreenDone = true;
    }
  }

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
      this._girlsService.currentGirl,
    ])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value: unknown[]) => {
        if (value.length === 2) {
          let gameGirls: Girl[] = <Girl[]>value[0];
          gameGirls = gameGirls.sort((a: Girl, b: Girl) => {
            if (a.fullId === this._gameService.girlfriend) {
              return -1;
            } else if (b.fullId === this._gameService.girlfriend) {
              return 1;
            } else {
              return a.fullId.localeCompare(b.fullId);
            }
          });

          // setting girl's portraits
          const girlPortraits = [];
          for (const girl of gameGirls) {
            girlPortraits.push(girl);
          }

          for (const girl of girlPortraits) {
            this.portraits.set(
              girl.name,
              this._cachingService.getPhoto(girl, '1_' + girl.corruptionName)
            );
          }

          const currentGirl = <Girl>value[1];
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

  get unlockedGirlsCount(): number {
    return this.allGirls.filter(girl => !girl.locked).length;
  }

  selectGirl(girl: Girl): void {
    this.girl = girl;
    this._girlsService.currentGirl.next(this.girl);
  }

  addGirl(girl: Girl): void {
    this._girlsService.addGirl(girl);
  }

  girlFreeable(): boolean {
    return this.girl.fullId !== this._gameService.girlfriend && this.girl.unlockPrice.length > 0;
  }

  cancelContract(): void {
    if (confirm('Are you sure you want to cancel this contract?')) {
      this._girlsService.removeGirl(this.girl);
      this.selectGirl(this.allGirls.filter(girl => !girl.locked)[0]);
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

  skills(): void {
    this._router.navigate(['skills']);
  }

  showFreedomReducer(): void {
    this._freedomService.showFreedomReducer.next(this.girl);
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
        title: 'Welcome to ProXent!',
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
        attachTo: {
          element: '.header-wrapper',
          on: 'top',
        },
        title: 'Girl information',
        text: ['Here will appear girl name and general management actions like skills. For girls that aren\'t your girlfriend, you will also have a cancel contract button to lock the girl again and freeup space'],
      },
      {
        attachTo: {
          element: '.attributes',
          on: 'top',
        },
        title: 'Girl attributes',
        text: ['You will find all girl attributes in this part. Attributes are important in leader battles as bonus attributes grant 150% of points, and malus reduce points to 1%. Meaning it\'s almost <b>impossible to beat a leader with a malus</b>'],
      },
      {
        attachTo: {
          element: '.corruption-level',
          on: 'top',
        },
        title: 'Corruption level',
        text: ['This is the girl\'s corruption level. Corruption level is a requirement to unlock some photos and get new scenes, you can increase it using the Corrupt button below.'],
      },
      {
        attachTo: {
          element: '.level-wrapper',
          on: 'top',
        },
        title: 'Girl level',
        text: ['Each girl has her own level. You can increase it by shooting or recording her. Level can be a requirement for a contract and is <b>used for record or battle points calculation and for scenes rewards</b>. Also, <b>each 5 level girl gets a new skill point</b> to use.'],
      },
      {
        attachTo: {
          element: '#independency',
          on: 'top',
        },
        title: 'Independency',
        text: ['Independency is a girl stat. This percentage has direct influence on all activities rewards as <b>it represents the part that girl will keep for her</b>. This means a 100% independant girl will keep all rewards, leaving you with 0 of any value. You can reduce her indepency with the Recruit button below.'],
      },
      {
        attachTo: {
          element: '#fans',
          on: 'top',
        },
        title: 'Fans',
        text: ['Fans is a girl stat. Fans influence a scene\'s gold rewards, <b>more fans equals more golds!</b> You increase it naturally with any activity with the girl.'],
      },
      {
        attachTo: {
          element: '.actions',
          on: 'top',
        },
        title: 'Actions',
        text: ['Here are the actions you can take with the girl. A girl needs a corruption level above 3 to accept recording.'],
      },
      {
        attachTo: {
          element: '.girl-limit',
          on: 'top',
        },
        title: 'Girl limit',
        text: ['This is your girl limit. Your girlfriend doesn\'t count in this limit! <b>You can increase it by beating Expandor, the logistic leader</b>'],
      },
      {
        title: 'Badges',
        text: ['During the game, you will need badges to unlock game content. You\'ll earn them automatically with monthly and yearly ceremonies based on your records for expired period. Note that your girlfriend is not an employee therefore she won\'t compete for rewards!'],
      },
    ]);
    this._shepherdService.start();
  }
}
