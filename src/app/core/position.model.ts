export enum PositionType {
  INTRO = "INTRO",
  FOREPLAY = "FOREPLAY",
  FOREPLAY_SKILL = "FOREPLAY_SKILL",
  PENETRATION = "PENETRATION",
  SKILL = "SKILL",
  SPECIAL = "SPECIAL",
}

export class Position {
	name = '';
  label = '';
  corruption = 0;

  type: PositionType = PositionType.INTRO;
  unlocker: Position | undefined = undefined;

	constructor(values: object = {}) {
		Object.assign(this, values);
    if (this.unlocker !== undefined) {
      this.unlocker = new Position(this.unlocker);
    }
	}

  getFans = (trending: number = 0, level: number): number => {
    return Math.round( ((this.corruption + 1) * (level/1.1) + this.getMultiplierType(this.type) * 250) * trending );
  }

  getGold = (trending: number = 0, level: number, popularity: number): number => {
    return Math.round( ((this.corruption + 1) * (level/1.5) + this.getMultiplierType(this.type) * (150 * popularity)) * trending );
  }

  getXp = (trending: number = 0, level: number): number => {
    return Math.round( ((this.corruption + 1) * (level/5) * 15 + this.getMultiplierType(this.type) * 100) * trending );
  }

  getOrgasm = (currentBoner: number = 0, trending: number = 1): number => {
    return Math.round( (this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ? 0 : (10 + this.corruption * 8) * (currentBoner / 100)) * (trending / 2) );
  }

  getMultiplierType = (type: string): number => {
    let multiplier = 0;

    switch (type.toLowerCase()) {
      case "intro":
        multiplier = 0;
        break;
      case "FOREPLAY":
        multiplier = 1;
        break;
      case "FOREPLAY_SKILL":
        multiplier = 2;
        break;
      case "PENETRATION":
        multiplier = 10;
        break;
      case "SKILL":
        multiplier = 15;
        break;
      case "SPECIAL":
        multiplier = 20;
        break;
    }

    return multiplier;
  }

  get boner(): number {
    let boner = Math.round(
      (
        this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ?
          (this.corruption + 1) * 4 :
          this.corruption * 2.5
      )
    );
    boner = Math.min(boner, 100);
    const revert = this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ? 1 : -1;

    return boner * revert;
  }
}
