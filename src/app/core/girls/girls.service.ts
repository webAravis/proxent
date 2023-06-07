import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Girl } from './girl.model';
import { DialogsService } from 'src/app/dialogs/dialogs.service';

export interface SavedGirl {
  id: string;
  fullId: string;
  xp: number;
  fans: number;
  corruption: number;
  unlockedPositions: string[];
  freedom: number;
  recordCount: number;
  shootingCount: number;
  photos: string[];
  skillsobject: {name: string, level: number}[];
}
declare var modsConfig: any;

@Injectable({
	providedIn: 'root',
})
export class GirlsService {
	currentGirl: BehaviorSubject<Girl> = new BehaviorSubject<Girl>(new Girl());
	gameGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);

  girlsConfig: any[] = [];
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
    private _dialogsService: DialogsService
  ) {
    this._initMods();
	}

  downgradeLevels(levelCap: number): void {
    const girls = this.gameGirls.getValue();
    for (const girl of girls) {
      if (girl.locked === false && girl.level > levelCap) {
        girl.setLevel(levelCap);
      }
    }

    this.gameGirls.next(girls);
  }

	addGirl(girl: Girl): void {
		girl.locked = false;

    if (this.gameGirls.getValue().filter(gameGirl => !gameGirl.locked).length-1 >= 2 && this._dialogsService.dialogsStarted[7] === false) {
      this._dialogsService.startDialog(7);
    }
	}

  removeGirl(girl: Girl): void {
    girl.locked = true;
  }

	unlockPosition(position: string, girl: Girl): void {
		girl.unlockedPositions.push(position);
	}

  getAllGirlsAttributes(attributeCount: number): string[][] {
    let allGirlsAttributes = this.gameGirls.getValue().map(girl => girl.attributes).filter(attributes => attributes.length >= attributeCount);

    if (allGirlsAttributes.length === 0) {
      allGirlsAttributes = this.gameGirls.getValue().map(girl => girl.attributes).filter(attributes => attributes.length >= attributeCount-1);
    }
    if (allGirlsAttributes.length === 0) {
      allGirlsAttributes = this.gameGirls.getValue().map(girl => girl.attributes).filter(attributes => attributes.length >= attributeCount-2);
    }

    const toReturn: string[][] = [];
    for (const attributes of allGirlsAttributes) {
      toReturn.push(this._getMultipleRandom(attributes, attributeCount))
    }

    return toReturn;
  }

  getAllPhotoAttributes(attibuteType: string): string[] {
    const allPhotoAttributes = this.gameGirls.getValue().map(girl => girl.photos.map(photo => photo.attributes[attibuteType as keyof typeof photo.attributes].toString()));
    let toReturn: string[] = [];

    for (let photoAttributes of allPhotoAttributes) {
      for (const attributes of photoAttributes) {
        if (attributes.includes(',')) {
          toReturn = [...toReturn, ...attributes.split(',')];
        } else {
          toReturn.push(attributes);
        }
      }
    }

    return toReturn;
  }

  getMaxGirlLevel(): number {
    return Math.max(...this.gameGirls.getValue().map(girl => girl.level));
  }

  getMaxGirlFans(): number {
    return Math.max(...this.gameGirls.getValue().map(girl => girl.fans));
  }

  loadGirls(girls: SavedGirl[]): void {
    const gameGirls = this.gameGirls.getValue();

    for (const girl of girls) {
      const gameGirl = gameGirls.find(gameGirl => gameGirl.fullId == girl.fullId);
      if (gameGirl === undefined) {
        continue;
      }

      gameGirl.locked = false;

      gameGirl.xp = girl.xp;
      gameGirl.fans = girl.fans;
      gameGirl.corruption = girl.corruption;
      gameGirl.unlockedPositions = girl.unlockedPositions;
      gameGirl.freedom = girl.freedom;
      gameGirl.recordCount = girl.recordCount;
      gameGirl.shootingCount = girl.shootingCount;

      for (const photo of girl.photos) {
        const girlPhoto = gameGirl.photos.find(girlPhoto => girlPhoto.name === photo);
        if (girlPhoto) {
          girlPhoto.locked = false;
        }
      }

      for (const girlSkill of girl.skillsobject) {

        for (const treeSkills of gameGirl.skills) {
          for (const skillTier of treeSkills.skillTiers) {
            for (const skill of skillTier.skills) {
              if (skill.name.toLowerCase() === girlSkill.name.toLowerCase() && girlSkill.level > 0) {
                skill.level = girlSkill.level;
              }
            }
          }
        }

      }
    }
  }

  private _initMods(): void {
    this.loaded.next(false);

    if (modsConfig.length === 0) {
      setTimeout(() => {
        this._initMods();
      }, 30);

      return;
    }

    for (const mod of modsConfig) {
      if (mod.girls) {
        for (const girl of mod.girls) {
          girl.mod = mod.name;

          if (girl.skills) {
            for (const tree of girl.skills) {
              if (tree.skillTiers) {
                for (const skillTier of tree.skillTiers) {
                  if (skillTier.skills) {
                    for (const skill of skillTier.skills) {
                      skill.mod = mod.name + '/' + girl.id;
                      skill.picture = skill.name.toLowerCase().replaceAll(' ', '-');
                    }
                  }
                }
              }
            }
          }
        }
        this.girlsConfig = [...this.girlsConfig, ...mod.girls];
      }
    }
    this._initGirls();
  }

	private _initGirls(): void {
    const girlsArray: Girl[] = [];
    for (const girl of this.girlsConfig) {
      girlsArray.push(new Girl(girl));
    }

		this.gameGirls.next(girlsArray);
    this.loaded.next(true);
	}

  private _getMultipleRandom(arr: any[], num: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, num);
  }
}
