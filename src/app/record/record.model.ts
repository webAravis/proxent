import { Girl } from '../core/girls/girl.model';

export class Record {
	name = '';
	girl: Girl = new Girl();
	score = 0;
	money = 0;
	fans = 0;
	studioscore = 0;

	studioName = '';
	month = 0;
	year = 0;

	creationtime: Date = new Date();

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
