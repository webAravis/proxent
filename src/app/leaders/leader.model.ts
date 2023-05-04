import { ModifierLevelCost } from "../studio/studiomodifier.model";

export class Leader {
  name = '';
  description = '';
  lvl = 1;
  bonus: string[] = [];
  malus: string[] = [];
	nextLvlCost: ModifierLevelCost = new ModifierLevelCost();

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
