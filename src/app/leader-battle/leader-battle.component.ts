import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeadersService } from '../leaders/leaders.service';
import { Router } from '@angular/router';
import { Leader } from '../leaders/leader.model';
import { GameService } from '../core/game.service';
import { Girl } from '../core/girls/girl.model';
import { SafeUrl } from '@angular/platform-browser';
import { CachingService } from '../core/caching.service';
import { RewardService } from '../reward/reward.service';
import { Position } from '../core/position.model';

export interface BattleSetup {
  girl: Girl;
  position: Position;
}

@Component({
  selector: 'app-leader-battle',
  templateUrl: './leader-battle.component.html',
  styleUrls: ['./leader-battle.component.scss']
})
export class LeaderBattleComponent implements OnInit, OnDestroy {

  leader: Leader = new Leader();
  battleSetup: BattleSetup[] = [];
  indexBattle = 0;

  recordUrl: SafeUrl | undefined;
	vid: HTMLVideoElement = document.createElement('video');

  scorePositions: number[] = [];
  metaScore: number = 100;

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
    private _gameService: GameService,
    private _cachingService: CachingService,
    private _rewardService: RewardService,
    private _router: Router
  ) { }

  get score(): number {
    return this.scorePositions.reduce((sum, current) => sum + current, 0);
  }

  ngOnInit(): void {
    this._leaderService.leaderBattle.pipe(takeUntil(this._unsubscribeAll)).subscribe((leader: Leader) => {
      this.leader = leader;

      this.metaScore = this._leaderService.getMetaScore();
    });
    this._gameService.pauseGame();
  }

  ngOnDestroy(): void {
    this._gameService.resumeGame();

    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  endBattle(): void {
    this._giveRewards();

    this._gameService.resumeGame();
    this._router.navigate(['leaders']);
  }

  initBattle(batteSetup: BattleSetup[]): void {
    this.battleSetup = batteSetup;

    this._startScene(this.battleSetup[this.indexBattle]);
  }

  private _startScene(battleSetup: BattleSetup): void {
    this.vid = <HTMLVideoElement>document.querySelector('#video-record');
		if (this.vid === null) {
			setTimeout(() => {
				// prevent to much attempts
				this._startScene(battleSetup);
			}, 10);
			return;
		}

    this.recordUrl = this._cachingService.getVideo(battleSetup.girl.name, battleSetup.position.name);

    this.vid.load();
		this.vid.play();

    this._computeScorePosition(battleSetup);

    setTimeout(() => {
      this._endScene();
    }, battleSetup.position.timeout)
  }

  private _computeScorePosition(battleSetup: BattleSetup): void {
    let scoreGirl = (battleSetup.girl.level / 100) + (battleSetup.girl.popularity / 100);

    const bonusFromAttributes = 1 + (0.5 * battleSetup.girl.attributes.filter((girlAttrib: string) => this.leader.bonus.includes(girlAttrib)).length);
    const malusFromAttributes = Math.max(1 - (0.3 * battleSetup.girl.attributes.filter((girlAttrib: string) => this.leader.malus.includes(girlAttrib)).length), 0.1);

    this.scorePositions.push((Math.round(battleSetup.position.getFans(1) * scoreGirl * bonusFromAttributes * malusFromAttributes)));
  }

  private _endScene() : void {
    this.indexBattle++;
    if (this.indexBattle === this.battleSetup.length) {
      this.endBattle();
    } else {
      this._startScene(this.battleSetup[this.indexBattle]);
    }
  }

  private _giveRewards() : void {
    let rewardText = '';
    this._leaderService.nextLevel(this.leader);

    if (this.leader.name === 'expandor') {
      this._gameService.girlLimit.next(this._gameService.girlLimit.getValue()+1);
      rewardText = 'Girl limit increased!'
    }

    this._rewardService.rewardText(rewardText);
  }

}
