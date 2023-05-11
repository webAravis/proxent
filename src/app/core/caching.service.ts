import { Injectable } from '@angular/core';
import { GirlsService } from './girls/girls.service';
import { Girl } from './girls/girl.model';
import { HttpClient } from '@angular/common/http';
import { MediaGirl, DataMediaGirl } from './mediagirl.model';
import { BehaviorSubject, Observable, finalize, of } from 'rxjs';
import { PhotoShooting } from '../shooting/shooting.component';
import { Position } from './position.model';

interface CacheMediaRequest {
	girl: Girl;
	type: string;
	name: string;
	request: Observable<Blob>;
}

@Injectable({
	providedIn: 'root',
})
export class CachingService {
	medias: MediaGirl[] = [];

	toLoad: CacheMediaRequest[] = [];
	girlLoading: string[] = [];
	loaded = 0;
	loadedPercent: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	constructor(
		private _girlService: GirlsService,
		private _httpClient: HttpClient
	) {
		this._girlService.gameGirls.subscribe((girls) => this.cacheMedias(girls));
	}

	getProgress(type: string): number {
		let percent = 0;
		const requestsByType = this.toLoad.filter(
			(loadRequest: CacheMediaRequest) => loadRequest.type === type
		);

		percent =
			requestsByType.length > 0
				? (this.loaded / requestsByType.length) * 100
				: 100;

		percent = Math.round(percent);

		return percent;
	}

	getPhoto(girlname: string, name: string): Blob | undefined {
		const girlMedia = this.medias.find((media) => media.girlname === girlname);
		if (girlMedia === undefined) {
			return new Blob();
		}

		return girlMedia.photos.find((photoMedia) => photoMedia.name === name)
			?.data;
	}

	getVideo(girlname: string, name: string): Blob | undefined {
		const girlMedia = this.medias.find((media) => media.girlname === girlname);
		if (girlMedia === undefined) {
			return new Blob();
		}

		return girlMedia.videos.find((videoMedia) => videoMedia.name === name)
			?.data;
	}

	getAllPhotos(girlname: string, corruptionName: string): Blob[] {
		const girlMedia = this.medias.find((media) => media.girlname === girlname);
		if (girlMedia === undefined) {
			return [];
		}

		return girlMedia.photos
			.filter((photo) => photo.name.includes(corruptionName))
			.map((photo) => photo.data);
	}

	async cacheMedias(girls: Girl[]): Promise<void> {
		this.toLoad = [];
		this.loaded = 0;

		for (const girl of girls) {
			if (
				!this.medias.some((media) => media.girlname === girl.name) &&
				!this.girlLoading.includes(girl.name)
			) {
				await this.cache(girl);
			}
		}

		this.loadAll('portrait');
	}

	async cache(girl: Girl): Promise<void> {
		this.girlLoading.push(girl.name);
		await this.cachePhotos(girl);
    await this.cacheVideos(girl);
	}

	loadAll(typeToLoad: string): void {
		let nextToLoad = '';
		const requestsByType = this.toLoad.filter(
			(loadRequest: CacheMediaRequest) => loadRequest.type === typeToLoad
		);
		switch (typeToLoad) {
			case 'portrait': {
				nextToLoad = 'photo';
				break;
			}
			case 'photo': {
				nextToLoad = 'video';
				break;
			}
		}

		for (const loadRequest of requestsByType) {
			loadRequest.request
				.pipe(
					finalize(() => {
						this.loaded++;
						this.loadedPercent.next(this.getProgress(typeToLoad));
						this.getProgress(typeToLoad) === 100 && nextToLoad !== ''
							? this.loadAll(nextToLoad)
							: undefined;
					})
				)
				.subscribe((data: Blob) => {
					this._handleDataRequest(data, loadRequest);
				});
		}
	}
	private _handleDataRequest(data: Blob, loadRequest: CacheMediaRequest) {
		const photoGirl = new DataMediaGirl();
		photoGirl.name = loadRequest.name;
		photoGirl.data = data;

		let mediasGirl = this.medias.find(
			(media) => media.girlname === loadRequest.girl.name
		);

		if (mediasGirl === undefined) {
			mediasGirl = new MediaGirl();
			mediasGirl.girlname = loadRequest.girl.name;
		}

		if (loadRequest.type === 'photo' || loadRequest.type === 'portrait') {
			mediasGirl.photos.push(photoGirl);
		}
		if (loadRequest.type === 'video') {
			mediasGirl.videos.push(photoGirl);
		}

		this.medias = this.medias.filter(
			(media) => media.girlname !== loadRequest.girl.name
		);
		this.medias.push(mediasGirl);
	}

	async cachePhotos(girl: Girl): Promise<void> {
    const photoDefModule = await import(`../shooting/photosdef/${girl.name.toLowerCase()}.json`);
    if (photoDefModule === null || !photoDefModule.default) {
      return;
    }

    const photoDef: PhotoShooting[] = photoDefModule.default;
    for (const photo of photoDef) {
      const url =
					'https://proxentgame.com/medias/' +
					girl.name.toLowerCase() +
					'/photos/' +
					photo.name +
					'.jpg';
				this.toLoad.push({
					girl: girl,
					type: photo.name.startsWith('1_normal') ? 'portrait' : 'photo',
					name: photo.name,
					request: this._httpClient.get(url, { responseType: 'blob' }),
				});
    }
	}

	async cacheVideos(girl: Girl): Promise<void> {
    const positionDefModule = await import(`./girls/timings/${girl.name.toLowerCase()}_timing_record.json`);
    if (positionDefModule === null || !positionDefModule.default) {
      return;
    }

    const positionDef: Position[] = positionDefModule.default;

		// const positions = [
		// 	'blowjob',
		// 	'boobjob',
		// 	'cowgirl',
		// 	'doggy',
		// 	'doggy2',
		// 	'intro',
		// 	'masturbate',
		// 	'missionary',
		// 	'orgasm',
		// 	'reversecowgirl',
		// 	'rub',
		// 	'standing',
		// 	'tease',
		// ];
		for (const position of positionDef) {
			const url =
				'https://proxentgame.com/medias/' +
				girl.name.toLowerCase() +
				'/videos/record/' +
				position.name +
				'.webm';
			this.toLoad.push({
				girl: girl,
				type: 'video',
				name: position.name,
				request: this._httpClient.get(url, { responseType: 'blob' }),
			});
		}
	}
}
