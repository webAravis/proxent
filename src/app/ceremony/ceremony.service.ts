import { Injectable, OnInit } from '@angular/core';
import { GameService } from '../core/game.service';
import { Subject, takeUntil } from 'rxjs';
import { Record } from '../record/record.model';
import { RecordService } from '../record/record.service';
import { OtherStudiosService } from '../core/other-studios.service';
import { GirlsService } from '../core/girls/girls.service';
import { Girl } from '../core/girls/girl.model';

@Injectable({
	providedIn: 'root',
})
export class CeremonyService {
	monthlyRewards: Subject<Record[]> = new Subject<Record[]>();
	yearlyRewards: Subject<Record[]> = new Subject<Record[]>();

  girls: Girl[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

	constructor(
		private _gameService: GameService,
		private _recordService: RecordService,
		private _otherStudioService: OtherStudiosService,
    private _girlService: GirlsService
	) {
		this._gameService.monthChanged.subscribe(() => this.monthCeremony());
		this._gameService.yearChanged.subscribe(() => this.yearCeremony());
    this._girlService.gameGirls.pipe(takeUntil(this._unsubscribeAll)).subscribe(girls => this.girls = girls);
  }

  debugCeremony(): void {
		setTimeout(() => {
			let recordsToPrime: Record[] = [];
			recordsToPrime = [
				...recordsToPrime,
				...this._recordService.records.getValue(),
			];

			for (const studio of this._otherStudioService.studios.getValue()) {
				recordsToPrime = [...recordsToPrime, ...studio.records];
			}

			this.monthlyRewards.next(recordsToPrime);
		}, 3000);
	}

	monthCeremony() {
		const month = this._gameService.month - 1;
		const year = this._gameService.year;

		let recordsToPrime: Record[] = [];
    recordsToPrime = [
      ...recordsToPrime,
      ...this._recordService.records
			.getValue()
			.filter(
				(record: Record) =>
					record.month === month &&
					record.year === year &&
					this.getRecordGirl(record.girlId).name !== 'Yiny'
			)
    ];

		for (const studio of this._otherStudioService.studios.getValue()) {
			recordsToPrime = [
				...recordsToPrime,
				...studio.records.filter(
					(record: Record) => record.month === month && record.year === year
				),
			];
		}

		if (recordsToPrime.length > 0) {
			this.monthlyRewards.next(recordsToPrime);
		}
	}

	yearCeremony() {
		const year = this._gameService.year - 1;

		let recordsToPrime: Record[] = this._recordService.records
			.getValue()
			.filter(
				(record: Record) => record.year === year && this.getRecordGirl(record.girlId).name !== 'Yiny'
			);

		for (const studio of this._otherStudioService.studios.getValue()) {
			recordsToPrime = [
				...recordsToPrime,
				...studio.records.filter((record: Record) => record.year === year),
			];
		}

		if (recordsToPrime.length > 0) {
			this.yearlyRewards.next(recordsToPrime);
		}
	}

  getRecordGirl(girlId: string): Girl {
    return this.girls.find(girl => girl.fullId === girlId) ?? new Girl();
  }
}
