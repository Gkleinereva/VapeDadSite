import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-comic',
	templateUrl: './comic.component.html',
	styleUrls: ['./comic.component.css']
})
export class ComicComponent implements OnInit {

	// Contains the html snippet delivered by the API for the current comic
	html: string;

	constructor() { }

	ngOnInit() {
		this.getLatest();
	}

	// Gets the most recent comic for display
	getLatest(): void {

	}

}
