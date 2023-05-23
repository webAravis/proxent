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

  hasSkills(skillnames: string[], girl: Girl): boolean {
    for (const skillname of skillnames) {
      if (!this.hasSkill(skillname, girl)) {
        return false;
      }
    }
    return true;
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
                  skillUpdated.sprite_postop = skill.sprite_postop;
                  skillUpdated.sprite_posleft = skill.sprite_posleft;
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

    // Ava
    let avaSkills = new TreeSkills();
    avaSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 3) ?? new Girl();
    avaSkills.name = 'special';
    avaSkills.description = 'Special skills and scenes';
    avaSkills.skillTiers = this._initSkills(avaSkills.girl.name);

    allTrees.push(avaSkills);

    // Madison
    let madisonSkills = new TreeSkills();
    madisonSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 4) ?? new Girl();
    madisonSkills.name = 'special';
    madisonSkills.description = 'Special skills and scenes';
    madisonSkills.skillTiers = this._initSkills(madisonSkills.girl.name);

    allTrees.push(madisonSkills);

    // Karma
    let karmaSkills = new TreeSkills();
    karmaSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 5) ?? new Girl();
    karmaSkills.name = 'special';
    karmaSkills.description = 'Special skills and scenes';
    karmaSkills.skillTiers = this._initSkills(karmaSkills.girl.name);

    allTrees.push(karmaSkills);

    // Nikki
    let nikkiSkills = new TreeSkills();
    nikkiSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 6) ?? new Girl();
    nikkiSkills.name = 'special';
    nikkiSkills.description = 'Special skills and scenes';
    nikkiSkills.skillTiers = this._initSkills(nikkiSkills.girl.name);

    allTrees.push(nikkiSkills);

    // Abella
    let abellaSkills = new TreeSkills();
    abellaSkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 7) ?? new Girl();
    abellaSkills.name = 'special';
    abellaSkills.description = 'Special skills and scenes';
    abellaSkills.skillTiers = this._initSkills(abellaSkills.girl.name);

    allTrees.push(abellaSkills);

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
            sprite_postop: -95,
            sprite_posleft: -5,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 15_000 }],
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Anal',
            description: 'Unlocks or upgrades anal scenes',
            sprite_postop: -5,
            sprite_posleft: -102,
            maxlevel: 5,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
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
            sprite_postop: -378,
            sprite_posleft: -47,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Footjob' }],
            ]
          }),
        ];

        skillTier2.skills = [
          new Skill({
            name: 'Anal Enlargement',
            description: 'Yiny has now more experience with anal, improving thoses scenes rewards',
            sprite_postop: -239,
            sprite_posleft: -374,
            maxlevel: 3,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }],
            ],
            requires: ['Anal'],
            effects: [
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+8%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+10%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+7.5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+12%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+10%' }],
            ]
          }),
          new Skill({
            name: 'Anal Lubricant',
            description: 'Usage of lubricant increases pleasure',
            sprite_postop: -422,
            sprite_posleft: -186,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }]
            ],
            requires: ['Anal'],
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
            sprite_postop: -422,
            sprite_posleft: -374,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 60_000 }]
            ],
            requires: ['Anal Enlargement'],
            effects: [
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+25%' }],
            ]
          }),
          new Skill({
            name: 'Natural excitation',
            description: 'More excitation means better lubrication',
            sprite_postop: -332,
            sprite_posleft: -186,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 60_000 }]
            ],
            requires: ['Anal Lubricant'],
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
            sprite_postop: -95,
            sprite_posleft: -5,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 15_000 }]
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Piledriving',
            description: 'Flexibility and agility',
            sprite_postop: -422,
            sprite_posleft: -283,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Piledriving' }],
              [{ stat: 'scene', label: 'New scene', value: 'Piledriving 2' }],
            ]
          }),
          new Skill({
            name: 'Sidefuck',
            description: 'No more place for relaxation',
            sprite_postop: -238,
            sprite_posleft: -926,
            maxlevel: 5,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
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
            sprite_postop: -286,
            sprite_posleft: -3,
            maxlevel: 5,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
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
      case 'ava':
        skillTier0.skills = [
          new Skill({
            name: 'Fetishist',
            description: 'Unlocks Ava\'s special scenes',
            sprite_postop: -95,
            sprite_posleft: -5,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 15_000 }]
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Mouthfuck',
            description: 'Turn her mouth in another hole',
            sprite_postop: -422,
            sprite_posleft: -283,
            maxlevel: 3,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Mouthfuck' }],
              [{ stat: 'scene', label: 'New scene', value: 'Mouthfuck 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Mouthfuck 3' }],
            ]
          }),
          new Skill({
            name: 'Anal',
            description: 'Tighter hole for bigger pleasure',
            sprite_postop: -238,
            sprite_posleft: -926,
            maxlevel: 4,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Anal' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Anal 4' }],
            ]
          }),
          new Skill({
            name: 'Double',
            description: 'One is not enough',
            sprite_postop: -286,
            sprite_posleft: -3,
            maxlevel: 4,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Double' }],
              [{ stat: 'scene', label: 'New scene', value: 'Double 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Double 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Double 4' }],
            ]
          }),
        ]

        skillTier3.skills = [
          new Skill({
            name: 'Triple',
            description: 'Two is not enough?',
            sprite_postop: -286,
            sprite_posleft: -3,
            maxlevel: 5,
            unlockPrice: [
              [{ type: 'gold', quantity: 45_000 }, { type: 'basic_skill_gem', quantity: 2 }],
              [{ type: 'gold', quantity: 60_000 }, { type: 'advanced_skill_gem', quantity: 2 }],
            ],
            requires: ['Fetishist'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Triple' }],
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
            sprite_postop: -5,
            sprite_posleft: -6,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 15_000 }]
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Cowgirl',
            description: 'Training her legs for better bounce',
            sprite_postop: -185,
            sprite_posleft: -925,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Actor'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Cowgirl 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Cowgirl 4' }],
            ]
          }),
          new Skill({
            name: 'Reverse Cowgirl',
            description: 'Training her legs for better bounce',
            sprite_postop: -184,
            sprite_posleft: -832,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Actor'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Reverse Cowgirl 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Reverse Cowgirl 4' }],
            ]
          }),
          new Skill({
            name: 'Mouthist',
            description: 'Mouth special treatment, increasing efficiency',
            sprite_postop: -95,
            sprite_posleft: -1063,
            maxlevel: 4,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Actor'],
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
            sprite_postop: -185,
            sprite_posleft: -1109,
            maxlevel: 5,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }]
            ],
            requires: ['Cowgirl'],
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
            sprite_postop: -185,
            sprite_posleft: -1154,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }]
            ],
            requires: ['Reverse Cowgirl'],
            effects: [
              [
                { stat: 'boner', position: 'reversecowgirl', label: 'Boner', value: '+15%' },
                { stat: 'golds', position: 'reversecowgirl', label: 'Gold', value: '-5%' },
              ],
              [
                { stat: 'boner', position: 'reversecowgirl', label: 'Boner', value: '+25%' },
                { stat: 'golds', position: 'reversecowgirl', label: 'Gold', value: '-5%' },
              ],
            ],
          }),
          new Skill({
            name: 'Botox',
            description: 'Bigger lips for bigger pleasure',
            sprite_postop: -5,
            sprite_posleft: -1064,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }]
            ],
            requires: ['Mouthist'],
            effects: [
              [{ stat: 'boner', position: 'blowjob', label: 'Boner', value: '+25%' }],
              [{ stat: 'boner', position: 'blowjob', label: 'Boner', value: '+50%' }],
            ],
          })
        ];

        skillTier3.skills = [
          new Skill({
            name: 'Endurance',
            description: 'Self-control improvement leads to boner conservation',
            sprite_postop: -95,
            sprite_posleft: -1017,
            maxlevel: 8,
            unlockPrice: [
              [{ type: 'gold', quantity: 40_000 }],
              [{ type: 'gold', quantity: 80_000 }],
              [{ type: 'gold', quantity: 130_000 }],
              [{ type: 'gold', quantity: 190_000 }],
              [{ type: 'gold', quantity: 260_000 }],
              [{ type: 'gold', quantity: 340_000 }],
              [{ type: 'gold', quantity: 430_000 }],
              [{ type: 'gold', quantity: 530_000 }],
              [{ type: 'gold', quantity: 640_000 }],
            ],
            requires: ['Jumping jacks', 'Firm legs', 'Botox'],
            effects: [
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+10%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+20%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+30%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+40%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+50%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+60%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+70%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+80%' }],
            ]
          }),
        ];

        break;

      case 'battle':
        skillTier0.skills = [
          new Skill({
            name: 'Competitor',
            description: 'Competitor training, Unlocks recording habilities',
            sprite_postop: -186,
            sprite_posleft: -198,
            maxlevel: 1,
            unlockPrice: [
              [{ type: 'gold', quantity: 15_000 }]
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Sitted',
            description: 'Relax and take it',
            sprite_postop: -141,
            sprite_posleft: -198,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Competitor'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Sitted' }],
              [{ stat: 'scene', label: 'New scene', value: 'Sitted 2' }],
            ]
          }),
          new Skill({
            name: 'Outdoor',
            description: 'Nothing better than fresh air',
            sprite_postop: -5,
            sprite_posleft: -924,
            maxlevel: 2,
            unlockPrice: [
              [{ type: 'gold', quantity: 30_000 }, { type: 'basic_skill_gem', quantity: 1 }],
              [{ type: 'gold', quantity: 45_000 }, { type: 'advanced_skill_gem', quantity: 1 }],
            ],
            requires: ['Competitor'],
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Outdoor' }],
              [{ stat: 'scene', label: 'New scene', value: 'Outdoor 2' }],
            ]
          }),
          new Skill({
            name: 'Foreplay trainer',
            description: 'Feedback & data analysis helps to get better feeling',
            sprite_postop: -5,
            sprite_posleft: -54,
            maxlevel: 8,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 }]
            ],
            requires: ['Competitor'],
            effects: [
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+1%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+2%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+3%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+4%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+5%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+6%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+7%' }],
              [{ stat: 'boner', position: 'all_foreplay', label: 'All foreplay boner', value: '+8%' }],
            ]
          }),
        ];

        skillTier2.skills = [
          new Skill({
            name: 'Penetration trainer',
            description: 'Feedback & data analysis helps to get better feeling',
            sprite_postop: -5,
            sprite_posleft: -198,
            maxlevel: 8,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 },]
            ],
            requires: ['Foreplay trainer'],
            effects: [
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+1%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+2%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+3%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+4%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+5%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+6%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+7%' }],
              [{ stat: 'orgasm', position: 'all_penetration', label: 'All penetration orgasm', value: '+8%' }],
            ]
          }),
          new Skill({
            name: 'Special trainer',
            description: 'Feedback & data analysis helps to get better feeling',
            sprite_postop: -50,
            sprite_posleft: -101,
            maxlevel: 8,
            unlockPrice: [
              [{ type: 'gold', quantity: 10_000 },]
            ],
            requires: ['Foreplay trainer'],
            effects: [
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+1%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+2%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+3%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+4%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+5%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+6%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+7%' }],
              [{ stat: 'orgasm', position: 'all_special', label: 'All special orgasm', value: '+8%' }],
            ]
          }),
        ];

        skillTier3.skills = [
          new Skill({
            name: 'Battle Endurance',
            description: 'Self-control improvement leads to boner conservation',
            sprite_postop: -95,
            sprite_posleft: -1017,
            maxlevel: 8,
            unlockPrice: [
              [{ type: 'gold', quantity: 40_000 }],
              [{ type: 'gold', quantity: 80_000 }],
              [{ type: 'gold', quantity: 130_000 }],
              [{ type: 'gold', quantity: 190_000 }],
              [{ type: 'gold', quantity: 260_000 }],
              [{ type: 'gold', quantity: 340_000 }],
              [{ type: 'gold', quantity: 430_000 }],
              [{ type: 'gold', quantity: 530_000 }],
              [{ type: 'gold', quantity: 640_000 }],
            ],
            requires: ['Penetration trainer', 'Special trainer'],
            effects: [
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+10%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+20%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+30%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+40%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+50%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+60%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+70%' }],
              [{ stat: 'boner', position: 'all_penetration', label: 'All penetration boner', value: '+80%' }],
            ]
          }),
        ];
    }

    skillTiers.push(skillTier0);
    skillTiers.push(skillTier1);
    skillTiers.push(skillTier2);
    skillTiers.push(skillTier3);

    return skillTiers;
  }
}
