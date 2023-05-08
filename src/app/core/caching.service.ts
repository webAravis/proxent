import { Injectable } from '@angular/core';
import { GirlsService } from './girls/girls.service';
import { Girl } from './girls/girl.model';
import { HttpClient } from '@angular/common/http';
import { MediaGirl, DataMediaGirl } from './mediagirl.model';
import { BehaviorSubject, Observable, finalize } from 'rxjs';

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

	cacheMedias(girls: Girl[]): void {
		this.toLoad = [];
		this.loaded = 0;

		for (const girl of girls) {
			if (
				!this.medias.some((media) => media.girlname === girl.name) &&
				!this.girlLoading.includes(girl.name)
			) {
				this.cache(girl);
			}
		}

		this.loadAll('portrait');
	}

	cache(girl: Girl): void {
		this.girlLoading.push(girl.name);
		this.cachePhotos(girl);
		// this.cacheVideos(girl);
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

	cachePhotos(girl: Girl): void {
		const corruptionLevels = ['normal', 'sexy', 'slutty'];
		for (const corruptionName of corruptionLevels) {
			for (let index = 1; index <= 10; index++) {
				const url =
					'https://proxentgame.com/medias/' +
					girl.name.toLowerCase() +
					'/photos/' +
					index +
					'_' +
					corruptionName +
					'.jpg';
				this.toLoad.push({
					girl: girl,
					type: index === 1 ? 'portrait' : 'photo',
					name: index + '_' + corruptionName,
					request: this._httpClient.get(url, { responseType: 'blob' }),
				});
			}
		}
	}

	cacheVideos(girl: Girl): void {
		const positions = [
			'blowjob',
			'boobjob',
			'cowgirl',
			'doggy',
			'doggy2',
			'intro',
			'masturbate',
			'missionary',
			'orgasm',
			'reversecowgirl',
			'rub',
			'standing',
			'tease',
		];
		for (const position of positions) {
			const url =
				'https://proxentgame.com/medias/' +
				girl.name.toLowerCase() +
				'/videos/record/' +
				position +
				'.webm';
			this.toLoad.push({
				girl: girl,
				type: 'video',
				name: position,
				request: this._httpClient.get(url, { responseType: 'blob' }),
			});
		}
	}
}
