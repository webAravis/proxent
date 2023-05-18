import { ModifierLevelCost } from "../studio/studiomodifier.model";

export class Leader {
  name = '';
  description = '';
  lvl = 1;
  bonus: string[] = [];
  malus: string[] = [];
  fetish: string[] = [];
	nextLvlCost: ModifierLevelCost = new ModifierLevelCost();

  activityProb = 0;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
