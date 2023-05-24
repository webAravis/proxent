import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Girl } from './girl.model';
import { DialogsService } from 'src/app/dialogs/dialogs.service';

export interface SavedGirl {
  id: string;
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

	constructor(
    private _dialogsService: DialogsService
  ) {
    setTimeout(() => {
      this._initMods();
      this._initGirls();
    }, 200);
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
      const gameGirl = gameGirls.find(gameGirl => gameGirl.id == girl.id);
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

    console.log('girls loaded', this.gameGirls.getValue());
  }

  private _initMods(): void {
    for (const mod of modsConfig) {
      if (mod.girls) {
        this.girlsConfig = [...this.girlsConfig, ...mod.girls];
      }
    }
  }

	private _initGirls(): void {
    console.log('girls', this.girlsConfig);

    const girlsArray: Girl[] = [];
    for (const girl of this.girlsConfig) {
      girlsArray.push(new Girl(girl));
    }

    console.log('initialized girls', girlsArray);
		this.gameGirls.next(girlsArray);
	}
}
