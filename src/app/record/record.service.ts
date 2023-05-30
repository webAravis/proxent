import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Record } from './record.model';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { Position, PositionType } from '../core/position.model';
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

    newRecord.girlId = girl.fullId;

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
    const positions = girl.positions;
    if (positions) {
      record.girlId = girl.fullId;
      record.studioName = studioName;
      record.month = this._gameService.month;
      record.year = this._gameService.year;
      record.name = girl.name + ' - #' + (recordCount + 1);

      const positionsPlayed: PlayedPosition[] = [];
      let oPositionsPool: Position[] = [];

      if (allPositions) {
        oPositionsPool = positions;
      } else {
        // converting pool to position objects
        let positionsPool = girl.unlockedPositions;
        for (const positionName of positionsPool) {
          const oPosition: Position | undefined = positions.find(position => position.name === positionName);
          if (oPosition !== undefined) {
            oPositionsPool.push(oPosition);
          }
        }
      }

      let trendingPositions = 0;
      let orgasmCount = 0;

      let trendingPosition = '';
      let orgasmLevel = 0;
      let boner = 0;
      for (let index = 0; index < girl.corruption; index++) {

        // picking trending
        const availablePositions = oPositionsPool.filter(
          (position) => position.name !== trendingPosition
        );
        trendingPosition = availablePositions.map(position => position.name)[Math.floor(Math.random() * availablePositions.length)];

        // pick a random position
        const pickedPosition: Position = oPositionsPool[Math.floor(Math.random() * oPositionsPool.length)];

        const positionPlayedTimes = positionsPlayed.filter(
          (positionPlayed) => pickedPosition.name === positionPlayed.position.name
        ).length;
        let repeatedMultiplier = 1;
        for (let index = 1; index < positionPlayedTimes; index++) {
          repeatedMultiplier = repeatedMultiplier / 1.2;
        }

        if (pickedPosition.name === trendingPosition) {
          trendingPositions++;
        }

        const positionStats = this.positionStats(
          girl,
          pickedPosition,
          repeatedMultiplier,
          boner,
          trendingPosition,
          []
        );

        positionsPlayed.push({
          position: pickedPosition,
          golds: positionStats.golds,
          fans: positionStats.fans,
          xp: positionStats.xp
        });

        orgasmLevel += positionStats.orgasm;
        if (orgasmLevel >= 100) {
          orgasmCount++;
          orgasmLevel = 0;
          boner -= 50;
        }

        boner += positionStats.boner;
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

  positionStats(girl: Girl, position: Position, repeatedMultiplier: number, boner: number, trendingPosition: string, skillStatsModifiers: { stat: string, position: string, label: string, value: string }[]): {golds: number, xp: number, fans: number, boner: number, orgasm: number} {
		return {
      golds: Math.round(
        (
          position.getGold(this._trendingMultiplier(position, trendingPosition), girl.level, girl.popularity)
        + (position.getGold(this._trendingMultiplier(position, trendingPosition), girl.level, girl.popularity) * this._skillModifier('golds', position, skillStatsModifiers))
        * repeatedMultiplier
        )
        * girl.goldsModifier
        * this._settingsService.getSetting('record_position_golds')
      ),
      xp: Math.round(
        (
          position.getXp(this._trendingMultiplier(position, trendingPosition), girl.level)
        + (position.getXp(this._trendingMultiplier(position, trendingPosition), girl.level) * this._skillModifier('xp', position, skillStatsModifiers))
        * repeatedMultiplier
        )
        * girl.xpModifier
        * this._settingsService.getSetting('record_position_xp')
      ),
      fans: Math.round(
        (
          position.getFans(this._trendingMultiplier(position, trendingPosition), girl.level)
        + (position.getFans(this._trendingMultiplier(position, trendingPosition), girl.level) * this._skillModifier('fans', position, skillStatsModifiers))
        * repeatedMultiplier
        )
        * girl.fansModifier
        * this._settingsService.getSetting('record_position_fans')
      ),
      boner: Math.round(
        position.boner
        + this._skillModifier('boner', position, skillStatsModifiers)
        * repeatedMultiplier
      ),
      orgasm: Math.round(
        (
          position.getOrgasm(boner, this._trendingMultiplier(position, trendingPosition))
        + (position.getOrgasm(boner, this._trendingMultiplier(position, trendingPosition))
        * this._skillModifier('orgasm', position, skillStatsModifiers))
        )
        * girl.cumModifier
        * this._settingsService.getSetting('record_position_cum')
      )
    }
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

  private _skillModifier(statName: string, position: Position, skillStatsModifiers: { stat: string, position: string, label: string, value: string }[]): number {
    let positionName = position.name.toLowerCase();
    const sceneRank = parseInt(positionName.charAt(positionName.length-1));

    if (!isNaN(sceneRank)) {
      positionName = positionName.slice(0, -1).toLowerCase();
    }

    let modifiersToApply = skillStatsModifiers.filter(statModifier => statModifier.stat === statName && statModifier.position === positionName);
    modifiersToApply = [...modifiersToApply, ...skillStatsModifiers.filter(statModifier => statModifier.position === 'all_foreplay' && (position.type === PositionType.FOREPLAY || position.type === PositionType.FOREPLAY_SKILL))];
    modifiersToApply = [...modifiersToApply, ...skillStatsModifiers.filter(statModifier => statModifier.position === 'all_penetration' && (position.type === PositionType.PENETRATION || position.type === PositionType.SKILL || position.type === PositionType.SPECIAL))];
    modifiersToApply = [...modifiersToApply, ...skillStatsModifiers.filter(statModifier => statModifier.position === 'all_special' && (position.type === PositionType.SPECIAL))];

    let modifier = statName === 'boner' ? 0 : 100;
    for (const modifierStat of modifiersToApply) {
      let modifierValue = parseInt(modifierStat.value.replaceAll('%', '').replaceAll('+', '').replaceAll('-', ''));
      if (!isNaN(modifierValue)) {
        modifier = modifier + (modifierValue * (modifierStat.value.charAt(0) === '+' ? 1 : -1));
      }
    }

    return statName === 'boner' ? modifier : modifier / 100;
  }

  private _trendingMultiplier(position: Position, trendingPosition: string): number {
    let multiplier = 0;
    let positionName = position.name;
    const comboPositionNumber = parseInt(positionName.charAt(positionName.length - 1));
    if (!isNaN(comboPositionNumber)) {
      positionName = positionName.substring(0, positionName.length -1 );
      multiplier += comboPositionNumber;
    }

    multiplier += trendingPosition === positionName ? 4 : 1;

    return multiplier;
  }
}
