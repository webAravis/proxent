import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import dialog1 from './dialogs/intro.json';
import dialog2 from './dialogs/corruption.json';
import dialog3 from './dialogs/videos.json';
import dialog4 from './dialogs/peta.json';
import dialog5 from './dialogs/colabopen.json';
import dialog6 from './dialogs/nikkicontact.json';
import dialog7 from './dialogs/competition.json';

@Injectable({
	providedIn: 'root',
})
export class DialogsService {
	dialogShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dialog: BehaviorSubject<{ character: string; text: string }[]> =
		new BehaviorSubject<{ character: string; text: string }[]>([]);
	dialogs: { character: string; text: string }[][] = [];

	dialogsStarted: boolean[] = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	];

	constructor() {
		this.dialogs.push(
			dialog1,
			dialog2,
			dialog3,
			dialog4,
			dialog5,
			dialog6,
			dialog7
		);
	}

	startDialog(index: number): void {
		const dialog = this.dialogs[index];

		this.dialog.next(dialog);
		this.dialogShown.next(true);

		this.dialogsStarted[index] = true;
	}

	endDialog(): void {
		this.dialog.next([]);
		this.dialogShown.next(false);
	}
}
