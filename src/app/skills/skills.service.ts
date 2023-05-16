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

  upgradeSkill(skill: Skill): void {
    skill.level++;
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
      if (allSkillTrees.find(tree => tree.name === skillTree.name && tree.girl.id === skillTree.girl.id) !== undefined) {
        allSkillTrees = allSkillTrees.filter(tree => !(tree.name === skillTree.name && tree.girl.id === skillTree.girl.id));
        allSkillTrees.push(skillTree);
      }
    }

    this.treeSkills.next(allSkillTrees);
  }

  private _initTrees(): void {
    const allTrees: TreeSkills[] = [];

    // Yiny
    let yinySkills = new TreeSkills();
    yinySkills.girl = this._girlService.gameGirls.getValue().find(girl => girl.id === 1) ?? new Girl();
    yinySkills.name = 'special';
    yinySkills.description = 'Special skills and scenes';
    yinySkills.skillTiers = this._initSkills(yinySkills.girl.name);

    allTrees.push(yinySkills);
    allTrees.push(this._initCommonTree('recording', this._girlService.gameGirls.getValue().find(girl => girl.id === 1) ?? new Girl()));
    allTrees.push(this._initCommonTree('battle', this._girlService.gameGirls.getValue().find(girl => girl.id === 1) ?? new Girl()));

    console.log('init done', allTrees);
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

    switch (branch.toLowerCase()) {
      case 'yiny':
        skillTier0.skills = [
          new Skill({
            name: 'Fetishist',
            description: 'Unlocks Yiny\'s special scenes',
            maxlevel: 1,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
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
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+10%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+12%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+7.5%' }],
              [{ stat: 'golds', position: 'anal', label: 'Gold', value: '+14%' }, { stat: 'fans', position: 'anal', label: 'Fans', value: '+10%' }],
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
              [{ stat: 'orgasm', position: 'anal', label: 'Orgasm', value: '+50%' }],
              [{ stat: 'orgasm', position: 'anal', label: 'Orgasm', value: '+100%' }],
            ],
          }),
        ];

        break;

      // COMMON TREE SKILLS
      case 'recording':
        skillTier0.skills = [
          new Skill({
            name: 'Actor',
            description: 'Professional training, Unlocks recording habilities',
            maxlevel: 1,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ]
          })
        ];

        skillTier1.skills = [
          new Skill({
            name: 'Boobist',
            description: 'Boobs are now the MVP (Most Valuable Part) of the record',
            maxlevel: 4,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 },
              { type: 'recordmonthly_badge', quantity: 2 },
            ],
            requires: 'Actor',
            effects: [
              [{ stat: 'scene', label: 'New scene', value: 'Boobjob 2' }],
              [{ stat: 'scene', label: 'New scene', value: 'Boobjob 3' }],
              [{ stat: 'scene', label: 'New scene', value: 'Boobjob 4' }],
              [{ stat: 'scene', label: 'New scene', value: 'Boobjob 5' }],
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
            name: 'Silicon',
            description: 'Increasing boobs size',
            maxlevel: 2,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ],
            requires: 'Boobist',
            effects: [
              [{ stat: 'orgasm', position: 'boobjob', label: 'Orgasm', value: '+50%' }, { stat: 'orgasm', position: 'boobjob', label: 'Gold', value: '-5%' }],
              [{ stat: 'orgasm', position: 'boobjob', label: 'Orgasm', value: '+100%' }, { stat: 'orgasm', position: 'boobjob', label: 'Gold', value: '-15%' }],
            ],
          }),
          new Skill({
            name: 'Jumping jacks',
            description: 'By an intense training, girl gains skill efficiency',
            maxlevel: 5,
            unlockPrice: [
              { type: 'gold', quantity: 15_000 }
            ],
            requires: 'Boobist',
            effects: [
              [{ stat: 'golds', position: 'boobjob', label: 'Gold', value: '+5%' }, { stat: 'fans', position: 'boobjob', label: 'Fans', value: '+1%' }],
              [{ stat: 'golds', position: 'boobjob', label: 'Gold', value: '+10%' }, { stat: 'fans', position: 'boobjob', label: 'Fans', value: '+2%' }],
              [{ stat: 'golds', position: 'boobjob', label: 'Gold', value: '+15%' }, { stat: 'fans', position: 'boobjob', label: 'Fans', value: '+3%' }],
              [{ stat: 'golds', position: 'boobjob', label: 'Gold', value: '+20%' }, { stat: 'fans', position: 'boobjob', label: 'Fans', value: '+4%' }],
              [{ stat: 'golds', position: 'boobjob', label: 'Gold', value: '+25%' }, { stat: 'fans', position: 'boobjob', label: 'Fans', value: '+5%' }],
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
              [{ stat: 'orgasm', position: 'blowjob', label: 'Orgasm', value: '+50%' }],
              [{ stat: 'orgasm', position: 'blowjob', label: 'Orgasm', value: '+100%' }],
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
              { type: 'gold', quantity: 15_000 }
            ]
          })
        ];
    }

    skillTiers.push(skillTier0);
    skillTiers.push(skillTier1);
    skillTiers.push(skillTier2);

    return skillTiers;
  }
}
