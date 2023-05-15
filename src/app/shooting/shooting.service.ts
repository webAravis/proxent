import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PhotoShooting } from './shooting.component';
import { Girl } from '../core/girls/girl.model';

@Injectable({
  providedIn: 'root'
})
export class ShootingService {

  playerPhotos: BehaviorSubject<PhotoShooting[]> = new BehaviorSubject<PhotoShooting[]>([]);
  photoDef: {girlId: number, photos: any}[] = [];

  constructor() {
    this._initPhotoDefinitions();
  }

  addPhoto(photo: PhotoShooting): void {
    const photos = this.playerPhotos.getValue();
    photos.push(photo);

    this.playerPhotos.next(photos);
  }

  getPhotoDefinitions(girl: Girl): PhotoShooting[] {
    return this.photoDef.find(photo => photo.girlId === girl.id)?.photos ?? [];
  }

  private _initPhotoDefinitions(): void {
    this.photoDef = [
      {girlId: 1, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "gym", "outfit": "sports", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "sports", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "portrait"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "sports", "body": ["face", "boobs", "legs", "feet"], "format": "portrait"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "portrait"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "kitchen", "outfit": "casual", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "gym", "outfit": "sports", "body": ["underboobs", "legs"], "format": "portrait"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "car", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "portrait"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "feet"], "format": "portrait"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "portrait"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "car", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "casual", "body": ["butt", "legs", "feet"], "format": "portrait"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "butt"], "format": "portrait"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bathroom", "outfit": "lingerie", "body": ["butt", "legs", "feet"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["butt", "legs", "feet"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bathroom", "outfit": "lingerie", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["butt", "legs", "feet"], "format": "portrait"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "BDSM", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "kitchen", "outfit": "sports", "body": ["butt", "legs", "feet"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "BDSM", "body": ["butt", "legs", "feet"], "format": "portrait"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "uvmachine", "outfit": "lingerie", "body": ["boobs", "butt", "legs"], "format": "4:3"}}
      ]
      },
      {girlId: 2, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "car", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "work", "body": ["face", "butt"], "format": "4:3"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "beach", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "gym", "outfit": "sports", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "sports", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "cosplay", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "butt"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "kitchen", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "work", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "work", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "cosplay", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs", "legs"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["butt", "legs", "feet"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bathroom", "outfit": "lingerie", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "tits"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "BDSM", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "kitchen", "outfit": "sports", "body": ["butt", "legs", "feet"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "BDSM", "body": ["butt", "legs", "feet"], "format": "portrait"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "tits", "pussy", "legs"], "format": "portrait"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "hospital", "outfit": "lingerie", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "portrait"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "school", "outfit": "naked", "body": ["face", "boobs", "butt", "legs"], "format": "portrait"}},
        {"name": "13_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "tits", "butt", "ass", "pussy", "legs"], "format": "portrait"}}
      ]
      },
      {girlId: 3, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "work", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "work", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "kitchen", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "club", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "cosplay", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "shopping", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "kitchen", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "13_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "hospital", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "cosplay", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "school", "outfit": "naked", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "club", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "portrait"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["butt"], "format": "portrait"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "tits"], "format": "portrait"}}
      ]
      },
      {girlId: 4, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "kitchen", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "sports", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "work", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "work", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "work", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "school", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "pool", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "butt", "legs"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "club", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "cosplay", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "outdoor", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "casual", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "cosplay", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "hospital", "outfit": "cosplay", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "tits", "butt"], "format": "portrait"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "tits", "pussy", "legs"], "format": "portrait"}},
        {"name": "13_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "shopping", "outfit": "lingerie", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "portrait"}}
      ]
      },
      {girlId: 5, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "gym", "outfit": "sports", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bathroom", "outfit": "cosplay", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "kitchen", "outfit": "casual", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "cosplay", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "office", "outfit": "casual", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "cosplay", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "casual", "body": ["face", "legs", "butt"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "feet", "butt"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "club", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "swimsuit", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "work", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "work", "body": ["face", "butt"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "legs", "butt"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "school", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt", "feet"], "format": "4:3"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "work", "outfit": "naked", "body": ["face","boobs","butt", "legs", "feet"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "work", "outfit": "lingerie", "body": ["face","boobs","legs", "feet"], "format": "4:3"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "club", "outfit": "club", "body": ["face", "boobs", "legs", "feet"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face","boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "gym", "outfit": "naked", "body": ["face","boobs", "tits", "butt", "ass", "pussy", "legs"], "format": "portrait"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face","boobs", "tits", "legs"], "format": "portrait"}},
        {"name": "13_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face","boobs", "tits", "butt", "ass", "pussy", "legs"], "format": "portrait"}}
      ]
      },
      {girlId: 6, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face"], "format": "portrait"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["boobs"], "format": "4:3"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "pool", "outfit": "casual", "body": ["face", "legs"], "format": "4:3"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "pool", "outfit": "swimsuit", "body": ["face", "legs"], "format": "4:3"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "legs"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "club", "outfit": "casual", "body": ["face"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "work", "outfit": "casual", "body": ["face"], "format": "4:3"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "work", "outfit": "cosplay", "body": ["face"], "format": "4:3"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "lingerie", "body": ["face", "legs"], "format": "4:3"}},

        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "legs", "butt"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs", "butt"], "format": "4:3"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "butt", "legs"], "format": "4:3"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "hospital", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "work", "outfit": "work", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "work", "outfit": "work", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "13_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "boobs", "legs"], "format": "portrait"}},

        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "club", "outfit": "lingerie", "body": ["face", "boobs", "tits", "legs"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "casual", "body": ["face", "butt", "ass", "pussy"], "format": "4:3"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "tits", "legs", "feet"], "format": "4:3"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bathroom", "outfit": "naked", "body": ["face", "boobs", "tits"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "4:3"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "work", "outfit": "naked", "body": ["face", "boobs", "tits", "legs"], "format": "4:3"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "school", "outfit": "lingerie", "body": ["face", "boobs", "tits", "legs"], "format": "4:3"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "naked", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "pool", "outfit": "swimsuit", "body": ["boobs", "tits", "legs"], "format": "4:3"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "work", "outfit": "lingerie", "body": ["face", "boobs", "tits", "legs"], "format": "4:3"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "tits"], "format": "portrait"}}
      ]
      },
      {girlId: 7, photos: [
        {"name": "1_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face"], "format": "portrait"}},
        {"name": "1_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "bedroom", "outfit": "casual", "body": ["face", "butt"], "format": "portrait"}},
        {"name": "1_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "portrait"}},
        {"name": "2_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "legs", "feet"], "format": "portrait"}},
        {"name": "2_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "work", "body": ["face", "boobs"], "format": "portrait"}},
        {"name": "2_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["face", "boobs", "tits", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "3_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "legs"], "format": "4:3"}},
        {"name": "3_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "office", "outfit": "club", "body": ["face", "legs"], "format": "portrait"}},
        {"name": "3_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "sports", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "portrait"}},
        {"name": "4_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "sports", "body": ["face", "feet"], "format": "4:3"}},
        {"name": "4_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "butt"], "format": "4:3"}},
        {"name": "4_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "tits", "butt", "legs"], "format": "portrait"}},
        {"name": "5_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "casual", "body": ["face", "feet"], "format": "4:3"}},
        {"name": "5_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "gym", "outfit": "swimsuit", "body": ["face", "butt"], "format": "4:3"}},
        {"name": "5_slutty", "corruptionLevel": 3, "attributes": {"type": "slutty", "place": "outdoor", "outfit": "casual", "body": ["face", "butt", "legs", "feet"], "format": "portrait"}},
        {"name": "6_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face", "butt"], "format": "portrait"}},
        {"name": "6_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "sports", "body": ["face", "butt"], "format": "portrait"}},
        {"name": "6_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "naked", "body": ["butt", "legs", "feet"], "format": "4:3"}},
        {"name": "7_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "bedroom", "outfit": "casual", "body": ["face"], "format": "portrait"}},
        {"name": "7_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "butt"], "format": "portrait"}},
        {"name": "7_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "bedroom", "outfit": "casual", "body": ["face", "boobs", "butt", "ass", "pussy", "legs"], "format": "4:3"}},
        {"name": "8_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "shopping", "outfit": "casual", "body": ["face"], "format": "portrait"}},
        {"name": "8_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "legs"], "format": "portrait"}},
        {"name": "8_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "office", "outfit": "wedding", "body": ["face", "boobs", "butt", "legs"], "format": "portrait"}},
        {"name": "9_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "outdoor", "outfit": "casual", "body": ["face"], "format": "4:3"}},
        {"name": "9_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "butt", "legs"], "format": "4:3"}},
        {"name": "9_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "outdoor", "outfit": "lingerie", "body": ["face", "butt", "ass", "pussy", "legs"], "format": "portrait"}},
        {"name": "10_normal", "corruptionLevel": 0, "attributes": {"type": "normal", "place": "living", "outfit": "sports", "body": ["face", "butt", "legs"], "format": "4:3"}},
        {"name": "10_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "casual", "body": ["face", "boobs", "butt"], "format": "portrait"}},
        {"name": "10_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "office", "outfit": "naked", "body": ["face", "butt", "pussy", "legs"], "format": "4:3"}},
        {"name": "11_sexy", "corruptionLevel": 0, "attributes": {"type": "sexy", "place": "office", "outfit": "lingerie", "body": ["face", "boobs", "butt"], "format": "portrait"}},
        {"name": "11_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "outdoor", "outfit": "naked", "body": ["face", "boobs", "tits", "pussy", "legs", "feet"], "format": "portrait"}},
        {"name": "12_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "living", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "12_slutty", "corruptionLevel": 4, "attributes": {"type": "sutty", "place": "bedroom", "outfit": "lingerie", "body": ["face", "boobs", "butt", "legs"], "format": "4:3"}},
        {"name": "13_sexy", "corruptionLevel": 2, "attributes": {"type": "sexy", "place": "outdoor", "outfit": "swimsuit", "body": ["face", "boobs", "butt", "legs", "feet"], "format": "4:3"}},
        {"name": "13_slutty", "corruptionLevel": 4, "attributes": {"type": "slutty", "place": "office", "outfit": "lingerie", "body": ["face", "boobs", "tits", "legs"], "format": "4:3"}}
      ]
      }
    ];
  }
}
