export class Leader {
  name = '';
  mod = '';
  description = '';
  lvl = 1;

  nbBonus = 0;
  bonus: string[] = [];

  nbMalus = 0;
  malus: string[] = [];

  nbFetish = 0;
  fetish: string[] = [];

	costItem = '';

  activityProb = (level: number): number => { return level };
  activities: LeaderActivity[] = [];

  costCurve = (level: number): number => { return level };
  cumCurve = (level: number): number => { return level };
  pointsCurve = (level: number): number => { return level };

  rewards: {type: string, quantity: number}[] = [];

	constructor(values: object = {}) {
		Object.assign(this, values);

    const activities: LeaderActivity[] = [];
    for (const activity of this.activities) {
      activities.push(new LeaderActivity(activity));
    }
    this.activities = activities;
	}
}

export class LeaderActivity {
  name = '';
  effect = '';
  value = 0;
  minLevel = 0;
  maxLevel = 1_000_000_000;
  duration = 0;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
