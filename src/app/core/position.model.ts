export enum PositionType {
  INTRO = 0,
  FOREPLAY = 1,
  FOREPLAY_SKILL = 2,
  PENETRATION = 10,
  SKILL = 15,
  SPECIAL = 20,
}

export class Position {
	name = '';
  label = '';
  corruption = 0;
	timeout = 0;

  type: PositionType = 1;
  unlocker: Position | undefined = undefined;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}

  getFans(trending: number = 0): number {
    return Math.round(this.multiplierDuration * ((this.corruption + 1) * 50 + this.type * 200) * trending);
  }

  getGold(trending: number = 0): number {
    return Math.round(this.multiplierDuration * ((this.corruption + 1) * 10 + this.type * 150) * trending);
  }

  getXp(trending: number = 0): number {
    return Math.round(this.multiplierDuration * ((this.corruption + 1) * 5 + this.type * 100) * trending);
  }

  getOrgasm(currentBoner: number = 0, trending: number = 1): number {
    return Math.round(this.multiplierDuration * (this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ? 0 : (40 + this.corruption * 10) * (currentBoner / 100)) * (trending / 2));
  }

  get boner(): number {
    let boner = Math.round(
      this.multiplierDuration * (
        this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ?
          (this.corruption + 1) * 8 :
          this.corruption * 3
        )
    );
    boner = Math.min(boner, 100);
    const revert = this.type === PositionType.FOREPLAY || this.type === PositionType.FOREPLAY_SKILL ? 1 : -1;

    return boner * revert;
  }

  get multiplierDuration(): number {
    return 1 + (this.timeout / 1000) * .01;
  }
}
