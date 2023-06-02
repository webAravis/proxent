import { Item } from '../inventory/item.model';
import { Girl } from './girls/girl.model';

export class Reward {
	fans: number;
	xp: number;
	money: number;
	corruption: number;
	items: Item[];
  msg: string;

	levelup: boolean;
	gainedSkillPoint: number;
	hardCapCorruption: boolean;
	hardCapLeague: boolean;

	girl: Girl;

	constructor(
		fans = 0,
		xp = 0,
		money = 0,
		items: Item[] = [],
		corruption = 0,
		levelup = false,
		gainedSkillPoint = 0,
		hardCapCorruption = false,
		hardCapLeague = false,
		girl: Girl = new Girl(),
    msg: string = ""
	) {
		this.fans = fans;
		this.xp = xp;
		this.money = money;
		this.items = items;
		this.corruption = corruption;
		this.levelup = levelup;
		this.gainedSkillPoint = gainedSkillPoint;
		this.hardCapCorruption = hardCapCorruption;
		this.hardCapLeague = hardCapLeague;
    this.msg = msg;

		this.girl = girl;
	}
}
