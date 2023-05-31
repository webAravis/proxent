import { takeUntil, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Contract } from './contract.model';
import { ContractsService } from './contracts.service';
import { ShepherdService } from 'angular-shepherd';
import { GameService } from '../core/game.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit, OnDestroy, AfterViewInit {

  availableContracts: Contract[] = [];
  pickedContracts: Contract[] = [];

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _contractService: ContractsService,
    private _gameService: GameService,
    private _shepherdService: ShepherdService,
  ) {}

  ngAfterViewInit(): void {
    if (!this._gameService.tutorials.contractScreenDone) {
      this.startTutorial();
      this._gameService.tutorials.contractScreenDone = true;
    }
  }

  ngOnInit(): void {
    this._contractService.contracts.pipe(takeUntil(this._unsubscribeAll)).subscribe((contracts: Contract[]) => {
      contracts.sort((a: Contract, b: Contract) => {
        return new Date(b.expirationDate.year, b.expirationDate.month).getTime() - new Date(a.expirationDate.year, a.expirationDate.month).getTime()
      });
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

  startTutorial(): void {
    this._gameService.pauseGame();
    this._shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: {
        enabled: true
      },
      buttons: [
        {
          action: function() { this.back() },
          label: 'prev',
          text: 'Prev'
        },
        {
          action: function() { this.next() },
          label: 'next',
          text: 'Next'
        },
      ],
    };
    this._shepherdService.modal = true;
    this._shepherdService.confirmCancel = false;
    this._shepherdService.onTourFinish = () => {this._gameService.resumeGame()};
    this._shepherdService.addSteps([
      {
        title: 'Contract tutorial',
        text: ['Are you new to the game?'],
        buttons: [
          {
            action: function() { this.cancel(); },
            label: 'prev',
            text: 'No, I already know the mechanics'
          },
          {
            action: function() { this.next() },
            label: 'next',
            text: 'Yes, take me for a tour!'
          },
        ]
      },
      {
        title: 'Intro',
        text: 'This is the contracts screen. You will find all available and picked contracts'
      },
      {
        attachTo: {
          element: '.available',
          on: 'top',
        },
        title: 'Available contracts',
        text: ['New contracts will appear here, you can pick them and try to complete them. Contracts have expiration date, when a contract expires, it becomes unavailable and its rewards are converted to a charge!'],
      },
      {
        title: 'Summary',
        text: ['You know the basics about contracts. Fullfill them and earn great prizes'],
      }
    ]);
    this._shepherdService.start();
  }

}
