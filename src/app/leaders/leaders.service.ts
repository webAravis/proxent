import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Leader } from './leader.model';
import { OtherStudiosService } from '../core/other-studios.service';

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
  leaderBattle: BehaviorSubject<Leader> = new BehaviorSubject<Leader>(new Leader());

  private _leadersConfig: any[] = [];

  constructor(
    private _otherStudioService: OtherStudiosService
  ) {
    this._initMods();
  }

  getMetaScore(leader: Leader) : number {
    return Math.round( leader.pointsCurve(leader.lvl) );
  }

  getMetaCum(leader: Leader) : number {
    return Math.round( leader.cumCurve(leader.lvl) );
  }

  nextLevel(toLevel: Leader) : void {
    toLevel.lvl++;

    // increasing other studios quality
    const otherStudios = this._otherStudioService.studios.getValue();
    for (const studio of otherStudios) {
      studio.quality = studio.quality * 1.1;
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
  }

  private _initMods(): void {
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
  }
}
