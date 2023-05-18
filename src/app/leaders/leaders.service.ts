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

    const skillus = new Leader();
    skillus.name = 'skillus';
    skillus.description = 'Skill specialist. Beat him to grab basic skill material';

    leaders.push(skillus);

    const aniter = new Leader();
    aniter.name = 'aniter';
    aniter.description = 'Anal fetishist. Beat him to grab advanced skill material';

    leaders.push(aniter);

    const multiplor = new Leader();
    multiplor.name = 'multiplor';
    multiplor.description = 'Multiple fetishist. Beat him to grab advanced skill material';

    leaders.push(multiplor);

    const blows = new Leader();
    blows.name = 'blows';
    blows.description = 'Mouth fetishist. Beat him to grab advanced skill material';

    leaders.push(blows);

    const savager = new Leader();
    savager.name = 'savager';
    savager.description = 'Rough fetishist. Beat him to grab advanced skill material';

    leaders.push(savager);

    this.leaders.next(this.initLeadersMethods(leaders));
  }

  initLeadersMethods(leaders: Leader[]): Leader[] {
    for (const leader of this.leaders.getValue()) {
      if (!leaders.map(leaderParam => leaderParam.name.toLowerCase()).includes(leader.name.toLowerCase())) {
        leaders.push(leader);
      }
    }
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
        case 'skillus':
          modifierLevelCost.type = 'gold';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.07) ** 2);
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.1 + (leader.lvl * 0.01), 1);
          leader.bonus = ['milf', 'dark eyes'];
          leader.malus = ['american', 'blond'];
          leader.fetish = [];
          break;
        case 'aniter':
          modifierLevelCost.type = 'recordmonthly_badge';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.9));
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.1 + (leader.lvl * 0.01), 1);
          leader.bonus = [];
          leader.malus = [];
          leader.fetish = ['tease', 'handjob', 'boobjob', 'blowjob', 'anal'];
          break;
        case 'multiplor':
          modifierLevelCost.type = 'recordmonthly_badge';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.9));
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.1 + (leader.lvl * 0.01), 1);
          leader.bonus = [];
          leader.malus = [];
          leader.fetish = ['tease', 'handjob', 'boobjob', 'blowjob', 'gangbang', 'double', 'triple'];
          break;
        case 'blows':
          modifierLevelCost.type = 'recordmonthly_badge';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.9));
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.1 + (leader.lvl * 0.01), 1);
          leader.bonus = [];
          leader.malus = [];
          leader.fetish = ['blowjob', 'deepthroat', 'mouthfuck'];
          break;
        case 'savager':
          modifierLevelCost.type = 'recordmonthly_badge';
          modifierLevelCost.value = function (level: number): number {
            return Math.round((level / 0.9));
          };
          leader.nextLvlCost = modifierLevelCost;

          leader.activityProb = Math.min(0.1 + (leader.lvl * 0.01), 1);
          leader.bonus = [];
          leader.malus = [];
          leader.fetish = ['tease', 'handjob', 'boobjob', 'blowjob', 'gangbang', 'bdsm'];
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
