import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Girl } from './girl.model';
import { DialogsService } from 'src/app/dialogs/dialogs.service';

import yinyTimings from './timings/yiny_timing_record.json';
import petaTimings from './timings/peta_timing_record.json';
import avaTimings from './timings/ava_timing_record.json';
import madisonTimings from './timings/madison_timing_record.json';
import karmaTimings from './timings/karma_timing_record.json';
import { Position } from '../position.model';

@Injectable({
	providedIn: 'root',
})
export class GirlsService {
	currentGirl: BehaviorSubject<Girl> = new BehaviorSubject<Girl>(new Girl());
	playerGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);
	gameGirls: BehaviorSubject<Girl[]> = new BehaviorSubject<Girl[]>([]);

  girlTimings: {girlId: number, timings: Position[]}[] = [];

	constructor(
    private _httpClient: HttpClient,
    private _dialogsService: DialogsService
  ) {
    this.loadTimings();

		this.loadGirls();
	}

  loadTimings(): void {
    this.girlTimings.push(
      {girlId: 1, timings: yinyTimings},
      {girlId: 2, timings: petaTimings},
      {girlId: 3, timings: avaTimings},
      {girlId: 4, timings: madisonTimings},
      {girlId: 5, timings: karmaTimings}
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

		this.playerGirls.next(unlockedGirls);

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

		const karma = new Girl();
		karma.id = 5;
		karma.name = 'Karma';
		karma.freedom = 1;
		karma.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'money_badge', quantity: 2 },
		];

		allGirls.push(karma);

		const nikki = new Girl();
		nikki.id = 6;
		nikki.name = 'Nikki';
		nikki.freedom = 1;
		nikki.unlockPrice = [
			{ type: 'gold', quantity: 15_000 },
			{ type: 'recordyearly_badge', quantity: 2 },
		];

		allGirls.push(nikki);

    let toSave = this.initAttributes(allGirls);
		this.gameGirls.next(toSave);
	}

  initAttributes(girls: Girl[]) : Girl[] {
    const toReturn: Girl[] = [];

    for (const girl of girls) {
      switch (girl.name) {
        case 'Peta':
          girl.attributes = ['brunette', 'tattoo', 'fit', 'dark eyes', 'american'];
          break;
        case 'Ava':
          girl.attributes = ['milf', 'brunette', 'dark eyes', 'euro'];
          break;
        case 'Madison':
          girl.attributes = ['blond', 'fit', 'flexible', 'dark eyes', 'small', 'euro'];
          break;
        case 'Karma':
          girl.attributes = ['blond', 'green eyes', 'tattoo', 'american'];
          break;
        case 'Nikki':
          girl.attributes = ['blond', 'dark eyes', 'producer', 'euro'];
          break;
      }

      toReturn.push(girl);
    }

    return toReturn;
  }

	addGirl(girl: Girl): void {
		const allGirls = this.playerGirls.getValue();
		allGirls.push(girl);

		this.playerGirls.next(allGirls);
    if (allGirls.length-1 >= 2 && this._dialogsService.dialogsStarted[7] === false) {
      this._dialogsService.startDialog(7);
    }
	}

  removeGirl(toRemove: Girl): void {
    const filteredGirls = this.playerGirls.getValue().filter((girl: Girl) => girl.id !== toRemove.id);
    this.playerGirls.next(filteredGirls);
  }

	getTimingRecord(girl: Girl): Position[] | undefined {
		return this.girlTimings.find((timing: {girlId: number, timings: Position[]}) => timing.girlId === girl.id)?.timings;
	}

	updateGirl(girl: Girl): void {
		const allGirls = this.playerGirls.getValue();
		const filtered = allGirls.filter((savedGirl) => savedGirl.id !== girl.id);
		filtered.push(girl);

		this.playerGirls.next(filtered);
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
