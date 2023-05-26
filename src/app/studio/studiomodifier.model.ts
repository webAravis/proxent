/* eslint-disable @typescript-eslint/no-unused-vars */
export class StudioModifier {
	id = 0;
	name = '';
	badge = '';
	level = 1;
	nextLvlCost: ModifierLevelCost = new ModifierLevelCost();

	constructor(values: object = {}) {
		Object.assign(this, values);
	}

	effectQuality(level: number): number {
		return 0;
	}
}

export class ModifierLevelCost {
	type = '';
	value(level: number): number {
		return 0;
	}

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
