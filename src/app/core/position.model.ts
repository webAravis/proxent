export enum PositionType {
  INTRO = 0,
  FOREPLAY = 1,
  PENETRATION = 10,
  FETISH = 15
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
    return Math.round(this.multiplierDuration * ((this.corruption + 1) * 10 + this.type * 150) * trending);
  }

  getOrgasm(currentBonner: number = 0, trending: number = 1): number {
    return Math.round(this.multiplierDuration * (this.type === PositionType.FOREPLAY ? 0 : (40 + this.corruption * 10) * (currentBonner / 100)) * (trending / 2));
  }

  get bonner(): number {
    let bonner = Math.round(
      this.multiplierDuration * (
        this.type === PositionType.FOREPLAY ?
          (this.corruption + 1) * 8 :
          this.corruption * 3
        )
    );
    bonner = Math.min(bonner, 100);
    const revert = this.type === PositionType.FOREPLAY ? 1 : -1;

    return bonner * revert;
  }

  get multiplierDuration(): number {
    return 1 + (this.timeout / 1000) * .01;
  }
}
