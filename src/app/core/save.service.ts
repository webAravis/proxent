import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GirlsService, SavedGirl } from './girls/girls.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { StudioService } from '../studio/studio.service';
import { InventoryService } from '../inventory/inventory.service';
import { RecordService } from '../record/record.service';
import { OtherStudiosService } from './other-studios.service';
import { StudioModifier } from '../studio/studiomodifier.model';
import { Item } from '../inventory/item.model';
import { Record } from '../record/record.model';
import { Studio } from './studio.model';
import { LeadersService, SavedLeader } from '../leaders/leaders.service';
import { ShootingService } from '../shooting/shooting.service';
import { Skill } from '../skills/treeskills.model';
import { Setting, SettingsService } from './settings.service';

import packageJson from '../../../package.json';
declare var modsConfig: any;

@Injectable({
  providedIn: 'root',
})
export class SaveService {

  saveIndex = 0;
  version = packageJson.version;

  showSaveChooser: Subject<boolean> = new Subject();
  saves: any[] = [];

  saved: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  constructor(
    private _gameService: GameService,
    private _girlsService: GirlsService,
    private _dialogsService: DialogsService,
    private _studioService: StudioService,
    private _inventoryService: InventoryService,
    private _recordService: RecordService,
    private _leadersService: LeadersService,
    private _otherStudiosService: OtherStudiosService,
    private _shootingService: ShootingService,
    private _settingsService: SettingsService
  ) {
    this._gameService.dayChanged.subscribe((day) =>
      day > 1 ? this.saveGame() : undefined
    );
    this._gameService.goldChanged.subscribe((golds) =>
      golds > 0 ? this.saveGame() : undefined
    );

    let allSaves = localStorage.getItem('saveGame') ?? btoa('[]');
    allSaves = atob(allSaves);

    // fix wrong property names
    allSaves = allSaves.replaceAll('unlockedPostions', 'unlockedPositions');

    const savesObject = JSON.parse(allSaves);
    this.saves = Array.isArray(savesObject) ? savesObject : [savesObject];
    this.saves = this._fixOldSaves(this.saves);

    // order save by most recent
    this.saves.sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
    this.saveIndex = this.saves.length;
  }

  export(saveIndex: number): string {
    return btoa(JSON.stringify(this.saves[saveIndex] ?? '{}'));
  }

  import(save: string): boolean {
    if (!this._isJsonString(atob(save))) {
      return false;
    }

    save = atob(save);

    // fix wrong property names
    save = save.replaceAll('unlockedPostions', 'unlockedPositions');
    let savedGame = JSON.parse(save);
    if (!(typeof savedGame === 'object') || !Object.keys(savedGame).includes('game')) {
      return false;
    }
    savedGame = this._fixOldSaves([savedGame])[0];

    this.saves.push(savedGame);
    this.saveIndex = this.saves.length - 1;

    this.loadGame();
    this.saveGame();
    return true;
  }

  delete(saveIndex: number): void {
    this.saves.splice(saveIndex, 1);

    if (this.saves.length === 0) {
      localStorage.removeItem('saveGame');
    } else {
      const saved = btoa(JSON.stringify(this.saves));
      localStorage.setItem('saveGame', saved);
    }
  }

