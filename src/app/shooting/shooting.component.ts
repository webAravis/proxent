import { GirlsService } from './../core/girls/girls.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Girl } from '../core/girls/girl.model';
import { RewardService } from '../reward/reward.service';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from '../core/game.service';
import { CachingService } from '../core/caching.service';
import { SafeUrl } from '@angular/platform-browser';
import { ShootingService } from './shooting.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import { SettingsService } from '../core/settings.service';

export class PhotoShooting {
  name = '';
  url: SafeUrl | undefined;
  attributes: {
    type: string,
    place: string,
    outfit: string,
    body: string[],
    format: string
  } = { type: '', place: '', outfit: '', body: [], format: '' };
  price = 0;
  golds = 0;
  fans = 0
  corruptionLevel = 0;
  locked = true;

	constructor(values: object = {}) {
		Object.assign(this, values);
	}
}

@Component({
  selector: 'app-shooting',
  templateUrl: './shooting.component.html',
  styleUrls: ['./shooting.component.scss']
})
export class ShootingComponent implements OnInit, OnDestroy {

  girl = new Girl();

  photos: PhotoShooting[] = [];
  photoDef: PhotoShooting[] = [];
  playedPhotos: PhotoShooting[] = [];

  played = false;

  place = false;
  outfit = false;
  format = false;
  body = false;

  combo = 1;

  customerRequest: { place: string, outfit: string, body: string, format: string } | undefined;

  shakePhoto = '';
  usePhoto = '';

  masonryOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true
  }

  private _golds = 0;
  private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _router: Router,
    private _girlsService: GirlsService,
    private _rewardService: RewardService,
    private _gameService: GameService,
    private _cachingService: CachingService,
    private _shootingService: ShootingService,
    private _settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this._gameService.goldChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((golds) => (this._golds = golds));

    this._golds = this._gameService.golds;

    this._girlsService.currentGirl
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((girl: Girl) => {
        this.girl = girl;
        this._initializePhotos();
      });

    this._gameService.pauseGame();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();

    this._gameService.resumeGame();
  }

  get goldsWon(): number {
    return Math.round(this.playedPhotos.map((photo: PhotoShooting) => photo.golds).reduce((acc, current) => acc + current, 0) * this.combo);
  }

  get fansWon(): number {
    return Math.round(this.playedPhotos.map((photo: PhotoShooting) => photo.fans).reduce((acc, current) => acc + current, 0) * this.combo);
  }

  get xpWon(): number {
    return this.playedPhotos.length > 0 ? Math.round((50 + (25 * this.girl.popularity) + (25 * this.girl.level)) * this.combo * this._settingsService.getSetting('shooting_xp_reward')) : 0;
  }

  isLocked(photo: PhotoShooting): boolean {
    return photo.locked
  }

  canAfford(photo: PhotoShooting): boolean {
    return photo.price <= this._golds;
  }

  playPhoto(photo: PhotoShooting): void {
    if (this.usePhoto === photo.name) {
      return;
    }

    this.usePhoto = photo.name;
    this.played = false;

    setTimeout(() => {
      this.playedPhotos.push(photo);
      this.photos = this.photos.filter(availablePhoto => photo.name !== availablePhoto.name);

      this._computeCombo(photo);
      this.played = true;
    }, 500);
  }

  endShooting(): void {
    this.girl.shootingCount++;
    this._rewardService.giveReward(this.fansWon, this.xpWon, this.goldsWon, [], 0, this.girl);

    this._gameService.resumeGame();
    this._router.navigate(['girls']);
  }

  newCustomerRequest(): void {
    this.played = false;
    this.customerRequest = undefined;

    setTimeout(() => {

      const availablePlaces = this.photoDef.map((photo: PhotoShooting) => photo.attributes.place);
      const place = availablePlaces[Math.floor(Math.random() * availablePlaces.length)];

      const availableOutfit = this.photoDef.map((photo: PhotoShooting) => photo.attributes.outfit);
      const outfit = availableOutfit[Math.floor(Math.random() * availableOutfit.length)];

      const availableFormat = this.photoDef.map((photo: PhotoShooting) => photo.attributes.format);
      const format = availableFormat[Math.floor(Math.random() * availableFormat.length)];

      const availableBody = this.photoDef.map((photo: PhotoShooting) => photo.attributes.body);
      const bodyParts = availableBody[Math.floor(Math.random() * availableBody.length)];
      const body = bodyParts[Math.floor(Math.random() * bodyParts.length)];

      this.customerRequest = {
        place: place,
        outfit: outfit,
        format: format,
        body: body
      };

    }, 500);
  }

  buyPhoto(photo: PhotoShooting): void {
    if (this.canAfford(photo) && photo.corruptionLevel <= this.girl.corruption) {
      this._gameService.updateGolds(photo.price * -1);
      this._shootingService.addPhoto(photo);
    } else {
      this.shakePhoto = photo.name;
      setTimeout(() => {
        this.shakePhoto = '';
      }, 500);
    }
  }

  availablePhotos(): number {
    return this.photos
      .filter(photo => !photo.locked && !this.playedPhotos.map((playedPhoto: PhotoShooting) => playedPhoto.name).includes(photo.name)).length;
  }

  private _computeCombo(photo: PhotoShooting): void {
    if (this.customerRequest !== undefined) {

      if (photo.attributes.place === this.customerRequest.place) {
        this.combo += .5;
        this.place = true;
      } else {
        this.place = false;
        this.combo = Math.max((this.combo - 0.3), .01);
      }

      if (photo.attributes.outfit === this.customerRequest.outfit) {
        this.combo += .8;
        this.outfit = true;
      } else {
        this.outfit = false;
        this.combo = Math.max((this.combo - 0.3), .01);
      }

      if (photo.attributes.format === this.customerRequest.format) {
        this.combo += .3;
        this.format = true;
      } else {
        this.format = false;
        this.combo = Math.max((this.combo - 0.4), .01);
      }

      if (photo.attributes.body.includes(this.customerRequest.body)) {
        this.combo += .3;
        this.body = true;
      } else {
        this.body = false;
        this.combo = Math.max((this.combo - 0.4), .01);
      }

      if (!this.place && !this.outfit && !this.format && !this.body) {
        this.combo = .01;
      }

      this.combo = Math.max(this.combo, .01);

    }
  }

  private async _initializePhotos(): Promise<void> {
    const photoDef: PhotoShooting[] = this.girl.photos;
    this.photoDef = photoDef;
    for (const photo of photoDef) {
      photo.url = this._cachingService.getPhoto(this.girl, photo.name);
      photo.price = this._getPrice(photo);
      photo.golds = this._getGolds(photo);
      photo.fans = this._getFans(photo);

      this.photos.push(photo);
    }

    this.newCustomerRequest();
  }

  private _getGolds(photo: PhotoShooting): number {
    return Math.round(
      (
        (600 * this._getLewdnessModifier(photo)) +
        (500 / this._getAttributeFrequency(photo, 'place')) +
        (400 / this._getAttributeFrequency(photo, 'outfit')) +
        (100 / this._getAttributeFrequency(photo, 'format'))
      ) * this._settingsService.getSetting('shooting_golds_reward')
    );
  }

  private _getFans(photo: PhotoShooting): number {
    return Math.round(
      (
        (1000 * this._getLewdnessModifier(photo)) +
        (100 / this._getAttributeFrequency(photo, 'place')) +
        (100 / this._getAttributeFrequency(photo, 'outfit')) +
        (100 / this._getAttributeFrequency(photo, 'format'))
      ) * this._settingsService.getSetting('shooting_fans_reward')
    );
  }

  private _getAttributeFrequency(photo: PhotoShooting, attribute: string): number {
    return Math.max(
      this.photoDef
        .map((photoDef: PhotoShooting) => photoDef.attributes[attribute as keyof typeof photoDef.attributes].toString())
        .filter((photoAttrib: string) => photoAttrib === photo.attributes[attribute as keyof typeof photo.attributes])
        .length
      , 1
    );
  }

  private _getPrice(photo: PhotoShooting): number {
    return Math.round( ((200 * photo.attributes.body.length) + (2400 * this._getLewdnessModifier(photo))) * this._settingsService.getSetting('shooting_golds_cost') );
  }

  private _getLewdnessModifier(photo: PhotoShooting): number {
    let modifier = 1;

    switch (photo.attributes.type) {
      case 'normal':
        modifier = 0;
        break;
      case 'sexy':
        modifier = 2;
        break;
      case 'slutty':
        modifier = 3;
        break;
      case 'sex':
        modifier = 4;
        break;
      case 'cum':
        modifier = 4;
        break;
    }

    return modifier
  }
}
