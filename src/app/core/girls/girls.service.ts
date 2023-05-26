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
  loading = true;

	constructor(
    private _dialogsService: DialogsService
  ) {
    this._initMods();
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

    this.loading = false;
	}
}
