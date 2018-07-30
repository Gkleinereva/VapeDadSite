import { Component, OnInit } from '@angular/core';

import {ComicService} from '../comic.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	constructor(
		public comicService: ComicService
	) { }

	ngOnInit() {
	}

}
