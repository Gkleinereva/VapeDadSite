import { Component, OnInit } from '@angular/core';

import{ComicService} from '../comic.service';
import{TokenPayload} from '../authentication-classes';
import{Router} from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {

	// Initialize our interface since it isn't a class...
	credentials: TokenPayload = {
		email: '',
		password:''
	};

	constructor(
		private auth: ComicService,
		private router: Router
	) { }

	login() {
		this.auth.login(this.credentials).subscribe(() => {
			if(this.auth.isLoggedIn()) {
				this.router.navigateByUrl('/admin');
			}
		});
	}

}
