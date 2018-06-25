import { Component, OnInit, Input } from '@angular/core';
import { ComicService } from '../comic.service';

//Required to leave CSS in imported code
import{DomSanitizer, SafeHtml} from '@angular/platform-browser';

// Required to access route parameters
import{ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-comic',
	templateUrl: './comic.component.html',
	styleUrls: ['./comic.component.css']
})
export class ComicComponent implements OnInit {

	// Contains the html snippet delivered by the API for the current comic
	html: SafeHtml;

	// Used whenever a comic number is specified from the Menu component or from a route
	@Input() comicNumber: number;

	constructor(
		private comicService: ComicService, 
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute
		) { }

	ngOnInit() {
		if(this.route.snapshot.paramMap.get('comicNum')) {
			this.getComic();
		}
		else {
			this.getLatest();
		}
	}

	// Gets the most recent comic for display
	getLatest(): void {
		this.comicService.getLatest()
			.subscribe(comic => this.html = this.sanitizer.bypassSecurityTrustHtml(comic));
	}

	// Gets a comic by the comic number
	getComic(): void {
		this.comicNumber = +this.route.snapshot.paramMap.get('comicNum');
		this.comicService.getComic(this.comicNumber)
			.subscribe(comic => this.html = this.sanitizer.bypassSecurityTrustHtml(comic));
	}

}
