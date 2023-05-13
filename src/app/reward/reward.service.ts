import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Girl } from '../core/girls/girl.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { Reward } from '../core/reward.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { StudioService } from '../studio/studio.service';
import { Item } from '../inventory/item.model';
import { InventoryService } from '../inventory/inventory.service';

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
    private _girlService: GirlsService,
    private _gameService: GameService,
    private _dialogsService: DialogsService,
    private _studioService: StudioService,
    private _inventoryService: InventoryService
  ) { }

  rewardText(text: string): void {
    this.show.next(new Reward(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, text));
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

    this._girlService.updateGirl(girl);
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
      levelupResult.hardCapCorruption,
      girl
    );

    return girl;
  }

  private _levelupGirl(
    girl: Girl,
    xpWon: number
  ): { girl: Girl; hasLevelup: boolean; hardCapCorruption: boolean } {
    let hasLevelup = false;
    let hardCapCorruption = false;

    // hard caps from corruption level
    const maxXpCap = this.corruptionCaps[girl.corruption - 1];
    if (maxXpCap === undefined || girl.xp + xpWon <= maxXpCap) {
      const oldLevel = girl.level;
      girl.xp += xpWon;
      if (girl.level !== oldLevel) {
        hasLevelup = true;

        // update when levelup
        girl.lust += 1;
        girl.charm += 1;
        girl.beauty += 1;
        girl.skill += 1;
        girl.fitness += 1;
        girl.hp += 100;
      }
    } else {
      hardCapCorruption = true;

      if (
        this._dialogsService.dialogsStarted[1] === false &&
        girl.level === 1 &&
        girl.name === 'Yiny'
      ) {
        this._dialogsService.startDialog(1);
      }

      if (
        this._dialogsService.dialogsStarted[2] === false &&
        girl.level >= 2 &&
        girl.name === 'Yiny'
      ) {
        this._dialogsService.startDialog(2);
      }

      if (
        this._dialogsService.dialogsStarted[5] === false &&
        girl.level >= 2 &&
        girl.name === 'Peta'
      ) {
        this._dialogsService.startDialog(5);
      }
    }

    return {
      girl: girl,
      hasLevelup: hasLevelup,
      hardCapCorruption: hardCapCorruption,
    };
  }

  private _showReward(
    fansWon: number,
    xpWon: number,
    moneyWon: number,
    itemsWon: Item[],
    corruptionWon: number,
    hasLevelup: boolean,
    hardCapCorruption: boolean,
    girl: Girl
  ): void {
    const reward = new Reward(
      fansWon,
      xpWon,
      moneyWon,
      itemsWon,
      corruptionWon,
      hasLevelup,
      hardCapCorruption,
      girl
    );
    this.show.next(reward);
  }
}
