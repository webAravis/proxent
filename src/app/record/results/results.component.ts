import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
	@Input() name = 'Yiny #8';
	@Input() positions = 650;
	@Input() girl = 250;
	@Input() studio = 2;
	@Input() extra = 318;
	@Input() score = 1220;
	@Input() grade = 'S';
	@Input() freedom = 1;

	@Output() finish: EventEmitter<void> = new EventEmitter();

	doFinish(): void {
		this.finish.emit();
	}
}
