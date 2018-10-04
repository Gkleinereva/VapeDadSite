export class Comic {
	id = 0;
	comicNum = 0;
	releaseDate = '';
	images: Image[];
	imageData: ImageData[];
}

export class Image {
	image= '';
	locations = '';
}

export class ImageData {
	filename = '';
	filetype = '';
	value = '';
}

export class Contact {
	name = '';
	email = '';
	message = '';
}
