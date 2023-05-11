import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Record } from './record.model';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { Position } from '../core/position.model';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  records: BehaviorSubject<Record[]> = new BehaviorSubject<Record[]>([]);
  recordSimulated: Subject<Record> = new Subject<Record>();

  constructor(
    private _girlsService: GirlsService,
    private _gameService: GameService
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
  ): void {
    const positions = this._girlsService.getTimingRecord(girl);
    if (positions) {
      const record = new Record();
      record.girl = girl;
      record.studioName = studioName;
      record.month = this._gameService.month;
      record.year = this._gameService.year;
      record.name = girl.name + ' - #' + (recordCount + 1);

      const positionsPlayed: Position[] = [];
      let trendingPositions = 0;
      let orgasmCount = 0;
      let repetitions = 0;

      let trendingPosition = '';
      let orgasmLevel = 0;
      for (let index = 0; index < girl.corruption; index++) {
        let positionsPool = girl.unlockedPostions;
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

        positionsPlayed.push(pickedPosition);
        if (pickedPosition.name === trendingPosition) {
          trendingPositions++;
        }

        const positionPlayedTimes = positionsPlayed.filter(
          (positionPlayed) => pickedPosition.name === positionPlayed.name
        );
        if (positionPlayedTimes.length > 1) {
          repetitions++;
        }

        orgasmLevel += pickedPosition.orgasm;
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
        repetitions,
        studioQuality
      );
      record.studioscore = this.getScoreStudio(studioQuality);
      record.money = this.getMoney(girl, positionsPlayed, orgasmCount);
      record.fans = this.getFans(girl, positionsPlayed, orgasmCount);

      this.recordSimulated.next(record);
    }
  }

  getScore(
    girl: Girl,
    positionsPlayed: Position[],
    trendingPositions: number,
    orgasmCount: number,
    repetitions: number,
    studioQuality: number
  ): number {
    let score = 0;

    // score
    score =
      this.getScorePositions(positionsPlayed) +
      this.getScoreGirl(girl) +
      this.getScoreStudio(studioQuality) +
      this.getScoreExtra(trendingPositions, orgasmCount, repetitions);

    return Math.round(score);
  }

  getScoreExtra(trending: number, orgasm: number, repetitions: number): number {
    return (
      Math.max(trending * 200, 1) * Math.max(orgasm, 1) + ( 1000 - (Math.abs(Math.max(repetitions, 1)) * 200))
    );
  }

  getScoreStudio(studioQuality: number): number {
    return 1000 * studioQuality;
  }

  getScoreGirl(girl: Girl): number {
    return Math.max(girl.popularity, 1) * Math.max(girl.level, 1);
  }

  getMoney(
    girl: Girl,
    positionsPlayed: Position[],
    orgasmCount: number,
    multiplier = 1
  ): number {
    let goldsWon = 0;

    for (const position of positionsPlayed) {
      goldsWon += position.gold;
    }

    goldsWon = goldsWon * multiplier + 15 * girl.popularity;

    // rewards from orgasms
    goldsWon = goldsWon * (1 + 0.1 * orgasmCount);

    return goldsWon;
  }

  getFans(
    girl: Girl,
    positionsPlayed: Position[],
    orgasmCount: number,
    multiplier = 1
  ): number {
    let fansWon = 0;

    for (const position of positionsPlayed) {
      fansWon += position.fans;
    }

    fansWon = fansWon * multiplier + 20 * girl.popularity;

    // rewards from orgasms
    fansWon = fansWon * (1 + 0.1 * orgasmCount);

    return fansWon;
  }

  getScorePositions(positionsPlayed: Position[]): number {
    let score = 0;

    for (const position of positionsPlayed) {
      score += position.fans;
    }

    return score * positionsPlayed.length;
  }
}
