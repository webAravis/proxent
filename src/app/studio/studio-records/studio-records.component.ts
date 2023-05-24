import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Record } from 'src/app/record/record.model';
import { StudioService } from '../studio.service';
import { OtherStudiosService } from 'src/app/core/other-studios.service';
import { Subject, takeUntil } from 'rxjs';
import { RecordService } from 'src/app/record/record.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { Studio } from 'src/app/core/studio.model';

@Component({
	selector: 'app-studio-records',
	templateUrl: './studio-records.component.html',
	styleUrls: ['./studio-records.component.scss'],
})
export class StudioRecordsComponent implements OnInit, OnDestroy {
	@Input() studio = '';

	allRecords: Record[] = [];

	records: Record[] = [];
	bestRecord: Record = new Record();
	bestActress: { girl: Girl; earnings: number } = {
		girl: new Girl(),
		earnings: 0,
	};

	private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _studioService: StudioService,
		private _recordService: RecordService,
		private _otherStudioService: OtherStudiosService
	) {}

	ngOnInit(): void {
		if (this.studio === 'player') {
			this._recordService.records
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((records: Record[]) => {
					this.allRecords = records;

					this.getLastRecords();
					this.getBestRecord();
					this.getBestActress();
				});
		} else {
			this._otherStudioService.studios
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((studios: Studio[]) => {
					const studio = studios.find(
						(savedStudio: Studio) => savedStudio.name === this.studio
					);
					if (studio) {
						this.allRecords = studio.records;

						this.getLastRecords();
						this.getBestRecord();
						this.getBestActress();
					}
				});
		}
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}

	getLastRecords(): void {
		this.records = this.allRecords
			.map((savedRecord: Record) => {
				return { record: savedRecord, date: savedRecord.creationtime };
			})
			.sort((a, b) => b.date.getTime() - a.date.getTime())
			.slice(0, 4)
			.map(
				(recordObject: { record: Record; date: Date }) => recordObject.record
			);
	}

	getBestRecord(): void {
		this.bestRecord =
			this.allRecords.sort((a, b) => b.score - a.score)[0] ?? new Record();
	}

	getBestActress(): void {
		const girlEarning: Map<string, number> = new Map();

		for (const record of this.allRecords) {
			let earning = record.money;
			earning += girlEarning.get(record.girl.id) ?? 0;

			girlEarning.set(record.girl.id, earning);
		}

		const girlArray = [...girlEarning].map(([girlId, value]) => ({
			girlId,
			value,
		}));
		girlArray.sort((a, b) => a.value - b.value).reverse();

		this.bestActress = {
			girl:
				this.allRecords
					.map((record: Record) => record.girl)
					.find(
						(girl) =>
							girl.id === girlArray.map((mappedGirl) => mappedGirl.girlId)[0]
					) ?? new Girl(),
			earnings: girlArray[0]?.value ?? 0,
		};
	}
}