  saveGame(): void {
    const modsList = (modsConfig && Array.isArray(modsConfig) ? modsConfig.map((mod: any) => mod.name ?? '').join(', ') : '');

    if (this._gameService.day <= 1) {
      return;
    }

    const gameParameters = {
      day: this._gameService.day,
      month: this._gameService.month,
      year: this._gameService.year,
      golds: this._gameService.golds,
      girlLimit: this._gameService.girlLimit.getValue(),
      fapMode: this._gameService.fapMode.getValue()
    };

    const dialogsStarted = this._dialogsService.dialogsStarted;
    const gameGirls = this._girlsService.gameGirls.getValue().filter(girl => !girl.locked);
    // prevent save if girlfriend's fans is 0 as it's not correctly saved
    if (gameGirls[0] !== undefined && gameGirls[0].fans === 0) {
      return;
    }

    const girls: SavedGirl[] = [];
    for (const girl of gameGirls) {
      let skills: { name: string; level: number; }[] = [];
      if (girl.skills && Array.isArray(girl.skills)) {
        const girlSkills: Skill[] = [];
        for (const treeSkill of girl.skills) {
          for (const skillTier of treeSkill.skillTiers) {
            for (const skill of skillTier.skills) {
              if (skill.level > 0) {
                girlSkills.push(new Skill(skill));
              }
            }
          }
        }
        skills = girlSkills.map((skill: Skill) => ({name: skill.name, level: skill.level}));
      }

      girls.push({
        corruption: girl.corruption,
        fans: girl.fans,
        freedom: girl.freedom,
        fullId: girl.fullId,
        id: girl.id,
        photos: girl.photos.filter(photo => !photo.locked).map(photo => photo.name),
        recordCount: girl.recordCount,
        shootingCount: girl.shootingCount,
        skillsobject: skills,
        unlockedPositions: girl.unlockedPositions,
        xp: girl.xp
      });
    }

    const studio = {
      studioUnlocked: this._studioService.studioUnlocked.getValue(),
      opened: this._studioService.opened.getValue(),
      modifiers: this._studioService.modifiers.getValue(),
    };

    const items: {name: string, quantity: number}[] = [];
    for (const item of this._inventoryService.items.getValue()) {
      const inSave = items.find(savedItem => savedItem.name === item.name);
      if (inSave !== undefined) {
        inSave.quantity++;
      } else {
        items.push({name: item.name, quantity: 1});
      }
    }
    const inventory = {
      items: items,
    };

    const records = this._recordService.records.getValue();
    const otherStudios = this._otherStudiosService.studios.getValue();
    const leaders = this._leadersService.leaders.getValue();
    const savedLeaders: SavedLeader[] = [];
    for (const leader of leaders) {
      savedLeaders.push({
        name: leader.name,
        mod: leader.mod,
        level: leader.lvl
      });
    }
    const settings = this._settingsService.settings.getValue();

    const toSave = {
      game: gameParameters,
      girls: girls,
      dialogsStarted: dialogsStarted,
      studio: studio,
      inventory: inventory,
      records: records,
      otherStudios: otherStudios,
      leaders: savedLeaders,
      settings: settings,
      lastSaved: new Date(),
      modList: modsList,
      version: this.version
    };

    let savedGames = this.saves;

    if (savedGames[this.saveIndex].modList !== modsList) {
      this.saveIndex = this.saves.length;
    }
    savedGames[this.saveIndex] = toSave;

    const saved = btoa(JSON.stringify(savedGames));
    localStorage.setItem('saveGame', saved);

    this.saves = savedGames;
    this.saved.next(new Date());
  }

  loadGame(): Observable<boolean> {
    if (this.saves === undefined || this.saves.length === 0) {
      return of(false);
    }

    const savedGame = this.saves[this.saveIndex];
    if (savedGame === undefined) {
      return of(false);
    }

    this._gameService.day = savedGame.game.day;
    this._gameService.month = savedGame.game.month ?? 1;
    this._gameService.year = savedGame.game.year ?? 1;
    this._gameService.golds = Number.isNaN(savedGame.game.golds) || savedGame.game.golds < 0
      ? 0
      : savedGame.game.golds;
    this._gameService.dayChanged.next(savedGame.game.day);
    this._gameService.goldChanged.next(savedGame.game.golds);
    this._gameService.fapMode.next(savedGame.game.fapMode ?? false);

    this._dialogsService.dialogsStarted = savedGame.dialogsStarted;

    this._girlsService.loadGirls(savedGame.girls);

    savedGame.game.girlLimit && !Number.isNaN(savedGame.game.girlLimit) ? this._gameService.girlLimit.next(savedGame.game.girlLimit) : undefined;

    savedGame.studio.studioUnlocked === undefined
      ? undefined
      : this._studioService.studioUnlocked.next(
        savedGame.studio.studioUnlocked
      );
    savedGame.studio.opened === undefined
      ? undefined
      : this._studioService.opened.next(savedGame.studio.opened);


    if (savedGame.studio.modifiers) {
      const modifiers: StudioModifier[] = [];
      for (const savedModifier of savedGame.studio.modifiers) {
        modifiers.push(new StudioModifier(savedModifier));
      }
      this._studioService.modifiers.next(
        this._studioService.initModifiersMethods(modifiers)
      );
    }

    if (savedGame.inventory.items) {
      const items: Item[] = [];
      for (const savedItem of savedGame.inventory.items) {
        for (let index = 0; index < savedItem.quantity; index++) {
          items.push(new Item(savedItem));
        }
      }
      this._inventoryService.items.next(items);
    }

    if (savedGame.records) {
      const records: Record[] = [];
      for (const savedrecord of savedGame.records) {
        records.push(new Record(savedrecord));
      }
      this._recordService.records.next(records);
    }

    if (savedGame.otherStudios) {
      const otherStudios: Studio[] = [];
      for (const savedotherStudios of savedGame.otherStudios) {
        otherStudios.push(new Studio(savedotherStudios));
      }
      this._otherStudiosService.studios.next(otherStudios);
    }

    if (savedGame.leaders && Array.isArray(savedGame.leaders)) {
      this._leadersService.loadLeaders(savedGame.leaders);
    }

    if (savedGame.playerPhotos) {
      this._shootingService.playerPhotos.next(savedGame.playerPhotos);
    }

    if (savedGame.settings && Array.isArray(savedGame.settings)) {
      const settings: Setting[] = [];
      for (const savedSetting of savedGame.settings) {
        settings.push(savedSetting);
      }

      this._settingsService.updateSettings(settings);
    }

    this.saved.next(new Date(savedGame.lastSaved));
    return of(true);
  }

