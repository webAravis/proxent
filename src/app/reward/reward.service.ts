import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Girl } from '../core/girls/girl.model';
import { GameService } from '../core/game.service';
import { Reward } from '../core/reward.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { StudioService } from '../studio/studio.service';
import { Item } from '../inventory/item.model';
import { InventoryService } from '../inventory/inventory.service';
import { MastersService } from '../leaders/masters.service';

@Injectable({
  providedIn: 'root',
})
export class RewardService {
  show: Subject<Reward> = new Subject<Reward>();
  corruptionCaps = [
    150, 2500, 8000, 16_000, 32_000, 64_000, 128_000, 256_000, 512_000,
    1_024_000, 2_048_000, 4_096_000, 8_192_000, 16_384_000, 32_768_000,
    65_536_000,
  ];

  constructor(
    private _gameService: GameService,
    private _dialogsService: DialogsService,
    private _studioService: StudioService,
    private _inventoryService: InventoryService,
    private _masterService: MastersService
  ) { }

  rewardText(text: string): void {
    this.show.next(new Reward(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, text));
  }

  giveReward(
    fansWon: number,
    xpWon: number,
    moneyWon: number,
    itemsWon: Item[],
    corruptionWon: number,
    girl: Girl
  ): Girl {
    fansWon = Math.round(fansWon * (1 - girl.freedom));
    xpWon = Math.round(xpWon * (1 - girl.freedom));
    moneyWon = Math.round(moneyWon * (1 - girl.freedom));

    girl.corruption += corruptionWon;
    girl.fans += fansWon;

    const levelupResult = this._levelupGirl(girl, xpWon);
    girl = levelupResult.girl;

    if (
      this._dialogsService.dialogsStarted[3] === false &&
      girl.fans >= 10_000
    ) {
      this._dialogsService.startDialog(3);
      this._studioService.studioUnlocked.next(true);
    }

    if (
      this._dialogsService.dialogsStarted[6] === false &&
      girl.fans >= 40_000 &&
      girl.name === 'Peta'
    ) {
      this._dialogsService.startDialog(6);
    }

    this._gameService.updateGolds(moneyWon);
    for (const item of itemsWon) {
      this._inventoryService.addItem(item);
    }

    this._showReward(
      fansWon,
      xpWon,
      moneyWon,
      itemsWon,
      corruptionWon,
      levelupResult.hasLevelup,
      levelupResult.gainedSkillPoint,
      levelupResult.hardCapCorruption,
      levelupResult.hardCapLeague,
      girl
    );

    return girl;
  }

  private _levelupGirl(
    girl: Girl,
    xpWon: number
  ): { girl: Girl, hasLevelup: boolean, gainedSkillPoint: number, hardCapCorruption: boolean, hardCapLeague: boolean } {
    let hasLevelup = false;
    let gainedSkillPoint = 0;
    let hardCapCorruption = false;
    let hardCapLeague = false;

    // hard caps from corruption level
    const maxXpCap = this.corruptionCaps[girl.corruption - 1];
    const maxLeagueXpCap = girl.getNextLevelXp(this._masterService.getLevelCap());

    const oldLevel = girl.level;
    const oldSkillPoints = girl.skillPoints;

    if ((maxXpCap === undefined || girl.xp + xpWon <= maxXpCap) && girl.xp + xpWon <= maxLeagueXpCap) {
      girl.xp += xpWon;
    } else if (maxXpCap && girl.xp + xpWon > maxXpCap) {
      hardCapCorruption = true;
      if (girl.xp + xpWon > maxLeagueXpCap) {
        girl.xp = maxLeagueXpCap-1;
      }

      if (
        this._dialogsService.dialogsStarted[1] === false &&
        girl.level >= 1 &&
        girl.fullId === this._gameService.girlfriend
      ) {
        this._dialogsService.startDialog(1);
      } else if (
        this._dialogsService.dialogsStarted[2] === false &&
        girl.level >= 2 &&
        girl.fullId === this._gameService.girlfriend
      ) {
        this._dialogsService.startDialog(2);
      } else if (
        this._dialogsService.dialogsStarted[5] === false &&
        girl.level >= 2 &&
        girl.fullId !== this._gameService.girlfriend
      ) {
        this._dialogsService.startDialog(5);
      }
    } else if (maxLeagueXpCap && girl.xp + xpWon > maxLeagueXpCap) {
      hardCapLeague = true;
      girl.xp = maxLeagueXpCap-1;
    }

    if (girl.level !== oldLevel) {
      hasLevelup = true;
    }

    if (girl.skillPoints !== oldSkillPoints) {
      gainedSkillPoint = (girl.skillPoints - oldSkillPoints);
    }

    return {
      girl: girl,
      hasLevelup: hasLevelup,
      gainedSkillPoint: gainedSkillPoint,
      hardCapCorruption: hardCapCorruption,
      hardCapLeague: hardCapLeague
    };
  }

  private _showReward(
    fansWon: number,
    xpWon: number,
    moneyWon: number,
    itemsWon: Item[],
    corruptionWon: number,
    hasLevelup: boolean,
    gainedSkillPoint: number,
    hardCapCorruption: boolean,
    hardCapLeague: boolean,
    girl: Girl
  ): void {
    const reward = new Reward(
      fansWon,
      xpWon,
      moneyWon,
      itemsWon,
      corruptionWon,
      hasLevelup,
      gainedSkillPoint,
      hardCapCorruption,
      hardCapLeague,
      girl
    );
    this.show.next(reward);
  }
}
