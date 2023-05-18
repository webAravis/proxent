import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Leader } from './leader.model';
import { ModifierLevelCost } from '../studio/studiomodifier.model';

@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  leaders: BehaviorSubject<Leader[]> = new BehaviorSubject<Leader[]>([]);
  leaderBattle: BehaviorSubject<Leader> = new BehaviorSubject<Leader>(new Leader());

  constructor() {
    this.initLeaders();
  }

  initLeaders() : void {
    const leaders = [];

    const expandor = new Leader();
    expandor.name = 'expandor';
    expandor.description = 'Logistic specialist. Beat him to increase girl capacity';

    leaders.push(expandor);

    this.leaders.next(this.initLeadersMethods(leaders));
  }

  initLeadersMethods(leaders: Leader[]): Leader[] {
		const toReturn: Leader[] = [];

		for (const leader of leaders) {
			const modifierLevelCost = new ModifierLevelCost();

			switch (leader.name) {
        case 'expandor':
          modifierLevelCost.type = 'gold';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.07) ** 2);
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.2 + (leader.lvl * 0.01), 1);
          leader.bonus = ['small', 'brunette'];
          leader.malus = ['milf', 'euro'];
          leader.fetish = [];
          break;
      }

      toReturn.push(leader);
    }

    return toReturn;
  }

  getMetaScore(leader: Leader) : number {
    return (1000 * leader.lvl) + Math.round((this._getAllLeadersLevel() / 0.07) ** 2);
  }

  getMetaCum(leader: Leader) : number {
    return Math.round( (1 * leader.lvl) + Math.round((this._getAllLeadersLevel() / 0.9) ** 2) / 75 ) ;
  }

  nextLevel(toLevel: Leader) : void {
    toLevel.lvl++;
  }

  private _getAllLeadersLevel() : number {
    return this.leaders.getValue().map((leader: Leader) => leader.lvl).reduce((sum, current) => sum + current, 0);
  }
}
