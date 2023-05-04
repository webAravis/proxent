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
    expandor.bonus = ['small', 'brunette'];
    expandor.malus = ['milf', 'euro'];

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
          break;
      }

      toReturn.push(leader);
    }

    return toReturn;
  }

  getMetaScore() : number {
    return 1000 + Math.round((this._getAllLeadersLevel() / 0.07) ** 2);
  }

  nextLevel(toLevel: Leader) : void {
    const filtered = this.leaders.getValue().filter(leader => leader.name !== leader.name);
    toLevel.lvl++;

    filtered.push(toLevel);
    this.leaders.next(filtered);
  }

  private _getAllLeadersLevel() : number {
    return this.leaders.getValue().map((leader: Leader) => leader.lvl).reduce((sum, current) => sum + current, 0);
  }
}
