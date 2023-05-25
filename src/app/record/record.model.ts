export class Record {
	name = '';
	girlId = '';
	score = 0;
	money = 0;
	fans = 0;
  xp = 0;
  orgasmCount = 0;
	studioscore = 0;

	studioName = '';
	month = 0;
	year = 0;

	creationtime: Date = new Date();

	constructor(values: object = {}) {
		Object.assign(this, values);
    this.creationtime = new Date(this.creationtime);
	}
}