  hasSave(): boolean {
    return localStorage.getItem('saveGame') !== null;
  }

  private _isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  private _fixOldSaves(saves: any[]): any {
    for (const save of saves) {
      if (save.version === packageJson.version) {
        continue;
      }

      let fixedGirls: SavedGirl[] = [];
      if (save.girls) {
        for (const girl of save.girls) {
          let photos: string[] = [];
          if (save.playerPhotos && Array.isArray(save.playerPhotos)) {
            photos = save.playerPhotos.filter((photo:any) => photo.girl.id == girl.id).map((photo:any) => photo.name);
          }

          let skills: { name: string; level: number; }[] = [];
          if (save.skills && Array.isArray(save.skills)) {
            const girlSkills: Skill[] = [];
            for (const treeSkill of save.skills.filter((tree: any) => tree.girl.id == girl.id)) {
              for (const skillTier of treeSkill.skillTiers) {
                for (const skill of skillTier.skills) {
                  if (skill.level > 0) {
                    girlSkills.push(new Skill(skill));
                  }
                }
              }
            }
            skills = girlSkills.map((skill: Skill) => ({name: skill.name, level: skill.level}));
          }

          const fixedGirl: SavedGirl = {
            corruption: girl.corruption,
            xp: girl.xp,
            fans: girl.fans,
            freedom: girl.freedom,
            id: girl.id,
            fullId: girl.id + '-' + 'legacy',
            recordCount: girl.recordCount,
            shootingCount: girl.shootingCount,
            unlockedPositions: girl.unlockedPositions,
            skillsobject: skills,
            photos: photos
          };

          fixedGirls.push(fixedGirl);
        }
      }
      save.girls = fixedGirls;

      if (save.records && Array.isArray(save.records)) {
        for (const record of save.records) {
          if (record.girl) {
            record.girlId = record.girl.id + '-legacy';
            delete record['girl'];
          }
        }
      }

      if (save.otherStudios && Array.isArray(save.otherStudios)) {
        for (const studio of save.otherStudios) {
          for (const record of studio.records) {
            if (record.girl) {
              record.girlId = record.girl.id + '-legacy';
              delete record['girl'];
            }
          }
        }
      }

      if (save.inventory && save.inventory.items && Array.isArray(save.inventory.items)) {
        const saveItems: {name: string, quantity: number}[] = [];

        for (const item of save.inventory.items) {
          const inSave = saveItems.find(savedItem => savedItem.name === item.name);
          if (inSave) {
            inSave.quantity++;
          } else {
            saveItems.push({name: item.name, quantity: 1});
          }
        }

        save.inventory.items = saveItems;
      }

      if (save.leaders && Array.isArray(save.leaders)) {
        const savedLeaders: SavedLeader[] = [];

        for (const leader of save.leaders) {
          savedLeaders.push({
            name: leader.name,
            mod: 'legacy',
            level: leader.lvl
          });
        }

        save.leaders = savedLeaders;
      }

      save.modList = 'legacy';
    }

    return saves;
  }
}
