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

@Component({
  selector: 'app-leader-battle',
  templateUrl: './leader-battle.component.html',
  styleUrls: ['./leader-battle.component.scss']
})
export class LeaderBattleComponent implements OnInit, OnDestroy {

  leader: Leader = new Leader();
  metaScore: number = 0;
  resultScore: number = 0;
  metaCum: number = 0;
  resultCum: number = 0;

  show = false;
  metaScoreDone: boolean = false;
  metaCumDone: boolean = false;

  rewardText: string = 'You didn\'t beat leader, train harder and come back!';

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
    private _gameService: GameService,
    private _rewardService: RewardService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._leaderService.leaderBattle.pipe(takeUntil(this._unsubscribeAll)).subscribe((leader: Leader) => {
      this.leader = leader;

      this.metaScore = this._leaderService.getMetaScore(this.leader);
      this.metaCum = this._leaderService.getMetaCum(this.leader);
    });
    this._gameService.pauseGame();
  }

  ngOnDestroy(): void {
    this._gameService.resumeGame();

    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  recordResults(results: {score: number, cum: number}): void {
    this.show = true;
    this.resultScore = results.score;
    this.resultCum = results.cum;

    if (results.score >= this.metaScore) {
      this.metaScoreDone = true;
    }
    if (results.cum >= this.metaCum) {
      this.metaCumDone = true;
    }

    if (this.metaCumDone && this.metaScoreDone) {
      switch (this.leader.name.toLowerCase()) {
        case 'expandor':
          this.rewardText = 'Girl limit increased!';
          break;
      }
    }
  }

  endBattle(): void {
    if (this.metaCumDone && this.metaScoreDone) {
      this._giveRewards();
    }

    this._gameService.resumeGame();
    this._router.navigate(['leaders']);
  }

  private _giveRewards() : void {
    this._leaderService.nextLevel(this.leader);

    switch (this.leader.name.toLowerCase()) {
      case 'expandor':
        this._gameService.girlLimit.next(this._gameService.girlLimit.getValue()+1);
        break;
    }
  }

}
