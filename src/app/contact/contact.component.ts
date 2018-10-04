import { Component, OnInit } from '@angular/core';
import{ComicService} from '../comic.service';

import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import{Contact} from '../comic';
import{Router} from '@angular/router';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

	contactForm: FormGroup;

	constructor(
		public comicService: ComicService,
		private fb: FormBuilder,
		private router: Router
	) { }

	ngOnInit() {
		this.CreateForm();
	}

	CreateForm() {
		this.contactForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			message: ['', Validators.required]
		});
	}

	OnSubmit() {
		this.comicService.SendContact(this.contactForm.value).subscribe(() => {
			this.router.navigate(['/messageSent']);
		});
	}

}
