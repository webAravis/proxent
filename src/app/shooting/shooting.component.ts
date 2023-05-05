import { GirlsService } from './../core/girls/girls.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Girl } from '../core/girls/girl.model';
import { RewardService } from '../reward/reward.service';
import { Subject, takeUntil } from 'rxjs';
import { GameService } from '../core/game.service';
import { CachingService } from '../core/caching.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export class PhotoShooting {
  name = '';
  url: SafeUrl | undefined;
  attributes: {
    type: string,
    place: string,
    outfit: string,
    body: string[],
    format: string
  } = {type: '', place: '', outfit: '', body: [], format: ''};
  price = 0;
  golds = 0;
  fans = 0
}

@Component({
  selector: 'app-shooting',
  templateUrl: './shooting.component.html',
  styleUrls: ['./shooting.component.scss'],
})
export class ShootingComponent implements OnInit, OnDestroy {

  girl = new Girl();

  photos: PhotoShooting[] = [];
  photoDef: PhotoShooting[] = [];
  playedPhotos: PhotoShooting[] = [];

  combo = 1;

  customerRequest: {place: string, outfit: string, body: string, format: string} | undefined;

	private _golds = 0;
  private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _router: Router,
    private _girlsService: GirlsService,
    private _rewardService: RewardService,
    private _gameService: GameService,
    private _cachingService: CachingService,
    private _sanitizer: DomSanitizer
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

  isLocked(photo: PhotoShooting): boolean {
    return true;
  }

  isUnlockable(photo: PhotoShooting): boolean {
    return photo.price <= this._golds;
  }

  playPhoto(photo: PhotoShooting): void {
    this.playedPhotos.push(photo);
    this.photos = this.photos.filter(availablePhoto => photo.name !== availablePhoto.name);

    this._computeCombo(photo);
  }

  endShooting(): void {
    const goldsWon = this.playedPhotos.map((photo: PhotoShooting) => photo.golds).reduce((acc, current) => acc + current, 0) * this.combo;
    const fansWon = this.playedPhotos.map((photo: PhotoShooting) => photo.fans).reduce((acc, current) => acc + current, 0) * this.combo;

    const xpWon = 50 + (100 * this.girl.popularity) + (100 * this.girl.level);

		this.girl.shootingCount++;
    this._rewardService.giveReward(fansWon, 0, goldsWon, [], xpWon, this.girl);

		this._gameService.resumeGame();
		this._router.navigate(['girls']);
  }

  newCustomerRequest(): void {
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

  private _computeCombo(photo: PhotoShooting): void {
    if (this.customerRequest !== undefined) {

      if (photo.attributes.place === this.customerRequest.place) {
        this.combo = this.combo * 1.1;
      } else {
        this.combo = Math.max((this.combo - 0.5), 1);
      }

      if (photo.attributes.outfit === this.customerRequest.outfit) {
        this.combo = this.combo * 1.1;
      } else {
        this.combo = Math.max((this.combo - 0.5), 1);
      }

      if (photo.attributes.format === this.customerRequest.format) {
        this.combo = this.combo * 1.1;
      } else {
        this.combo = Math.max((this.combo - 0.5), 1);
      }

      if (photo.attributes.body.includes(this.customerRequest.format)) {
        this.combo = this.combo * 1.1;
      } else {
        this.combo = Math.max((this.combo - 0.5), 1);
      }

      this.combo = Math.max(this.combo, 1);

    }
  }

  private async _initializePhotos(): Promise<void> {
    const photoDefModule = await import(`./photosdef/${this.girl.name.toLowerCase()}.json`);
    if (photoDefModule === null || !photoDefModule.default) {
      return;
    }

    const photoDef: PhotoShooting[] = photoDefModule.default;
    this.photoDef = photoDef;
    for (const photo of photoDef) {
      photo.url = this._getUrl(photo);
      photo.price = this._getPrice(photo);
      photo.golds = this._getGolds(photo);
      photo.fans = this._getFans(photo);

      this.photos.push(photo);
    }

    this.newCustomerRequest();
  }

  private _getGolds(photo: PhotoShooting): number {
    return Math.round(
      (600 * this._getLewdnessModifier(photo)) +
      (750 / this._getAttributeFrequency(photo, 'place')) +
      (500 / this._getAttributeFrequency(photo, 'outfit')) +
      (1000 / this._getAttributeFrequency(photo, 'format'))
    );
  }

  private _getFans(photo: PhotoShooting): number {
    return Math.round(
      (1000 * this._getLewdnessModifier(photo)) +
      (100 / this._getAttributeFrequency(photo, 'place')) +
      (100 / this._getAttributeFrequency(photo, 'outfit')) +
      (100 / this._getAttributeFrequency(photo, 'format'))
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
    return Math.round( (100 * photo.attributes.body.length) + (1000 * this._getLewdnessModifier(photo)) );
  }

  private _getLewdnessModifier(photo: PhotoShooting): number {
    let modifier = 1;

    switch (photo.attributes.type) {
      case 'normal':
        modifier = 1;
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

  private _getUrl(photo: PhotoShooting): SafeUrl {
    const blobDatas = this._cachingService.getPhoto(this.girl.name, photo.name);
    if (blobDatas) {
      const objectURL = URL.createObjectURL(blobDatas);
      return this._sanitizer.bypassSecurityTrustUrl(objectURL);
    }

    return this._sanitizer.bypassSecurityTrustUrl('http://proxentgame.com/medias/placeholder.jpg');
  }
}
