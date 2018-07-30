import { Component, OnInit, Input } from '@angular/core';

import{ComicService} from '../comic.service';

// Required to access route parameters
import{ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	// Holds an array of all existing released comic numbers
	comics: number[];

	// Holds the number of the comic currently being displayed
	comicNumber: number;

	constructor(
		public comicService: ComicService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.getComicList();
	}

	// Populates the list of comics and the current comicNumber
	getComicList(): void {
		this.comicService.getComicList()
			.subscribe(list => {
				this.comics = list;

				// If the component was passed a comic number, set it here
				if(this.route.snapshot.paramMap.get('comicNum')) {
					this.comicNumber = +this.route.snapshot.paramMap.get('comicNum');
				}

				// Otherwise, set it to the latest comic
				else {
					this.comicNumber = this.comics[this.comics.length - 1];
				}
			});
	}

}
