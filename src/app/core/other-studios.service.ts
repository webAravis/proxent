import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { Studio } from './studio.model';
import { GirlsService } from './girls/girls.service';
import { Girl } from './girls/girl.model';
import { RecordService } from '../record/record.service';
import { Record } from '../record/record.model';
import { GameService } from './game.service';
import { MastersService } from '../leaders/masters.service';

@Injectable({
	providedIn: 'root',
})
export class OtherStudiosService {
	studios: BehaviorSubject<Studio[]> = new BehaviorSubject<Studio[]>([]);
	newRecordEvent: Subject<Record> = new Subject<Record>();

  girls: Girl[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _girlsService: GirlsService,
		private _recordService: RecordService,
    private _masterService: MastersService,
		private _gameService: GameService
	) {
		setInterval(() => this.tryRecording(), 15_000);

		const studios = [];
		studios.push(
			new Studio({
				name: 'Brazzers',
				probToRecord: 0.3,
				probToAccept: 0.8,
				quality: 5,
				basefans: 50_000,
				basexp: 80_000,
			}),
			new Studio({
				name: 'Digital Playground',
				probToRecord: 0.5,
				probToAccept: 0.5,
				quality: 1,
				basefans: 30_000,
				basexp: 30_000,
			}),
			new Studio({
				name: 'Pornhub',
				probToRecord: 0.8,
				probToAccept: 0.3,
				quality: 0.5,
				basefans: 150_000,
				basexp: 60_000,
			})
		);

		this.studios.next(studios);

		this._recordService.recordSimulated.subscribe((record: Record) => {
			if (record.studioName !== '') {
				const studioToAdd = this.studios
					.getValue()
					.find((studio: Studio) => studio.name === record.studioName);
				if (studioToAdd === undefined) {
					return;
				}

				this.newRecordEvent.next(record);

				studioToAdd.records.push(record);

				const girlRecorded = this.getRecordGirl(record.girlId);
        girlRecorded.recordCount++;

				this._updateStudio(studioToAdd);
			}
		});
    this._girlsService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => this.girls = girls);
	}

	tryRecording(): void {
		if (this._gameService.isPaused) {
			return;
		}
		let girls = this._girlsService.gameGirls.getValue();

		const studios = this.studios.getValue();
		if (studios.length === 0) {
			return;
		}

		for (const studio of studios) {
			if (this._willRecord(studio)) {
				const girlToRecord = this._getGirlToRecord(studio, girls);
				if (girlToRecord === undefined) {
					continue;
				} else {
					// remove girl from available as she won't record more than once a day
					girls = girls.filter((girl: Girl) => girl.name !== girlToRecord.name);

					// update girl's stats
					const multiplierFans = this._masterService.getFansMultiplier();
          girlToRecord.fans = girlToRecord.fans + studio.basefans * multiplierFans;
          if (girlToRecord.locked === true || girlToRecord.level < this._masterService.getLevelCap()) {
            girlToRecord.xp = girlToRecord.xp + studio.basexp;
          }

					this._recordService.simulateRecord(
						girlToRecord,
						studio.name,
						true,
						studio.quality,
						girlToRecord.recordCount + 1
					);
				}
			}
		}
	}

  getRecordGirl(girlId: string): Girl {
    return this.girls.find(girl => girl.fullId === girlId) ?? new Girl();
  }

	private _updateStudio(studio: Studio): void {
		const filteredStudios = this.studios
			.getValue()
			.filter((savedStudio: Studio) => savedStudio.name !== studio.name);
		filteredStudios.push(studio);

		filteredStudios.sort((a, b) => a.name.localeCompare(b.name));
		this.studios.next(filteredStudios);
	}

	private _getGirlToRecord(
		studio: Studio,
		girls: Girl[]
	): Girl | undefined {
		const girlsAccepted: Girl[] = [];
		for (const girl of girls) {
			if (
				this._willAccept(studio) &&
				this._girlIsIndependant(girl)
			) {
				girlsAccepted.push(girl);
			}
		}

		if (girlsAccepted.length === 0) {
			return undefined;
		}

		return girlsAccepted[Math.floor(Math.random() * girlsAccepted.length)];
	}

	private _girlIsIndependant(girl: Girl): boolean {
		return Math.random() < girl.freedom;
	}

	private _willAccept(studio: Studio): boolean {
		return Math.random() < studio.probToAccept;
	}

	private _willRecord(studio: Studio): boolean {
		return Math.random() < studio.probToRecord;
	}
}
