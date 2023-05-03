import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Studio } from './studio.model';
import { GirlsService } from './girls/girls.service';
import { Girl } from './girls/girl.model';
import { RecordService } from '../record/record.service';
import { Record } from '../record/record.model';
import { GameService } from './game.service';

@Injectable({
	providedIn: 'root',
})
export class OtherStudiosService {
	studios: BehaviorSubject<Studio[]> = new BehaviorSubject<Studio[]>([]);
	newRecordEvent: Subject<Record> = new Subject<Record>();

	constructor(
		private _girlsService: GirlsService,
		private _recordService: RecordService,
		private _gameService: GameService
	) {
		setInterval(() => this.tryRecording(), 30_000);

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

				const girlRecorded = record.girl;
				const playerGirls = this._girlsService.allGirls
					.getValue()
					.filter((girl: Girl) => girl.name !== 'Yiny');

				const girlToSave = playerGirls.find(
					(playerGirl: Girl) => playerGirl.id === girlRecorded.id
				);
				if (girlToSave) {
					girlToSave.recordCount++;
					this._girlsService.updateGirl(girlToSave);
				}

				this._updateStudio(studioToAdd);
			}
		});
	}

	tryRecording(): void {
		if (this._gameService.isPaused) {
			return;
		}
		let girls = this._girlsService.gameGirls
			.getValue()
			.filter((girl: Girl) => girl.name !== 'Yiny');
		const playerGirls = this._girlsService.allGirls
			.getValue()
			.filter((girl: Girl) => girl.name !== 'Yiny');

		const studios = this.studios.getValue();
		if (studios.length === 0) {
			return;
		}

		for (const studio of studios) {
			if (this._willRecord(studio)) {
				const girlToRecord = this._getGirlToRecord(studio, girls, playerGirls);
				if (girlToRecord === undefined) {
					continue;
				} else {
					// remove girl from available as she won't record more than once a day
					girls = girls.filter((girl: Girl) => girl.name !== girlToRecord.name);

					// update girl's stats
					const multiplierFans = 1; // TODO: Get multiplier from current league
					const multiplierXp = 1; // TODO: Get multiplier from current league
					girlToRecord.recordCount = playerGirls.some(
						(playerGirl: Girl) => playerGirl.id === girlToRecord.id
					)
						? playerGirls.find(
								(playerGirl: Girl) => playerGirl.id === girlToRecord.id
						  )?.recordCount ?? 1
						: 1;
					girlToRecord.fans =
						girlToRecord.fans + studio.basefans * multiplierFans;
					girlToRecord.xp = girlToRecord.xp + studio.basexp * multiplierXp;

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
		girls: Girl[],
		playerGirls: Girl[]
	): Girl | undefined {
		const girlsAccepted: Girl[] = [];
		for (const girl of girls) {
			if (
				this._willAccept(studio) &&
				this._girlIsIndependant(girl, playerGirls)
			) {
				girlsAccepted.push(girl);
			}
		}

		if (girlsAccepted.length === 0) {
			return undefined;
		}

		return girlsAccepted[Math.floor(Math.random() * girlsAccepted.length)];
	}

	private _girlIsIndependant(girl: Girl, playerGirls: Girl[]): boolean {
		return playerGirls.some((playerGirl: Girl) => playerGirl.id === girl.id)
			? Math.random() <
					(playerGirls.find((playerGirl: Girl) => playerGirl.id === girl.id)
						?.freedom ?? 1)
			: true;
	}

	private _willAccept(studio: Studio): boolean {
		return Math.random() < studio.probToAccept;
	}

	private _willRecord(studio: Studio): boolean {
		return Math.random() < studio.probToRecord;
	}
}
