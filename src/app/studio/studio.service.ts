import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';
import { DialogsService } from '../dialogs/dialogs.service';
import { GameService } from '../core/game.service';
import { ModifierLevelCost, StudioModifier } from './studiomodifier.model';
import { InventoryService } from '../inventory/inventory.service';

@Injectable({
	providedIn: 'root',
})
export class StudioService {
	studioUnlocked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);
	opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	modifiers: BehaviorSubject<StudioModifier[]> = new BehaviorSubject<
		StudioModifier[]
	>([]);

	constructor(
		private _girlService: GirlsService,
		private _dialogsService: DialogsService,
		private _gameService: GameService,
		private _inventoryService: InventoryService
	) {}

	open(price: number): void {
		this._dialogsService.startDialog(4);

		const allGirls = this._girlService.gameGirls.getValue();
		const peta =
			allGirls.find((girl: Girl) => girl.name === 'Peta') ?? new Girl();

		this._girlService.addGirl(peta);
		this.opened.next(true);
		this._gameService.updateGolds(price * -1);

		const allModifiers: StudioModifier[] = [];

		const sceneModifier = new StudioModifier();
		sceneModifier.id = 1;
		sceneModifier.name = 'scene';
		sceneModifier.badge = 'recordmonthly';
		allModifiers.push(sceneModifier);

		const lightsModifier = new StudioModifier();
		lightsModifier.id = 2;
		lightsModifier.name = 'lights';
		lightsModifier.badge = 'studiomonthly';
		allModifiers.push(lightsModifier);

		const camerasModifier = new StudioModifier();
		camerasModifier.id = 3;
		camerasModifier.name = 'cameras';
		camerasModifier.badge = 'recordyearly';
		allModifiers.push(camerasModifier);

		const directorModifier = new StudioModifier();
		directorModifier.id = 4;
		directorModifier.name = 'director';
		directorModifier.badge = 'money';
		allModifiers.push(directorModifier);

		const makeupModifier = new StudioModifier();
		makeupModifier.id = 5;
		makeupModifier.name = 'makeup';
		makeupModifier.badge = 'fans';
		allModifiers.push(makeupModifier);

		this.modifiers.next(this.initModifiersMethods(allModifiers));
		this.opened.next(true);
	}

	initModifiersMethods(modifiers: StudioModifier[]): StudioModifier[] {
		const toReturn: StudioModifier[] = [];

		for (const modifier of modifiers) {
			const modifierLevelCost = new ModifierLevelCost();

			switch (modifier.name) {
				case 'scene': {
					modifier.effectQuality = function (level: number): number {
						return 0.05 * (level - 1);
					};
					modifierLevelCost.type = 'gold';
					modifierLevelCost.value = function (level: number): number {
						return Math.round((level / 0.07) ** 2);
					};
					modifier.nextLvlCost = modifierLevelCost;
					break;
				}
				case 'lights':
				case 'cameras': {
					modifier.effectQuality = function (level: number): number {
						return 0.01 * (level - 1);
					};
					modifierLevelCost.type = 'gold';
					modifierLevelCost.value = function (level: number): number {
						return Math.round((level / 0.3) ** 2);
					};
					modifier.nextLvlCost = modifierLevelCost;
					break;
				}
				case 'director': {
					modifier.effectQuality = function (level: number): number {
						return 0.5 * (level - 1);
					};
					modifierLevelCost.type = modifier.badge + '_badge';
					modifierLevelCost.value = function (level: number): number {
						return Math.round((level / 0.8) ** 2);
					};
					modifier.nextLvlCost = modifierLevelCost;
					break;
				}
				case 'makeup': {
					modifier.effectQuality = function (level: number): number {
						return 0.4 * (level - 1);
					};
					modifierLevelCost.type = modifier.badge + '_badge';
					modifierLevelCost.value = function (level: number): number {
						return Math.round((level / 0.8) ** 2);
					};
					modifier.nextLvlCost = modifierLevelCost;
					break;
				}
			}

			toReturn.push(modifier);
		}

		return toReturn;
	}

	getStudioQuality(): number {
		let studioQuality = 0.01;
		const modifiers = this.modifiers.getValue();

		studioQuality +=
			modifiers
				.filter((modifier) => modifier.name === 'scene')
				.map((modifier) => modifier.effectQuality(modifier.level))[0] ?? 0;
		studioQuality +=
			modifiers
				.filter((modifier) => modifier.name === 'lights')
				.map((modifier) => modifier.effectQuality(modifier.level))[0] ?? 0;
		studioQuality +=
			modifiers
				.filter((modifier) => modifier.name === 'cameras')
				.map((modifier) => modifier.effectQuality(modifier.level))[0] ?? 0;
		studioQuality +=
			modifiers
				.filter((modifier) => modifier.name === 'director')
				.map((modifier) => modifier.effectQuality(modifier.level))[0] ?? 0;
		studioQuality +=
			modifiers
				.filter((modifier) => modifier.name === 'makeup')
				.map((modifier) => modifier.effectQuality(modifier.level))[0] ?? 0;

		return studioQuality;
	}

	levelupModifier(modifier: StudioModifier): void {
		let allModifiers = this.modifiers.getValue();

		if (modifier.nextLvlCost.type === 'gold') {
			this._gameService.updateGolds(
				modifier.nextLvlCost.value(modifier.level) * -1
			);
		} else {
			this._inventoryService.removeItemByName(
				modifier.nextLvlCost.type,
				modifier.nextLvlCost.value(modifier.level)
			);
		}

		modifier.level++;
		allModifiers = allModifiers.filter(
			(savedModifier: StudioModifier) => savedModifier.id !== modifier.id
		);
		allModifiers.push(modifier);
		allModifiers.sort((a, b) => a.id - b.id);

		this.modifiers.next(allModifiers);
	}
}
