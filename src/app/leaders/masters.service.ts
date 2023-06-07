import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { League } from './league.model';
import { GameService } from '../core/game.service';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';

declare var modsConfig: any;

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  leagues: BehaviorSubject<League[]> = new BehaviorSubject<League[]>([]);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  downgrade: Subject<boolean> = new Subject();

  private _leaguesConfig: any[] = [];

  constructor(
    private _gameService: GameService,
    private _girlService: GirlsService
  ) {
    this._initMods();
    this._gameService.monthChanged.subscribe(() => {
      this.chargeMaintenance();
      this._randomizeBonusMalusFetish();
    });
  }

  getContractsLevels(): number[] {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league && league.contractsLevels.length > 0) {
      return league.contractsLevels;
    }

    return [1,2,3,4,5];
  }

  getFansMultiplier(): number {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league && league.contractsLevels.length > 0) {
      return league.contractsLevels[Math.floor(Math.random() * league.contractsLevels.length)];
    }

    return 1;
  }

  beatLeague(): void {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league !== undefined) {
      if (league.unlocker) {
        league.isCurrentLeague = false;
        const unlocker = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.fullId === league.unlocker);
        if (unlocker !== undefined) {
          unlocker.isCurrentLeague = true;
        }
      }
    }

    this.leagues.next(this.leagues.getValue());
  }

  downgradeLeague(): void {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league !== undefined) {
      const previousLeague = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.unlocker === league.fullId);
      if (previousLeague) {
        league.isCurrentLeague = false;
        previousLeague.isCurrentLeague = true;

        this._girlService.downgradeLevels(previousLeague.levelCap);
      }
    }
  }

  downgradeLevels(): void {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league) {
      this._girlService.downgradeLevels(league.levelCap);
    }
  }

  getMaintenance(): number {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league !== undefined) {
      return league.maintenanceCost;
    }

    return 10;
  }

  chargeMaintenance(): void {
    const toCharge = this.getMaintenance();
    const currentGolds = this._gameService.golds;

    if (currentGolds - toCharge > 0) {
      this._gameService.updateGolds(toCharge * -1);
    } else {
      this.downgrade.next(true);
      this.downgradeLeague();
    }
  }

  getLevelCap(): number {
    const league = this.leagues.getValue().find((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    if (league !== undefined) {
      return league.levelCap;
    }

    return 10;
  }

  loadLeague(id: string, modName: string): void {
    const leagues = this.leagues.getValue();
    const defaultLeagues = leagues.filter((loadedLeague: League) => loadedLeague.isCurrentLeague === true);
    for (const league of defaultLeagues) {
      league.isCurrentLeague = false;
    }

    const league = leagues.find((loadedLeague: League) => loadedLeague.fullId === modName + '-' + id);
    if (league !== undefined) {
      league.isCurrentLeague = true;
    }

    this.leagues.next(leagues);
  }

  private _randomizeBonusMalusFetish(): void {
    for (const league of this.leagues.getValue()) {
      const gameGirls = this._girlService.gameGirls.getValue();
      const girlsInBonus: Girl[] = [];
      const girlsInMalus: Girl[] = [];
      const girlsInFetish: Girl[] = [];

      league.bonus.length = 0;
      league.malus.length = 0;
      league.fetish.length = 0;

      for (let index = 0; index < league.nbBonus; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInBonus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId));
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInBonus.push(pickedGirl);

          const availableAttributes = pickedGirl.attributes.filter(attribute => !league.bonus.includes(attribute));
          league.bonus.push(availableAttributes[Math.floor(Math.random() * availableAttributes.length)]);
        }
      }

      for (let index = 0; index < league.nbMalus; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInBonus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId) && !girlsInMalus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId)).slice(1);
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInMalus.push(pickedGirl);

          const availableAttributes = pickedGirl.attributes.filter(attribute => !league.malus.includes(attribute) && !league.bonus.includes(attribute));
          league.malus.push(availableAttributes[Math.floor(Math.random() * availableAttributes.length)]);
        }
      }

      for (let index = 0; index < league.nbFetish; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInMalus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId));
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInFetish.push(pickedGirl);

          const girlPositions = pickedGirl.positions.map(position => position.name).filter(scene => scene.toLowerCase() !== 'intro' && isNaN(parseInt(scene.charAt(scene.length - 1))) && !league.fetish.includes(scene));
          league.fetish.push(girlPositions[Math.floor(Math.random() * girlPositions.length)]);
        }
      }
    }

    this.leagues.next(this.leagues.getValue());
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
      if (mod.leagues) {
        for (const league of mod.leagues) {
          league.mod = mod.name;
        }
        this._leaguesConfig = [...this._leaguesConfig, ...mod.leagues];
      }
    }

    this._initLeagues();
  }

  private _initLeagues() : void {
    const leaguesArray: League[] = [];
    for (const league of this._leaguesConfig) {
      leaguesArray.push(new League(league));
    }

		this.leagues.next(leaguesArray);
    this._randomizeBonusMalusFetish();

    this.loaded.next(true);
  }
}
