import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum SettingType {
  cost = 1,
  reward = 2
}

export interface Setting {
  name: string;
  label: string;
  value: number;
  type: SettingType;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: BehaviorSubject<Setting[]> = new BehaviorSubject<Setting[]>([]);

  constructor() {
    this.initSettings();
  }

  initSettings(): void {
    const settings: Setting[] = [
      { name: 'corruption_golds', label: 'Corruption Gold cost', value: 100, type: SettingType.cost },
      { name: 'corruption_cum', label: 'Corruption Cum cost', value: 100, type: SettingType.cost },
      { name: 'corruption_positions', label: 'Corruption Level reward', value: 100, type: SettingType.reward },

      { name: 'shooting_golds_reward', label: 'Shooting Golds reward', value: 100, type: SettingType.reward },
      { name: 'shooting_fans_reward', label: 'Shooting Fans reward', value: 100, type: SettingType.reward },
      { name: 'shooting_xp_reward', label: 'Shooting XP reward', value: 100, type: SettingType.reward },
      { name: 'shooting_golds_cost', label: 'Shooting Golds cost', value: 100, type: SettingType.cost },

      { name: 'girl_unlock_golds', label: 'Girl Golds cost', value: 100, type: SettingType.cost },
      { name: 'girl_unlock_items', label: 'Girl Items cost', value: 100, type: SettingType.cost },
      { name: 'girl_freedom_golds_cost', label: 'Girl Indep Golds cost', value: 100, type: SettingType.cost },
      { name: 'girl_freedom_item_cost', label: 'Girl Indep Items cost', value: 100, type: SettingType.cost },

      { name: 'record_golds_cost', label: 'Record Golds cost', value: 100, type: SettingType.cost },
      { name: 'record_position_golds', label: 'Record Golds reward', value: 100, type: SettingType.reward },
      { name: 'record_position_xp', label: 'Record XP reward', value: 100, type: SettingType.reward },
      { name: 'record_position_fans', label: 'Record Fans reward', value: 100, type: SettingType.reward },
      { name: 'record_position_cum', label: 'Record Cum reward', value: 100, type: SettingType.reward },
      { name: 'record_points', label: 'Record Points reward', value: 100, type: SettingType.reward },
    ];

    this.settings.next(settings);
  }

  getSetting(settingName: string): number {
    return (this.settings.getValue().find(setting => setting.name === settingName)?.value ?? 100) / 100
  }

  updateSettings(settings: Setting[]): void {
    for (const setting of settings) {
      for (const settingDef of this.settings.getValue()) {
        if (setting.name === settingDef.name) {
          settingDef.value = setting.value;
        }
      }
    }
  }

}
