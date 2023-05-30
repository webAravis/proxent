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
		return this.corruption - 1 >= 8
			? 'slutty'
			: ['normal', 'normal', 'normal', 'normal', 'sexy', 'sexy', 'sexy', 'sexy'][this.corruption - 1];
	}

  get skillPoints(): number {
    return Math.trunc(this.level / 5)
  }
}
