import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Skill, SkillTier, TreeSkills } from './treeskills.model';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  treeSkills: BehaviorSubject<TreeSkills[]> = new BehaviorSubject<TreeSkills[]>([]);

  constructor(
    private _girlService: GirlsService
  ) {
    this._initTrees();
  }

  updateSkillLevel(skill: Skill, level: number): void {
    skill.level = level;
  }

  hasSkill(skillname: string, girl: Girl): boolean {
    const girlTreeskills = this.treeSkills.getValue().filter(treeSkills => treeSkills.girl.id === 0 || treeSkills.girl.id === girl.id);

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

  updateTrees(skillTrees: TreeSkills[]): void {
    let allSkillTrees = this.treeSkills.getValue();
    for (const skillTree of skillTrees) {
      const skillTreeToUpdate = allSkillTrees.find(tree => tree.name === skillTree.name && tree.girl.id === skillTree.girl.id);
      if (skillTreeToUpdate !== undefined) {

        for (const skillTier of skillTreeToUpdate.skillTiers) {
          for (const skill of skillTier.skills) {
            // finding skill in skillTree parameter
            for (const skillTierParameter of skillTree.skillTiers) {
              // let skillsUpdated: Skill[] = [];
              for (const skillInTier of skillTierParameter.skills) {
                if (skill.name === skillInTier.name) {
                  const skillUpdated = new Skill({name: skillInTier.name, level: skillInTier.level});

                  skillUpdated.description = skill.description;
                  skillUpdated.effects = skill.effects;
                  skillUpdated.maxlevel = skill.maxlevel;
                  skillUpdated.requires = skill.requires;
                  skillUpdated.unlockPrice = skill.unlockPrice;

                  Object.assign(skill, skillUpdated);
                }
              }
            }
          }
        }

        allSkillTrees = allSkillTrees.filter(tree => !(tree.name === skillTreeToUpdate.name && tree.girl.id === skillTreeToUpdate.girl.id));
        allSkillTrees.push(skillTreeToUpdate);
      }
    }

    this.treeSkills.next(allSkillTrees);
  }

  private _initTrees(): void {
    let allTrees: TreeSkills[] = [];

    // Yiny
    let yinySkills = new TreeSkills();
    yinySkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 1) ?? new Girl();
    yinySkills.name = 'special';
    yinySkills.description = 'Special skills and scenes';
    yinySkills.skillTiers = this._initSkills(yinySkills.girl.name);

    allTrees.push(yinySkills);

    // Peta
    let petaSkills = new TreeSkills();
    petaSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 2) ?? new Girl();
    petaSkills.name = 'special';
    petaSkills.description = 'Special skills and scenes';
    petaSkills.skillTiers = this._initSkills(petaSkills.girl.name);

    allTrees.push(petaSkills);

    let commonTrees: TreeSkills[] = [];
    for (const tree of allTrees) {
      commonTrees.push(this._initCommonTree('recording', this._girlService.gameGirls.getValue().find(girl => girl.id === tree.girl.id) ?? new Girl()));
      commonTrees.push(this._initCommonTree('battle', this._girlService.gameGirls.getValue().find(girl => girl.id === tree.girl.id) ?? new Girl()));
    }
    allTrees = [...allTrees, ...commonTrees];

    this.treeSkills.next(allTrees);
  }

  private _initCommonTree(treename: string, girl: Girl): TreeSkills {
    // Common trees
    let commonTree = new TreeSkills();
    commonTree.girl = girl;
    commonTree.skillTiers = this._initSkills(treename);

    switch (treename) {
      case 'recording':
        commonTree.name = 'recording';
        commonTree.description = 'Improve recording advantages';
        break;
      case 'battle':
        commonTree.name = 'battle';
        commonTree.description = 'Improve battle advantages';
        break;
    }

    return commonTree;
  }

  private _initSkills(branch: string): SkillTier[] {
    const skillTiers: SkillTier[] = [];

    const skillTier0 = new SkillTier({tier: 0});
    const skillTier1 = new SkillTier({tier: 1});
    const skillTier2 = new SkillTier({tier: 2});
    const skillTier3 = new SkillTier({tier: 3});

    switch (branch.toLowerCase()) {
      case 'yiny':
        skillTier0.skills = [
          new Skill({
            name: 'Fetishist',
            description: 'Unlocks Yiny\'s special scenes',
            maxlevel: 1,
            unlockPrice: [
              { type: 'basic_skill_gem', quantity: 1 }
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Anal',
            description: 'Unlocks or upgrades anal scenes',
            maxlevel: 5,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Fetishist',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Anal' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 4' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 5' }],
            ]
          }),
          new Skill({
            name: 'Footjob',
            description: 'Unlocks or upgrades footjob scenes',
            maxlevel: 1,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Fetishist',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Footjob' }],
            ]
          }),
        ];

        skillTier2.skills = [
          new Skill({
            name: 'Anal Enlargement',
            description: 'Yiny has now more experience with anal, improving thoses scenes rewards',
            maxlevel: 3,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Anal',
            effects: [
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+8%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+10%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+7.5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+12%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+10%' }],
            ]
          }),
          new Skill({
            name: 'Anal Lubricant',
            description: 'Usage of lubricant increases pleasure',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Anal',
            effects: [
              [{ stat: 'orgasm', position: 'anal', label: 'Orgasm', value: '+5%' }],
              [{ stat: 'orgasm', position: 'anal', label: 'Orgasm', value: '+10%' }],
            ],
          }),
        ];

        skillTier3.skills = [
          new Skill({
            name: 'Anal Stretching',
            description: 'Yiny is capable of stretching her anus',
            maxlevel: 1,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Anal Enlargement',
            effects: [
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+25%' }],
            ]
          }),
          new Skill({
            name: 'Natural excitation',
            description: 'More excitation means better lubrication',
            maxlevel: 1,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Anal Lubricant',
            effects: [
              [{ stat: 'orgasm', position: 'anal', label: 'Orgasm', value: '+25%' }],
            ],
          }),
        ]

        break;

      case 'peta':
        skillTier0.skills = [
          new Skill({
            name: 'Fetishist',
            description: 'Unlocks Peta\'s special scenes',
            maxlevel: 1,
            unlockPrice: [
              { type: 'basic_skill_gem', quantity: 1 }
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Piledriving',
            description: 'Flexibility and agility',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Fetishist',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Piledriving' }],
              [{ stat: 'scene', label: 'New scene', value: 'Piledriving 2' }],
            ]
          }),
          new Skill({
            name: 'Sidefuck',
            description: 'No more place for relaxation',
            maxlevel: 5,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Fetishist',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Sidefuck' }],
              [{ stat: 'scene', label: 'New scene', value: 'Sidefuck 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Sidefuck 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Sidefuck 4' }],
              [{ stat: 'scene', label: 'New scene', value: 'Sidefuck 5' }],
            ]
          }),
          new Skill({
            name: 'Cosplay',
            description: 'She likes to disguise',
            maxlevel: 5,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Fetishist',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Cosplay' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cosplay 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cosplay 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cosplay 4' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cosplay 5' }],
            ]
          }),
        ]
        break;

      // COMMON TREE SKILLS
      case 'recording':
        skillTier0.skills = [
          new Skill({
            name: 'Actor',
            description: 'Professional training, Unlocks recording habilities',
            maxlevel: 1,
            unlockPrice: [
              { type: 'basic_skill_gem', quantity: 1 }
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Cowgirl',
            description: 'Training her legs for better bounce',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Actor',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Cowgirl 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cowgirl 4' }],
            ]
          }),
          new Skill({
            name: 'Reverse Cowgirl',
            description: 'Training her legs for better bounce',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Actor',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Reverse Cowgirl 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Reverse Cowgirl 4' }],
            ]
          }),
          new Skill({
            name: 'Mouthist',
            description: 'Mouth special treatment, increasing efficiency',
            maxlevel: 4,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
            ],
            requires: 'Actor',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Blowjob 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Blowjob 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Blowjob 4' }],
              [{ stat: 'scene', label: 'New scene', value: 'Blowjob 5' }],
            ]
          }),
        ];

        skillTier2.skills = [
          new Skill({
            name: 'Jumping jacks',
            description: 'By an intense training, girl gains skill efficiency',
            maxlevel: 5,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ],
            requires: 'Cowgirl',
            effects: [
              [{ stat: 'golds', position: 'cowgirl', label: 'Gold', value: '+5%' }, { stat: 'fans', position: 'cowgirl', label: 'Fans', value: '+1%' }],
              [{ stat: 'golds', position: 'cowgirl', label: 'Gold', value: '+10%' }, { stat: 'fans', position: 'cowgirl', label: 'Fans', value: '+2%' }],
              [{ stat: 'golds', position: 'cowgirl', label: 'Gold', value: '+15%' }, { stat: 'fans', position: 'cowgirl', label: 'Fans', value: '+3%' }],
              [{ stat: 'golds', position: 'cowgirl', label: 'Gold', value: '+20%' }, { stat: 'fans', position: 'cowgirl', label: 'Fans', value: '+4%' }],
              [{ stat: 'golds', position: 'cowgirl', label: 'Gold', value: '+25%' }, { stat: 'fans', position: 'cowgirl', label: 'Fans', value: '+5%' }],
            ],
          }),
          new Skill({
            name: 'Firm legs',
            description: 'Increasing bouncing',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ],
            requires: 'Reverse Cowgirl',
            effects: [
              [
                { stat: 'bonner', position: 'reversecowgirl', label: 'Bonner', value: '+15%' },
                { stat: 'golds', position: 'reversecowgirl', label: 'Gold', value: '-5%' },
              ],
              [
                { stat: 'bonner', position: 'reversecowgirl', label: 'Bonner', value: '+25%' },
                { stat: 'golds', position: 'reversecowgirl', label: 'Gold', value: '-5%' },
              ],
            ],
          }),
          new Skill({
            name: 'Botox',
            description: 'Bigger lips for bigger pleasure',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ],
            requires: 'Mouthist',
            effects: [
              [{ stat: 'bonner', position: 'blowjob', label: 'Bonner', value: '+25%' }],
              [{ stat: 'bonner', position: 'blowjob', label: 'Bonner', value: '+50%' }],
            ],
          })
        ];
        break;

      case 'battle':
        skillTier0.skills = [
          new Skill({
            name: 'Competitor',
            description: 'Competitor training, Unlocks recording habilities',
            maxlevel: 1,
            unlockPrice: [
              { type: 'basic_skill_gem', quantity: 1 }
            ]
          })
        ];
    }

    skillTiers.push(skillTier0);
    skillTiers.push(skillTier1);
    skillTiers.push(skillTier2);
    skillTiers.push(skillTier3);

    return skillTiers;
  }
}
