import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Skill, TreeSkills } from './treeskills.model';
import { Girl } from '../core/girls/girl.model';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor() { }

  updateSkillLevel(skill: Skill, level: number): void {
    skill.level = level;
  }

  hasSkill(skillname: string, girl: Girl): boolean {
    const girlTreeskills = girl.skills;

    for (const treeSkills of girlTreeskills) {
      for (const skillTier of treeSkills.skillTiers) {
        for (const skill of skillTier.skills) {
          if (skill.name.toLowerCase() === skillname.toLowerCase() && skill.level > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  hasSkills(skillnames: string[], girl: Girl): boolean {
    for (const skillname of skillnames) {
      if (!this.hasSkill(skillname, girl)) {
        return false;
      }
    }
    return true;
  }
}
