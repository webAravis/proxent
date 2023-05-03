import { Injectable } from '@angular/core';
import { GameService } from '../core/game.service';
import { Subject } from 'rxjs';
import { Record } from '../record/record.model';
import { RecordService } from '../record/record.service';
import { OtherStudiosService } from '../core/other-studios.service';

@Injectable({
	providedIn: 'root',
})
export class CeremonyService {
	monthlyRewards: Subject<Record[]> = new Subject<Record[]>();
	yearlyRewards: Subject<Record[]> = new Subject<Record[]>();

	constructor(
		private _gameService: GameService,
		private _recordService: RecordService,
		private _otherStudioService: OtherStudiosService
	) {
		this._gameService.monthChanged.subscribe(() => this.monthCeremony());
		this._gameService.yearChanged.subscribe(() => this.yearCeremony());
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
					record.girl.name !== 'Yiny'
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
				(record: Record) => record.year === year && record.girl.name !== 'Yiny'
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
}
