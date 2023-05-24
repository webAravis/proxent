import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PhotoShooting } from './shooting.component';

@Injectable({
  providedIn: 'root'
})
export class ShootingService {

  playerPhotos: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {}

  addPhoto(photo: PhotoShooting): void {
    photo.locked = false;
  }
}
