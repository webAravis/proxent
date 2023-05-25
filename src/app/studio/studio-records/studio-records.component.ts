import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Record } from 'src/app/record/record.model';
import { OtherStudiosService } from 'src/app/core/other-studios.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { RecordService } from 'src/app/record/record.service';
import { Girl } from 'src/app/core/girls/girl.model';
import { Studio } from 'src/app/core/studio.model';
import { GirlsService } from 'src/app/core/girls/girls.service';

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

  girls: Girl[] = [];

	private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _girlService: GirlsService,
		private _recordService: RecordService,
		private _otherStudioService: OtherStudiosService
	) {}

	ngOnInit(): void {
    combineLatest([
      this._girlService.gameGirls,
      this._recordService.records,
      this._otherStudioService.studios
    ]).pipe(takeUntil(this._unsubscribeAll))
    .subscribe((values: [girl: Girl[], records: Record[], studios: Studio[]]) => {
      this.girls = values[0];

      if (this.studio === 'player') {
        this.allRecords = values[1];
      } else {
        const studio = values[2].find(
          (savedStudio: Studio) => savedStudio.name === this.studio
        );
        if (studio) {
          this.allRecords = studio.records;
        }
      }

      this.getLastRecords();
      this.getBestRecord();
      this.getBestActress();
    });
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
			earning += girlEarning.get(record.girlId) ?? 0;

			girlEarning.set(record.girlId, earning);
		}

		const girlArray = [...girlEarning].map(([girlId, value]) => ({
			girlId,
			value,
		}));
		girlArray.sort((a, b) => a.value - b.value).reverse();

    const bestActress = girlArray[0];
    if (bestActress) {
      this.bestActress = {
        girl: this.getRecordGirl(bestActress.girlId),
        earnings: bestActress.value
      }
    }
	}

  getRecordGirl(girlId: string): Girl {
    return this.girls.find(girl => girl.fullId === girlId) ?? new Girl();
  }
}
