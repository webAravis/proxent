export class Item {
	name = '';
	price = 0;
	quality = '';

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}
