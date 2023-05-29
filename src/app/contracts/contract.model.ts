export class Contract {
  id = '';
  picked = false;

  activity = '';
  girlAttributes: string[] = [];
  requires: {requirement: string, value: string} | undefined;
  rewards: { type: string; quantity: number }[] = [];
  expirationDate: {month: number, year: number} = {month: 0, year: 0};

	constructor(values: object = {}) {
	  Object.assign(this, values);
  }
}
