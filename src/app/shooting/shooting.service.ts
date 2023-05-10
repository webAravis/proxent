import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PhotoShooting } from './shooting.component';

@Injectable({
  providedIn: 'root'
})
export class ShootingService {

  playerPhotos: BehaviorSubject<PhotoShooting[]> = new BehaviorSubject<PhotoShooting[]>([]);

  constructor() { }

  addPhoto(photo: PhotoShooting): void {
    const photos = this.playerPhotos.getValue();
    photos.push(photo);

    this.playerPhotos.next(photos);
  }
}
