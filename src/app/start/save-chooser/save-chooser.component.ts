import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SaveService } from 'src/app/core/save.service';
import { GameService } from 'src/app/core/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-save-chooser',
  templateUrl: './save-chooser.component.html',
  styleUrls: ['./save-chooser.component.scss']
})
export class SaveChooserComponent implements OnInit, OnDestroy {

  show = false;
  saveIndex = -1;
  currentDate = new Date();

  private _unsubscribeAll: Subject<boolean> = new Subject();

  constructor(
    private _saveService: SaveService,
    private _gameService: GameService,
    private _router: Router
  ) { }

  get saves(): any[] {
    return this._saveService.saves;
  }

  ngOnInit(): void {
    this._saveService.showSaveChooser.pipe(takeUntil(this._unsubscribeAll)).subscribe((show: boolean) => { this.show = show; });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  close(): void {
    this._saveService.showSaveChooser.next(false);
  }

  start(): void {
    this._saveService.saveIndex = this.saveIndex;

    this._saveService.loadGame().subscribe(() => {
      setTimeout(() => {
        this._gameService.startGame(false);
      }, 100);
    });

    this._router.navigate(['/girls']);
  }

  deleteSave(): void {
    if (confirm('Are you sure you want to delete this save?')) {
      this._saveService.delete(this.saveIndex);
    }
  }

  onFileSelected(event: any) {
    if (event.target === null || event.target.files === null || event.target.files.length === 0) {
      return;
    }

    const file: File = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result !== 'string') {
        alert('Please select a save file');
        return;
      }
      if (!this._saveService.import(fileReader.result)) {
        alert('Corrupted save file, please try again');
        return;
      }
    }
    fileReader.readAsText(file);
  }

  exportSave(): void {
    const file = new window.Blob([this._saveService.export(this.saveIndex)], { type: 'text/plain' });

    const downloadAncher = document.createElement("a");
    downloadAncher.style.display = "none";

    const fileURL = URL.createObjectURL(file);
    downloadAncher.href = fileURL;
    downloadAncher.download = 'proxent_save_' + this.saveIndex;
    downloadAncher.click();
  }

}
