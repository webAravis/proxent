import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Leader } from './leader.model';
import { OtherStudiosService } from '../core/other-studios.service';
import { League } from './league.model';
import { GameService } from '../core/game.service';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';

declare var modsConfig: any;

export interface SavedLeader {
  name: string,
  mod: string,
  level: number
}

@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  leaders: BehaviorSubject<Leader[]> = new BehaviorSubject<Leader[]>([]);
  leaderBattle: BehaviorSubject<Leader | League | undefined> = new BehaviorSubject<Leader | League | undefined>(undefined);

  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _leadersConfig: any[] = [];

  constructor(
    private _otherStudioService: OtherStudiosService,
    private _gameService: GameService,
    private _girlService: GirlsService
  ) {
    this._initMods();
    this._gameService.monthChanged.subscribe(() => this._randomizeBonusMalusFetish());
  }

  getMetaScore(toBattle: Leader | League) : number {
    return toBattle instanceof Leader ? Math.round( toBattle.pointsCurve(toBattle.lvl) ) : toBattle.beatingConditions.find(condition => condition.type === 'points')?.quantity ?? 0;
  }

  getMetaCum(toBattle: Leader | League) : number {
    return toBattle instanceof Leader ? Math.round( toBattle.cumCurve(toBattle.lvl) ) : toBattle.beatingConditions.find(condition => condition.type === 'cum')?.quantity ?? 0;
  }

  nextLevel(toLevel: Leader) : void {
    toLevel.lvl++;

    // increasing other studios quality
    const otherStudios = this._otherStudioService.studios.getValue();
    for (const studio of otherStudios) {
      studio.quality = studio.quality * 1.2;
    }
    this._otherStudioService.studios.next(otherStudios);
  }

  loadLeaders(leaders: SavedLeader[]): void {
    for (const savedLeader of leaders) {
      const leader = this.leaders.getValue().find((loadedLeader: Leader) => loadedLeader.mod === savedLeader.mod && loadedLeader.name === savedLeader.name);
      if (leader !== undefined && savedLeader.level !== undefined) {
        leader.lvl = savedLeader.level;
      }
    }

    this._randomizeBonusMalusFetish();
  }

  private _randomizeBonusMalusFetish(): void {
    for (const leader of this.leaders.getValue()) {
      const gameGirls = this._girlService.gameGirls.getValue();
      const girlsInBonus: Girl[] = [];
      const girlsInMalus: Girl[] = [];
      const girlsInFetish: Girl[] = [];

      leader.bonus.length = 0;
      leader.malus.length = 0;
      leader.fetish.length = 0;

      for (let index = 0; index < leader.nbBonus; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInBonus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId));
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInBonus.push(pickedGirl);

          const availableAttributes = pickedGirl.attributes.filter(attribute => !leader.bonus.includes(attribute));
          leader.bonus.push(availableAttributes[Math.floor(Math.random() * availableAttributes.length)]);
        }
      }

      for (let index = 0; index < leader.nbMalus; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInBonus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId) && !girlsInMalus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId));
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInMalus.push(pickedGirl);

          const availableAttributes = pickedGirl.attributes.filter(attribute => !leader.malus.includes(attribute) && !leader.bonus.includes(attribute));
          leader.malus.push(availableAttributes[Math.floor(Math.random() * availableAttributes.length)]);
        }
      }

      for (let index = 0; index < leader.nbFetish; index++) {
        const availableGirls = gameGirls.filter(girl => !girlsInMalus.map(bonusGirl => bonusGirl.fullId).includes(girl.fullId));
        if (availableGirls.length > 0) {
          const pickedGirl = availableGirls[Math.floor(Math.random() * availableGirls.length)];
          girlsInFetish.push(pickedGirl);

          const girlPositions = pickedGirl.positions.map(position => position.name).filter(scene => scene.toLowerCase() !== 'intro' && isNaN(parseInt(scene.charAt(scene.length - 1))) && !leader.fetish.includes(scene));
          leader.fetish.push(girlPositions[Math.floor(Math.random() * girlPositions.length)]);
        }
      }
    }

    this.leaders.next(this.leaders.getValue());
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
      if (mod.leaders) {
        for (const leader of mod.leaders) {
          leader.mod = mod.name;
        }
        this._leadersConfig = [...this._leadersConfig, ...mod.leaders];
      }
    }

    this._initLeaders();
  }

  private _initLeaders() : void {
    const leadersArray: Leader[] = [];
    for (const leader of this._leadersConfig) {
      leadersArray.push(new Leader(leader));
    }

		this.leaders.next(leadersArray);

    this._randomizeBonusMalusFetish();
    this.loaded.next(true);
  }
}
