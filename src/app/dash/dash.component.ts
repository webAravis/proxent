import { Component } from '@angular/core';

@Component({
	selector: 'app-dash',
	templateUrl: './dash.component.html',
	styleUrls: ['./dash.component.scss'],
})
export class DashComponent {
	background = './assets/logo.png';

	get isBgVideo(): boolean {
		return this.background.endsWith('mp4');
	}
}
