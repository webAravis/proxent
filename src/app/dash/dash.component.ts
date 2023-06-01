import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogsService } from '../dialogs/dialogs.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dash',
	templateUrl: './dash.component.html',
	styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<boolean> = new Subject();
  private _isShown = false;

  constructor(
    private _dialogService: DialogsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._dialogService.dialogShown.pipe(takeUntil(this._unsubscribeAll)).subscribe((shown) => {
      if (!shown && this._isShown) {
        this._router.navigate(['/girls']);
      }
      this._isShown = shown;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
