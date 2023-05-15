import { of, Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { GirlsService } from './girls/girls.service';
import { Girl } from './girls/girl.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { StudioService } from '../studio/studio.service';
import { InventoryService } from '../inventory/inventory.service';
import { RecordService } from '../record/record.service';
import { OtherStudiosService } from './other-studios.service';
import { StudioModifier } from '../studio/studiomodifier.model';
import { Item } from '../inventory/item.model';
import { Record } from '../record/record.model';
import { Studio } from './studio.model';
import { LeadersService } from '../leaders/leaders.service';
import { Leader } from '../leaders/leader.model';
import { ShootingService } from '../shooting/shooting.service';
import { PhotoShooting } from '../shooting/shooting.component';

@Injectable({
  providedIn: 'root',
})
export class SaveService {

  saveIndex = 0;

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
    private _shootingService: ShootingService
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
    const savedGame = JSON.parse(save);
    if (!(typeof savedGame === 'object') || !Object.keys(savedGame).includes('game')) {
      return false;
    }

    this.saves.push(savedGame);
    this.saveIndex = this.saves.length - 1;

    this.loadGame();
    this.saveGame();
    return true;
  }

  delete(saveIndex: number): void {
    this.saves.splice(saveIndex, 1);

    const saved = btoa(JSON.stringify(this.saves));
    localStorage.setItem('saveGame', saved);
  }

  saveGame(): void {
    if (this._gameService.day <= 1) {
      return;
    }

    const gameParameters = {
      day: this._gameService.day,
      month: this._gameService.month,
      year: this._gameService.year,
      golds: this._gameService.golds,
      girlLimit: this._gameService.girlLimit.getValue()
    };

    const dialogsStarted = this._dialogsService.dialogsStarted;

    const girls = this._girlsService.playerGirls.getValue();
    // prevent save if girlfriend's fans is 0 as it's not correctly saved
    if (girls[0] !== undefined && girls[0].fans === 0) {
      return;
    }

    const studio = {
      studioUnlocked: this._studioService.studioUnlocked.getValue(),
      opened: this._studioService.opened.getValue(),
      modifiers: this._studioService.modifiers.getValue(),
    };

    const inventory = {
      items: this._inventoryService.items.getValue(),
    };

    const records = this._recordService.records.getValue();

    const otherStudios = this._otherStudiosService.studios.getValue();

    const leaders = this._leadersService.leaders.getValue();

    const playerPhotos = this._shootingService.playerPhotos.getValue();

    const toSave = {
      game: gameParameters,
      girls: girls,
      dialogsStarted: dialogsStarted,
      studio: studio,
      inventory: inventory,
      records: records,
      otherStudios: otherStudios,
      leaders: leaders,
      playerPhotos: playerPhotos,
      lastSaved: new Date(),
      version: '0.9.1'
    };

    let savedGames = this.saves;

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

    this._dialogsService.dialogsStarted = savedGame.dialogsStarted;

    const girlsToLoad = [];
    for (const savedGirl of savedGame.girls) {
      const girl = new Girl(savedGirl);

      girlsToLoad.push(girl);
    }

    // let yiny = new Girl({
    //   id: 1,
    //   name: "Yiny",
    //   fans: 300_000,
    //   xp: 300_000,
    //   skill: 20,
    //   freedom: 0,
    //   corruption: 20,
    //   unlockedPostions: [
    //     "intro", "tease", "rub", "handjob", "masturbate", "boobjob", "blowjob", "missionary", "reversecowgirl", "cowgirl", "doggy", "doggy2", "standing"
    //   ]
    // });
    // girlsToLoad.push(yiny);

    // let peta = new Girl({
    //   id: 2,
    //   name: "Peta",
    //   fans: 300_000,
    //   xp: 175_000,
    //   skill: 20,
    //   corruption: 20,
    //   unlockedPostions: [
    //     "intro", "tease", "rub", "handjob", "masturbate", "boobjob", "blowjob", "missionary", "reversecowgirl", "cowgirl", "doggy", "doggy2", "standing"
    //   ]
    // });
    // girlsToLoad.push(peta);

    this._girlsService.playerGirls.next(this._girlsService.initAttributes(girlsToLoad));
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
        const modifier = new StudioModifier(savedModifier);
        modifiers.push(modifier);
      }
      this._studioService.modifiers.next(
        this._studioService.initModifiersMethods(modifiers)
      );
    }

    if (savedGame.inventory.items) {
      const items: Item[] = [];
      for (const savedItem of savedGame.inventory.items) {
        const item = new Item(savedItem);
        items.push(item);
      }
      this._inventoryService.items.next(items);
    }

    if (savedGame.records) {
      const records: Record[] = [];
      for (const savedrecords of savedGame.records) {
        const record = new Record(savedrecords);
        record.creationtime = new Date(savedrecords.creationtime);
        records.push(record);
      }
      this._recordService.records.next(records);
    }

    if (savedGame.otherStudios) {
      const otherStudios: Studio[] = [];
      for (const savedotherStudios of savedGame.otherStudios) {
        const otherStudio = new Studio(savedotherStudios);

        const records = [];
        for (let savedRecord of otherStudio.records) {
          savedRecord = new Record(savedRecord);
          savedRecord.creationtime = new Date(savedRecord.creationtime);
          records.push(savedRecord);
        }
        otherStudio.records = records;
        otherStudios.push(otherStudio);
      }
      this._otherStudiosService.studios.next(otherStudios);
    }

    if (savedGame.leaders) {
      const leaders: Leader[] = [];
      for (const savedLeader of savedGame.leaders) {
        const leader = new Leader(savedLeader);

        leaders.push(leader);
      }

      this._leadersService.leaders.next(
        this._leadersService.initLeadersMethods(leaders)
      );
    }

    if (savedGame.playerPhotos) {
      const playerPhotos: PhotoShooting[] = [];
      for (const savedPhoto of savedGame.playerPhotos) {
        const photo = new PhotoShooting(savedPhoto);
        photo.girl = new Girl(photo.girl);

        playerPhotos.push(photo);
      }

      this._shootingService.playerPhotos.next(playerPhotos);
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
}
