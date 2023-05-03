import { of, Observable, Subject } from 'rxjs';
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

@Injectable({
	providedIn: 'root',
})
export class SaveService {

  saveIndex = 0;

  showSaveChooser: Subject<boolean> = new Subject();
  saves: any[] = [];

	constructor(
		private _gameService: GameService,
		private _girlsService: GirlsService,
		private _dialogsService: DialogsService,
		private _studioService: StudioService,
		private _inventoryService: InventoryService,
		private _recordService: RecordService,
		private _otherStudiosService: OtherStudiosService
	) {
		setInterval(() => this.saveGame(), 5000);
		this._gameService.dayChanged.subscribe((day) =>
			day > 1 ? this.saveGame() : undefined
		);
		this._gameService.goldChanged.subscribe((golds) =>
      golds > 0 ? this.saveGame() : undefined
		);

    const allSaves = localStorage.getItem('saveGame') ?? btoa('[]');
    const savesObject = JSON.parse(atob(allSaves));
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

    const savedGame = JSON.parse(atob(save));
    if (!(typeof savedGame === 'object') || !Object.keys(savedGame).includes('game')) {
      return false;
    }

    this.saves.push(savedGame);
    this.saveIndex = this.saves.length-1;

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
		};

		const dialogsStarted = this._dialogsService.dialogsStarted;

		const girls = this._girlsService.allGirls.getValue();
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

		const toSave = {
			game: gameParameters,
			girls: girls,
			dialogsStarted: dialogsStarted,
			studio: studio,
			inventory: inventory,
			records: records,
			otherStudios: otherStudios,
      lastSaved: new Date(),
      version: '0.8.0'
		};

		let savedGames = this.saves;

    // sanitizing all non-number keys
    // const keysToDelete = Object.keys(savedGames).filter(key => isNaN(parseInt(key)));
    // for (const keyToDelete of keysToDelete) {
    //   delete savedGames[keyToDelete];
    // }

    // if (!Array.isArray(savedGames)) {
    //   console.log('converting to array');
    //   savedGames = Object.values(savedGames);
    // }

    savedGames[this.saveIndex] = toSave;

		const saved = btoa(JSON.stringify(savedGames));
		localStorage.setItem('saveGame', saved);

    this.saves = savedGames;
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

		this._girlsService.allGirls.next(girlsToLoad);

		savedGame.studio.studioUnlocked === undefined
			? undefined
			: this._studioService.studioUnlocked.next(
					savedGame.studio.studioUnlocked
			  );
		savedGame.studio.opened === undefined
			? undefined
			: this._studioService.opened.next(savedGame.studio.opened);

		const modifiers: StudioModifier[] = [];
		for (const savedModifier of savedGame.studio.modifiers) {
			const modifier = new StudioModifier(savedModifier);
			modifiers.push(modifier);
		}
		this._studioService.modifiers.next(
			this._studioService.initModifiersMethods(modifiers)
		);

		const items: Item[] = [];
		for (const savedItem of savedGame.inventory.items) {
			const item = new Item(savedItem);
			items.push(item);
		}
		this._inventoryService.items.next(items);

		const records: Record[] = [];
		for (const savedrecords of savedGame.records) {
			const record = new Record(savedrecords);
			record.creationtime = new Date(savedrecords.creationtime);
			records.push(record);
		}
		this._recordService.records.next(records);

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
