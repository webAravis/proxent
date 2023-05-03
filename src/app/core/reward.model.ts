import { Item } from '../inventory/item.model';
import { Girl } from './girls/girl.model';

export class Reward {
	fans: number;
	xp: number;
	money: number;
	corruption: number;
	items: Item[];
	levelup: boolean;

	hardCapCorruption: boolean;

	girl: Girl;

	constructor(
		fans = 0,
		xp = 0,
		money = 0,
		items: Item[] = [],
		corruption = 0,
		levelup = false,
		hardCapCorruption = false,
		girl: Girl = new Girl()
	) {
		this.fans = fans;
		this.xp = xp;
		this.money = money;
		this.items = items;
		this.corruption = corruption;
		this.levelup = levelup;
		this.hardCapCorruption = hardCapCorruption;

		this.girl = girl;
	}
}
