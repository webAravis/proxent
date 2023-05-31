import { ShepherdService } from 'angular-shepherd';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LeadersService } from './leaders.service';
import { Leader } from './leader.model';
import { GameService } from '../core/game.service';
import { InventoryService } from '../inventory/inventory.service';
import { Router } from '@angular/router';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit, OnDestroy, AfterViewInit {

  leaders: Leader[] = [];
	golds = 0;

  girls: Girl[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _leaderService: LeadersService,
		private _gameService: GameService,
		private _inventoryService: InventoryService,
    private _router: Router,
    private _shepherdService: ShepherdService,
    private _girlService: GirlsService
  ) {}

  ngAfterViewInit(): void {
    if (!this._gameService.tutorials.leaderScreenDone) {
      this.startTutorial();
      this._gameService.tutorials.leaderScreenDone = true;
    }
  }

  ngOnInit(): void {
    this._leaderService.leaders.pipe(takeUntil(this._unsubscribeAll)).subscribe((leaders: Leader[]) => this.leaders = leaders);
		this._gameService.goldChanged
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((golds: number) => (this.golds = golds));

		this.golds = this._gameService.golds;

    this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => this.girls = girls.filter(girl => !girl.locked));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(false);
    this._unsubscribeAll.complete();
  }

  getMetaScore(leader: Leader) {
    return this._leaderService.getMetaScore(leader);
  }

  getMetaCum(leader: Leader) {
    return this._leaderService.getMetaCum(leader);
  }

  canBattle(leader: Leader): boolean {
		return !!(
			(leader.costItem === 'gold' &&
      leader.costCurve(leader.lvl) <= this.golds) ||
			this._inventoryService.hasItemByName(
				leader.costItem,
				leader.costCurve(leader.lvl)
			)
		);
  }

  battle(leader: Leader): void {
    if (this.canBattle(leader)) {

      if (leader.costItem === 'gold') {
        this._gameService.updateGolds(
          leader.costCurve(leader.lvl) * -1
        );
      } else {
        this._inventoryService.removeItemByName(
          leader.costItem,
          leader.costCurve(leader.lvl)
        );
      }

      this._leaderService.leaderBattle.next(leader);
      this._router.navigate(['battle']);

    }
  }

  getGirlWithAttribute(attribute: string): string {
    const matching = this.girls.filter(girl => girl.attributes.includes(attribute)).map(girl => girl.name).join(', ');
    return matching !== '' ? matching : 'No girl match';
  }

  getGirlWithPosition(position: string): string {
    const matching = this.girls
      .filter(
        girl =>
          girl.unlockedPositions.includes(position) ||
          girl.skills.filter(treeskill => treeskill.skillTiers.filter(skilltier => skilltier.skills.filter(skill => skill.effects[skill.level] !== undefined && skill.effects[skill.level].map(skilleffect => skilleffect.stat).includes('scene') && skill.effects[skill.level].map(skilleffect => skilleffect.value.toLowerCase()).includes(position.toLowerCase()) ).length > 0).length > 0)
      )
      .map(girl => girl.name).join(', ');

    return matching !== '' ? matching : 'No girl match';
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
        title: 'Leader tutorial',
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
        title: 'Intro',
        text: 'This is the leaders screen. You will find all leaders and be able to start a battle with them to earn their rewards'
      },
      {
        attachTo: {
          element: '.leader',
          on: 'top',
        },
        title: 'Leader',
        text: ['Here is a leader, they are all different in their requirements and rewards'],
      },
      {
        attachTo: {
          element: '.leader-rewards',
          on: 'top',
        },
        title: 'Leader rewards',
        text: ['When beating a leader, you will earn all listed rewards here'],
      },
      {
        attachTo: {
          element: '.bonus-malus',
          on: 'top',
        },
        title: 'Bonus - Malus - Fetish',
        text: ['Leaders can have bonus, malus and fetish. Be careful with them as they will have a big impact on the battle'],
      },
      {
        attachTo: {
          element: '.bonus',
          on: 'top',
        },
        title: 'Bonus',
        text: ['This is the bonus list. Bonus are linked to girl attributes, meaning you should choose wisely who will participate in battle. Each matching bonus attribute grants 150% points in battle'],
      },
      {
        attachTo: {
          element: '.malus',
          on: 'top',
        },
        title: 'Malus',
        text: ['This is the malus list. Like bonus, they are link to girl attributes. Be really careful as each matching <b>malus</b> results in battle points reduced to 10% of their value'],
      },
      {
        attachTo: {
          element: '.fetish',
          on: 'top',
        },
        title: 'Fetish',
        text: ['Leaders can have fetish. When a leader has fetish, they will only allow these scenes in battle, disabling all the rest therefore a girl not doing his fetish won\'t be allowed to do anything in battle'],
      },
      {
        attachTo: {
          element: '.lvl',
          on: 'top',
        },
        title: 'Leader level',
        text: ['Leaders have levels. When you beat a leader, his level is increased. When a leader\'s level raises, he becomes harder to beat by raising his requirements'],
      },
      {
        title: 'Leaders and other studios',
        text: ['Leaders and other studios have a special connection. When you beat a leader, other studios will have their value increased by 10%'],
      },
      {
        title: 'Summary',
        text: ['Now you know everything about leaders. Try to beat them for their rewards and advance in game!'],
      }
    ]);
    this._shepherdService.start();
  }

}
