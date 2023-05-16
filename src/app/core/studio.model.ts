import { Record } from '../record/record.model';

export class Studio {
	name = '';
	records: Record[] = [];

	probToRecord = 0;
	probToAccept = 0;
	quality = 0.01;

	basefans = 0;
	basexp = 0;

	constructor(values: object = {}) {
		Object.assign(this, values);

    const records: Record[] = [];
    for (const record of this.records) {
      records.push(new Record(record))
    }
    this.records = records;
	}
}
