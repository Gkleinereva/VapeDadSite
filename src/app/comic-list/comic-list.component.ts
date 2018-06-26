import { Component, OnInit } from '@angular/core';
import{ComicService} from '../comic.service';

@Component({
	selector: 'app-comic-list',
	templateUrl: './comic-list.component.html',
	styleUrls: ['./comic-list.component.css']
})
export class ComicListComponent implements OnInit {

	// Holds the array of comic numbers retrieved from the API
	comicNumbers: number[];
	// Holds the date of the most recent comic
	latestReleaseDate: string;

	constructor(
		private comicService: ComicService
	) { }

	ngOnInit() {
		this.getComicInfo();
	}

	// Retrieves the existing comic info from the API
	getComicInfo(): void {
		this.comicService.getComicAdminData()
			.subscribe(json => {
				this.comicNumbers = json.comics;
				this.latestReleaseDate = json.latestDate;
			});
	}

}
