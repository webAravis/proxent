import { BehaviorSubject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contract } from './contract.model';
import { GirlsService } from '../core/girls/girls.service';
import { GameService } from '../core/game.service';
import { SettingsService } from '../core/settings.service';
import { InventoryService } from '../inventory/inventory.service';
import { Item } from '../inventory/item.model';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  contracts: BehaviorSubject<Contract[]> = new BehaviorSubject<Contract[]>([]);
  contractNotifications: BehaviorSubject<{contract: Contract, completed: boolean, expired: boolean}[]> = new BehaviorSubject<{contract: Contract, completed: boolean, expired: boolean}[]>([]);

  constructor(
    private _girlService: GirlsService,
    private _gameService: GameService,
    private _settingService: SettingsService,
    private _inventoryService: InventoryService
  ) {
    this._initContractGeneration();
  }

  removeNotification(toRemove: {contract: Contract, completed: boolean, expired: boolean}): void {
    let notifications = this.contractNotifications.getValue().filter(notification => notification.contract.id !== toRemove.contract.id);
    this.contractNotifications.next(notifications);
  }

  pick(contract: Contract): void {
    const pickedContract = this.contracts.getValue().find(availableContract => availableContract.id === contract.id);
    if (pickedContract) {
      pickedContract.picked = true;
    }

    this.contracts.next(this.contracts.getValue());
  }

  contractExpired(expired: Contract): void {
    if (expired.picked) {
      let notifs = this.contractNotifications.getValue();
      notifs.push({contract: expired, completed: false, expired: true});
      this.contractNotifications.next(notifs);

      for (const reward of expired.rewards) {
        if (reward.type.toLowerCase() === 'gold') {
          this._gameService.updateGolds((reward.quantity) * -1);
        } else {
          this._inventoryService.removeItemByName(reward.type, (reward.quantity * -1));
        }
      }
    }

    let contracts = this.contracts.getValue().filter(contract => contract.id !== expired.id);
    this.contracts.next(contracts);
  }

  completeContract(completed: Contract): void {
    let notifs = this.contractNotifications.getValue();
    notifs.push({contract: completed, completed: true, expired: false});
    this.contractNotifications.next(notifs);

    for (const reward of completed.rewards) {
      if (reward.type.toLowerCase() === 'gold') {
        this._gameService.updateGolds(reward.quantity);
      } else {
        for (let index = 0; index < reward.quantity; index++) {
          this._inventoryService.addItem(new Item({name: reward.type}));
        }
      }
    }

    let contracts = this.contracts.getValue().filter(contract => contract.id !== completed.id);
    this.contracts.next(contracts);
  }

  private _initContractGeneration(): void {
    this._gameService.dayChanged.subscribe((day: number) => {
      this._checkExpired();

      if (day % 2 === 0 || Math.random() < 0.3) {
        return;
      }

      let contract = new Contract();
      let contracts = this.contracts.getValue();
      const ids = contracts.map(contract => parseInt(contract.id));
      if (ids.length === 0) {
        contract.id = '1';
      } else {
        const max = Math.max(...ids);
        contract.id = (max+1).toString();
      }

      const activities = ['shooting', 'recording'];
      contract.activity = activities[Math.floor(Math.random() * activities.length)];

      const difficulties = [1,2,3,4,5]
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

      const attributes = this._girlService.getAllGirlsAttributes(difficulty);
      if (attributes.length === 0) {
        return;
      }
      contract.girlAttributes = attributes[Math.floor(Math.random() * attributes.length)];

      const goldQuantity = (300000*0.1 * difficulty*Math.random()) * (contract.activity === 'recording' ? 1.5 : 0.8) * this._settingService.getSetting('contract_golds');
      contract.rewards.push({type: 'gold', quantity: goldQuantity});
      if (goldQuantity < 1000) {
        return;
      }

      if (difficulty >= 3 && contract.activity === 'recording') {
        const requirements = ['girl level', 'girl fans', 'record rank', 'orgasms'];
        const pickedRequirement = requirements[Math.floor(Math.random() * requirements.length)];

        let requires = {requirement: pickedRequirement, value: ''};
        switch (pickedRequirement) {
          case 'girl level':
            requires.value = Math.round(Math.random() * (this._girlService.getMaxGirlLevel() + (10 * difficulty))).toString();
            break;
          case 'girl fans':
            requires.value = Math.round(Math.random() * (this._girlService.getMaxGirlFans() + (50000 * difficulty))).toString();
            break;
          case 'record rank':
            const ranks = ['B', 'A', 'S']
            requires.value = ranks[Math.floor(Math.random() * ranks.length)];
            break;
          case 'orgasms':
            requires.value = Math.round(Math.random() * 50).toString();
            break;
        }
        contract.requires = requires;
      }

      if (difficulty >= 3 && contract.activity === 'shooting') {
        const attributeTypes = ['place', 'outfit', 'body'];
        const pickedType = attributeTypes[Math.floor(Math.random() * attributeTypes.length)];
        const attributes = this._girlService.getAllPhotoAttributes(pickedType);
        const pickedAttribute = attributes[Math.floor(Math.random() * attributes.length)];
        contract.requires = {requirement: pickedType, value: pickedAttribute};
      }

      if (difficulty >= 3) {
        const itemsToWin = ['advanced_skill_gem', 'basic_skill_gem', 'fans_badge', 'money_badge', 'recordmonthly_badge', 'recordyearly_badge', 'studiomonthly_badge', 'studioyearly_badge'];
        const itemName = itemsToWin[Math.floor(Math.random() * itemsToWin.length)];
        contract.rewards.push({type: itemName, quantity: Math.round(1 + (difficulty/2) * this._settingService.getSetting('contract_items'))});
      }

      const expirationToAdd = Math.round(2 + Math.random()*4);
      let month = this._gameService.month;
      let year = this._gameService.year;
      for (let index = 0; index < expirationToAdd; index++) {
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
      contract.expirationDate = {month: month, year: year};

      contracts.push(contract);
      this.contracts.next(contracts);
    });
  }

  private _checkExpired(): void {
    const contracts = this.contracts.getValue();
    const currentDate = new Date(this._gameService.year, this._gameService.month);

    for (const contract of contracts) {
      const expirationDate = new Date(contract.expirationDate.year, contract.expirationDate.month);
      if (expirationDate < currentDate) {
        this.contractExpired(contract);
      }
    }
  }
}
