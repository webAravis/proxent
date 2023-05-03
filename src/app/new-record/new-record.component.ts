import { Component, OnDestroy, OnInit } from '@angular/core';
import { OtherStudiosService } from '../core/other-studios.service';
import { Subject, takeUntil } from 'rxjs';
import { Record } from '../record/record.model';

@Component({
	selector: 'app-new-record',
	templateUrl: './new-record.component.html',
	styleUrls: ['./new-record.component.scss'],
})
export class NewRecordComponent implements OnInit, OnDestroy {
	record: Record = new Record();
	show = false;

	private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

	constructor(private _otherStudio: OtherStudiosService) {}

	ngOnInit(): void {
		this._otherStudio.newRecordEvent
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((record: Record) => {
				this.record = record;
				this.show = true;
				setTimeout(() => {
					this.show = false;
				}, 3000);
			});
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(true);
		this._unsubscribeAll.complete();
	}
}
