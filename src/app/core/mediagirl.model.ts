export class MediaGirl {
	girlname = '';
	photos: DataMediaGirl[] = [];
	videos: DataMediaGirl[] = [];
}

export class DataMediaGirl {
	name = '';
	data: Blob = new Blob();
}
