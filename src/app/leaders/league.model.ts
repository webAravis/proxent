import { LeaderActivity } from "./leader.model";

export class League {
  id = '';
  name = '';
  mod = '';

  nbBonus = 0;
  bonus: string[] = [];

  nbMalus = 0;
  malus: string[] = [];

  nbFetish = 0;
  fetish: string[] = [];

  activityProb = 0;
  activities: LeaderActivity[] = [];

  levelCap = 0;
  maintenanceCost = 0;

  beatingConditions: {type: string, quantity: number}[] = [];
  battleCost: {type: string, quantity: number}[] = [];

  isCurrentLeague = false;

  unlocker: string | undefined;

	constructor(values: object = {}) {
		Object.assign(this, values);

    const activities: LeaderActivity[] = [];
    for (const activity of this.activities) {
      activities.push(new LeaderActivity(activity));
    }
    this.activities = activities;
  }

  get fullId(): string {
    return this.mod + '-' + this.id
  }
}
