import { PhotoShooting } from "src/app/shooting/shooting.component";
import { Position } from "../position.model";
import { TreeSkills } from "src/app/skills/treeskills.model";

export class Girl {
	id = '0';
  fullId = '';
	mod = '';
  girlFolder = '';
	name = '';

	xp = 0;
	fans = 0;

	corruption = 1;

  orgasmLevel = 0;

	unlockedPositions: string[] = ['tease'];
  attributes: string[] = [];
	freedom = 1;
	recordCount = 0;
	shootingCount = 0;

	unlockPrice: { type: string; quantity: number }[] = [];
  multipliers: {percent: number, stat: string}[] = [];

  fansModifier = 1;
  xpModifier = 1;
  goldsModifier = 1;
  cumModifier = 1;
  pointsModifier = 1;

  positions: Position[] = [];
  photos: PhotoShooting[] = [];
  skills: TreeSkills[] = [];

  locked = true;

	constructor(values: object = {}) {
		Object.assign(this, values);

    this.fullId = this.id + '-' + this.mod;
    this.girlFolder = this.mod + '/' + this.id;

    const positions: Position[] = [];
    for (const position of this.positions) {
      positions.push(new Position(position));
    }
    this.positions = positions;

    const photos: PhotoShooting[] = [];
    for (const photo of this.photos) {
      photos.push(new PhotoShooting(photo));
    }
    this.photos = photos;

    const skills: TreeSkills[] = [];
    for (const skill of this.skills) {
      skills.push(new TreeSkills(skill));
    }
    this.skills = skills;

    this.setMultipliers();
	}

  setMultipliers(): void {
    const multipliers: {percent: number, stat: string}[] = [];

    if (this.xpModifier !== 1) {
      multipliers.push({percent: this.xpModifier*100, stat: 'experience'});
    }

    if (this.cumModifier !== 1) {
      multipliers.push({percent: this.cumModifier*100, stat: 'cum'});
    }

    if (this.fansModifier !== 1) {
      multipliers.push({percent: this.fansModifier*100, stat: 'fans'});
    }

    if (this.goldsModifier !== 1) {
      multipliers.push({percent: this.goldsModifier*100, stat: 'golds'});
    }

    if (this.pointsModifier !== 1) {
      multipliers.push({percent: this.pointsModifier*100, stat: 'pts'});
    }

    this.multipliers = multipliers;
  }

  getNextLevelXp(level: number): number {
    // return 100*(1+0.1) ** level;
    return  (level/0.6) ** 3;
  }

  setLevel(level: number): void {
    this.xp = this.getNextLevelXp(level) - 1;
  }

	get level(): number {
		return Math.trunc(0.6 * Math.cbrt(this.xp)) + 1;
	}

	get popularity(): number {
		return Math.trunc(0.07 * Math.sqrt(this.fans)) + 1;
	}

	set popularity(value: number) {
		this.fans = value;
	}

	get corruptionName(): string {
		return this.corruption - 1 >= 8
			? 'slutty'
			: ['normal', 'normal', 'normal', 'normal', 'sexy', 'sexy', 'sexy', 'sexy'][this.corruption - 1];
	}

  get skillPoints(): number {
    return Math.trunc(this.level / 5)
  }
}
