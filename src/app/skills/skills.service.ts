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

  updateTrees(skillTrees: TreeSkills[]): void {
    // let allSkillTrees = this.treeSkills.getValue();
    // for (const skillTree of skillTrees) {
    //   const skillTreeToUpdate = allSkillTrees.find(tree => tree.name === skillTree.name && tree.girl.id === skillTree.girl.id);
    //   if (skillTreeToUpdate !== undefined) {

    //     for (const skillTier of skillTreeToUpdate.skillTiers) {
    //       for (const skill of skillTier.skills) {
    //         // finding skill in skillTree parameter
    //         for (const skillTierParameter of skillTree.skillTiers) {
    //           // let skillsUpdated: Skill[] = [];
    //           for (const skillInTier of skillTierParameter.skills) {
    //             if (skill.name === skillInTier.name) {
    //               const skillUpdated = new Skill({name: skillInTier.name, level: (skillInTier.level <= skill.maxlevel ? skillInTier.level : skill.maxlevel)});

    //               skillUpdated.description = skill.description;
    //               skillUpdated.sprite_postop = skill.sprite_postop;
    //               skillUpdated.sprite_posleft = skill.sprite_posleft;
    //               skillUpdated.effects = skill.effects;
    //               skillUpdated.maxlevel = skill.maxlevel;
    //               skillUpdated.requires = skill.requires;
    //               skillUpdated.unlockPrice = skill.unlockPrice;

    //               Object.assign(skill, skillUpdated);
    //             }
    //           }
    //         }
    //       }
    //     }

    //     allSkillTrees = allSkillTrees.filter(tree => !(tree.name === skillTreeToUpdate.name && tree.girl.id === skillTreeToUpdate.girl.id));
    //     allSkillTrees.push(skillTreeToUpdate);
    //   }
    // }

    // this.treeSkills.next(allSkillTrees);
  }
}
