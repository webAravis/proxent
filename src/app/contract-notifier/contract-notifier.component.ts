import { Component, Input, OnInit } from '@angular/core';
import { Contract } from '../contracts/contract.model';
import { ContractsService } from '../contracts/contracts.service';

@Component({
  selector: 'app-contract-notifier',
  templateUrl: './contract-notifier.component.html',
  styleUrls: ['./contract-notifier.component.scss']
})
export class ContractNotifierComponent implements OnInit {

  @Input() contractNotification: {contract: Contract, completed: boolean, expired: boolean} | undefined;
  fadeOut = false;

  constructor(
    private _contractService: ContractsService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.fadeOut = true;
      setTimeout(() => {
        if (this.contractNotification) {
          this._contractService.removeNotification(this.contractNotification);
        }
      }, 500);
    }, 5000);
  }

}
