import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Girl } from '../core/girls/girl.model';

@Injectable({
	providedIn: 'root',
})
export class FreedomService {
	showFreedomReducer: Subject<Girl> = new Subject<Girl>();
}
