export class Girl {
	id = 0;
	name = '';

	xp = 0;
	fans = 0;

	hp = 1;
	corruption = 1;

	orgasmLevel = 0;

	lust = 1;
	charm = 1;
	beauty = 1;
	skill = 1;
	fitness = 1;

	unlockedPositions: string[] = ['tease'];
  attributes: string[] = [];
	freedom = 1;
	recordCount = 0;
	shootingCount = 0;

	unlockPrice: { type: string; quantity: number }[] = [];

  fansModifier = 1;
  xpModifier = 1;
  goldsModifier = 1;
  cumModifier = 1;
  pointsModifier = 1;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}

  getNextLevelXp(level: number): number {
    return (level/0.07) ** 2;
  }

	get level(): number {
		return Math.trunc(0.07 * Math.sqrt(this.xp)) + 1;
	}

	get popularity(): number {
		return Math.trunc(0.07 * Math.sqrt(this.fans)) + 1;
	}

	set popularity(value: number) {
		this.fans = value;
	}

	get corruptionName(): string {
		return this.corruption - 1 > 4
			? 'slutty'
			: ['normal', 'normal', 'sexy', 'sexy', 'sexy'][this.corruption - 1];
	}

  get skillPoints(): number {
    return Math.trunc(this.level / 5)
  }
}
