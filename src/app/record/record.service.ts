import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Record } from './record.model';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { Position } from '../core/position.model';
import { Leader } from '../leaders/leader.model';
import { SettingsService } from '../core/settings.service';

export interface PlayedPosition {
  position: Position,
  fans: number,
  golds: number,
  xp: number
}

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  records: BehaviorSubject<Record[]> = new BehaviorSubject<Record[]>([]);
  recordSimulated: Subject<Record> = new Subject<Record>();

  constructor(
    private _girlsService: GirlsService,
    private _gameService: GameService,
    private _settingsService: SettingsService
  ) {}

  addRecord(
    girl: Girl,
    score: number,
    studioScore: number,
    money: number,
    fans: number,
    studioName: string
  ): Record {
    const newRecord = new Record();

    newRecord.girl = girl;

    newRecord.name = girl.name + ' - #' + (girl.recordCount + 1);
    newRecord.studioName = studioName;
    newRecord.month = this._gameService.month;
    newRecord.year = this._gameService.year;

    newRecord.score = score;
    newRecord.studioscore = studioScore;
    newRecord.money = money;
    newRecord.fans = fans;

    const all = this.records.getValue();
    all.push(newRecord);

    this.records.next(all);

    girl.recordCount++;
    this._girlsService.updateGirl(girl);

    return newRecord;
  }

  simulateRecord(
    girl: Girl,
    studioName: string,
    allPositions: boolean,
    studioQuality: number,
    recordCount: number
  ): Record {
    const record = new Record();
    const positions = this._girlsService.getTimingRecord(girl);
    if (positions) {
      record.girl = girl;
      record.studioName = studioName;
      record.month = this._gameService.month;
      record.year = this._gameService.year;
      record.name = girl.name + ' - #' + (recordCount + 1);

      const positionsPlayed: PlayedPosition[] = [];
      let trendingPositions = 0;
      let orgasmCount = 0;

      let trendingPosition = '';
      let orgasmLevel = 0;
      for (let index = 0; index < girl.corruption; index++) {
        let positionsPool = girl.unlockedPositions;
        if (allPositions) {
          positionsPool = positions.map((oPosition) => oPosition.name);
        }

        const availablePositions = positionsPool.filter(
          (position) => position !== trendingPosition
        );
        trendingPosition =
          availablePositions[
          Math.floor(Math.random() * availablePositions.length)
          ];

        // pick a random position
        const pickedPositionName: string =
          positionsPool[Math.floor(Math.random() * positionsPool.length)];
        const pickedPosition = positions.find(
          (position) => position.name === pickedPositionName
        );
        if (pickedPosition === undefined) {
          continue;
        }

        const positionPlayedTimes = positionsPlayed.filter(
          (positionPlayed) => pickedPosition.name === positionPlayed.position.name
        ).length;
        let repeatedMultiplier = 1;
        for (let index = 1; index < positionPlayedTimes; index++) {
          repeatedMultiplier = repeatedMultiplier / 1.2;
        }

        let trendingMultiplier = 1;
        if (pickedPosition.name === trendingPosition) {
          trendingPositions++;
          trendingMultiplier = 4;
        }

        positionsPlayed.push({
          position: pickedPosition,
          golds: Math.round(pickedPosition.getGold(trendingMultiplier) * repeatedMultiplier),
          fans: Math.round(pickedPosition.getFans(trendingMultiplier) * repeatedMultiplier),
          xp: Math.round(pickedPosition.getXp(trendingMultiplier) * repeatedMultiplier)
        });

        orgasmLevel += pickedPosition.getOrgasm(Math.floor(Math.random() * (100 - 0 + 1)) + 0, 1);
        if (orgasmLevel >= 100) {
          orgasmCount++;
          orgasmLevel = 0;
        }
      }

      record.score = this.getScore(
        girl,
        positionsPlayed,
        trendingPositions,
        orgasmCount,
        studioQuality,
        new Leader(),
        false
      );
      record.studioscore = this.getScoreStudio(studioQuality, (studioName === 'player'));
      record.money = this.getMoney(positionsPlayed);
      record.fans = this.getFans(positionsPlayed);
      record.xp = this.getXp(positionsPlayed);
      record.orgasmCount = orgasmCount;

      this.recordSimulated.next(record);
    }

    return record;
  }

  getMoney(positionsPlayed: PlayedPosition[]): number {
    return positionsPlayed.length > 0 ? positionsPlayed.map((position: PlayedPosition) => position.golds).reduce((sum, current) => sum + current) : 0;
  }

  getFans(positionsPlayed: PlayedPosition[]): number {
    return positionsPlayed.length > 0 ? positionsPlayed.map((position: PlayedPosition) => position.fans).reduce((sum, current) => sum + current) : 0;
  }

  getXp(positionsPlayed: PlayedPosition[]): number {
    return positionsPlayed.length > 0 ? positionsPlayed.map((position: PlayedPosition) => position.xp).reduce((sum, current) => sum + current) : 0;
  }

  getScore(
    girl: Girl,
    positionsPlayed: PlayedPosition[],
    trendingPositions: number,
    orgasmCount: number,
    studioQuality: number,
    leader: Leader,
    isPlayer: boolean = true
  ): number {
    let score = 0;

    // score
    score =
      this.getScorePositions(positionsPlayed, isPlayer) +
      this.getScoreGirl(girl, isPlayer) +
      this.getScoreStudio(studioQuality, isPlayer) +
      this.getScoreExtra(trendingPositions, orgasmCount, isPlayer);

    if (isPlayer) {
      score = score * (1 - girl.freedom);
    }

    if (leader.name !== '') {
      score = score * 0.05;

      // modifiers due to leader
      for (const bonus of leader.bonus) {
        if (girl.attributes.map(attribute => attribute.toLowerCase()).includes(bonus.toLowerCase())) {
          score = score * 1.5;
        }
      }
      for (const malus of leader.malus) {
        if (girl.attributes.map(attribute => attribute.toLowerCase()).includes(malus.toLowerCase())) {
          score = score * 0.01;
        }
      }
    }

    return Math.round(score);
  }

  getScoreExtra(trending: number, orgasm: number, isPlayer: boolean): number {
    return Math.round((
      Math.max(trending * 400, 1) * Math.max(orgasm, 1)
    ) * (isPlayer ? this._settingsService.getSetting('record_points') : 1));
  }

  getScoreStudio(studioQuality: number, isPlayer: boolean): number {
    return Math.round((1000 * studioQuality) * (isPlayer ? this._settingsService.getSetting('record_points') : 1));
  }

  getScoreGirl(girl: Girl, isPlayer: boolean): number {
    return Math.round((Math.max(girl.popularity, 1) * Math.max(girl.level, 1)) * (isPlayer ? this._settingsService.getSetting('record_points') : 1));
  }

  getScorePositions(positionsPlayed: PlayedPosition[], isPlayer: boolean): number {
    let score = 0;

    for (const position of positionsPlayed) {
      score += position.fans;
    }

    return Math.round((score * positionsPlayed.length) * (isPlayer ? this._settingsService.getSetting('record_points') : 1));
  }
}
