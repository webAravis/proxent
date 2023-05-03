import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Girl } from './girl.model';

import yinyTimings from './timings/yiny_timing_record.json';
import petaTimings from './timings/peta_timing_record.json';
import avaTimings from './timings/ava_timing_record.json';
import madisonTimings from './timings/madison_timing_record.json';

export interface TimingRecord {
	name: string;
	timing: number[];
	xpmultiplier: number;
	goldmultiplier: number;

	xp: number;
	gold: number;
	fans: number;

	timeout: number;

	stamcost: number;
	orgasm: number;
}

@Injectable({
	providedIn: 'root',
})
export class GirlsService {
	currentGirl: BehaviorSubject<Girl> = new BehaviorSubject<Girl>(new Girl());
	allGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);
	gameGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);

  girlTimings: {girlId: number, timings: TimingRecord[]}[] = [];

	constructor(private _httpClient: HttpClient) {
    this.loadTimings();

		this.loadGirls();
	}

  loadTimings(): void {
    this.girlTimings.push(
      {girlId: 1, timings: yinyTimings},
      {girlId: 2, timings: petaTimings},
      {girlId: 3, timings: avaTimings},
      {girlId: 4, timings: madisonTimings}
    );
  }

	loadGirls(): void {
		const unlockedGirls = [];
		const allGirls = [];

		const yiny = new Girl();
		yiny.id = 1;
		yiny.name = 'Yiny';
		yiny.freedom = 0;

		unlockedGirls.push(yiny);
		allGirls.push(yiny);

		this.allGirls.next(unlockedGirls);

		const peta = new Girl();
		peta.id = 2;
		peta.name = 'Peta';
		peta.freedom = 1;

		allGirls.push(peta);

		const ava = new Girl();
		ava.id = 3;
		ava.name = 'Ava';
		ava.freedom = 1;
		ava.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'recordmonthly_badge', quantity: 2 },
		];

		allGirls.push(ava);

		const madison = new Girl();
		madison.id = 4;
		madison.name = 'Madison';
		madison.freedom = 1;
		madison.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'fans_badge', quantity: 2 },
		];

		allGirls.push(madison);

		this.gameGirls.next(allGirls);
	}

	addGirl(girl: Girl): void {
		const allGirls = this.allGirls.getValue();
		allGirls.push(girl);

		this.allGirls.next(allGirls);
	}

	getTimingRecord(girl: Girl): TimingRecord[] | undefined {
		return this.girlTimings.find((timing: {girlId: number, timings: TimingRecord[]}) => timing.girlId === girl.id)?.timings;
	}

	updateGirl(girl: Girl): void {
		const allGirls = this.allGirls.getValue();
		const filtered = allGirls.filter((savedGirl) => savedGirl.id !== girl.id);
		filtered.push(girl);

		this.allGirls.next(filtered);
	}

	unlockPosition(position: string, girl: Girl): void {
		girl.unlockedPostions.push(position);

		this.updateGirl(girl);
	}

	_fileExists(url: string): Observable<boolean> {
		return this._httpClient.get(url).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}
}
