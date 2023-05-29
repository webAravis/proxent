import { takeUntil, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Contract } from './contract.model';
import { ContractsService } from './contracts.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit, OnDestroy {

  availableContracts: Contract[] = [];
  pickedContracts: Contract[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _contractService: ContractsService
  ) {}

  ngOnInit(): void {
    this._contractService.contracts.pipe(takeUntil(this._unsubscribeAll)).subscribe((contracts: Contract[]) => {
      this.availableContracts = contracts.filter(contract => !contract.picked);
      this.pickedContracts = contracts.filter(contract => contract.picked);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  isNumeric(val: any): val is number | string {
    return !Array.isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }

  pickContract(contract: Contract): void {
    this._contractService.pick(contract);
  }

}
