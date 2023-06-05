import { Girl } from "../core/girls/girl.model";

export class TreeSkills {
  girl: Girl = new Girl();
  name: string = '';
  description: string = '';
  skillTiers: SkillTier[] = [];

	constructor(values: object = {}) {
		Object.assign(this, values);
    this.girl = new Girl(this.girl);

    const skillTiers: SkillTier[] = [];
    for (const skillTier of this.skillTiers) {
      skillTiers.push(new SkillTier(skillTier));
    }
    this.skillTiers = skillTiers;
	}
}

export class SkillTier {
  tier: number = 0;
  skills: Skill[] = [];

	constructor(values: object = {}) {
		Object.assign(this, values);

    const skills: Skill[] = [];
    for (const skill of this.skills) {
      skills.push(new Skill(skill));
    }
    this.skills = skills;
	}
}

export class Skill {
  name: string = '';
  description: string = '';

  mod: string = '';
  picture: string = '';

  level: number = 0;
  maxlevel: number = 0;

	unlockPrice: { type: string; quantity: number }[][] = [];

  effects: { stat: string, position: string, label: string, value: string, triggerEffect: string, duration: number, chance: number }[][] = [];
  requires: string[] | undefined = undefined;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
