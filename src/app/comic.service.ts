import { Injectable } from '@angular/core';

// The comic class that we defined in comic.ts
import { Comic, Contact } from './comic';

// Required to use HTTP Client
import { HttpClient, HttpHeaders} from '@angular/common/http';

// REquired to use Observables for HTTP methods
// of required to send an observable back to calling functions on error
import {Observable, of} from 'rxjs';

// catchError used for failed http requests
import { catchError, tap, publishReplay, refCount, map} from 'rxjs/operators';

// Import the router so that we can redirect when we get a failed API call
import { Router } from '@angular/router';

// Classes required for authentication 
import{UserDetails, TokenResponse, TokenPayload} from './authentication-classes'

@Injectable({
	providedIn: 'root'
})
export class ComicService {

	// Holds the relative URL that API calls should be directed at
	private comicUrl = 'api';

	// Variable to store the user's token while they're authenticated
	private token: string;

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	// Uploads a new comic to the server
	addComic(comic: Comic): Observable<any> {
		return this.http.post<Comic>
			(
				this.comicUrl + '/addComic',
				comic, 
				{headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken()}}
			).pipe(
				catchError(this.handleError<any>('addComic'))
			);
	}

	// Asks the server for the html of the latest comic
	getLatest(): Observable<string> {
		// We don't need a <string> below since we're sending a header with our desired responseType
		// I guess http.get() returns an observable, hence our  return type is still correct
		return this.http.get(this.comicUrl + '/getLatest', {responseType: 'text'}).pipe(
			catchError(this.handleError<string>('getLatest'))
		);
	}

	// Get's a comic from the server by it's comicNmumber
	getComic(comicNum: number): Observable<string> {
		return this.http.get(this.comicUrl + '/comic/' + comicNum, {responseType: 'text'}).pipe(
			catchError(this.handleError<string>('getComic'))
		);
	}

	// Gets the array of released comic numbers
	getComicList(): Observable<number[]> {
		return this.http.get<number[]>(this.comicUrl + '/list').pipe(
			catchError(this.handleError<number[]>('Get Comic List'))
		);
	}

	// Gets the complete comic information for the admin page
	getComicAdminData(): Observable<any> {
		return this.http.get<any>
			(
				this.comicUrl + '/adminList', 
				{headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken()}}
			).pipe(
				catchError(this.handleError<any>('Get Admin List'))
		);
	}

	deleteComic(comicNum: Number): Observable<Comic> {
		return this.http.delete<Comic>
			(
				this.comicUrl + '/comic/' + comicNum,
				{headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken()}}
			).pipe(
				catchError(this.handleError<Comic>('Delete Comic'))
		);
	}

	getDateAndLink(comicNum: Number): Observable<any> {
		return this.http.get(this.comicUrl + '/comicDateAndLink/' + comicNum).pipe(
			catchError(this.handleError<any>('getDateandLink'))
		);
	}

	getLatestNumber(): Observable<any> {
		return this.http.get(this.comicUrl + '/getLatestNumber').pipe(
			catchError(this.handleError<any>('get latest number'))
		);
	}

	SendContact(contactData: Contact): Observable<Contact> {
		return this.http.post<Contact>(this.comicUrl + '/contact', contactData).pipe(
			catchError(this.handleError<Contact>('Contact'))
		);
	}

	/*
	* Handle Http operation that failed.
	* Let the app continue.
	* @param operation - name of the operation that failed
	* @param result - optional value to return as the observable result
	*/
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			console.log(`${operation} failed: ${error.message}`);

			// Redirect to NotFound component whenever we get an API error
			this.router.navigate(['/404']);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	// Token handling methods
	private saveToken(token: string): void {
		localStorage.setItem('mean-token', token);
		this.token = token;
	}

	private getToken(): string {
		if(!this.token) {
			this.token = localStorage.getItem('mean-token');
		}

		return this.token;
	}

	public getUserDetails(): UserDetails {
		const token = this.getToken();
		let payload;
		if(token) {
			payload = token.split('.')[1];
			payload = window.atob(payload);
			return JSON.parse(payload);
		}

		else {
			return null;
		}
	}

	public isLoggedIn(): boolean {
		const user = this.getUserDetails();
		if(user) {
			return user.exp > Date.now()/1000;
		}

		else {
			return false;
		}
	}

	public login(user: TokenPayload): Observable<any> {

		// Base of login request
		let base = this.http.post(this.comicUrl + '/login', user);

		// Using .pipe(), we'll save off the token after we get the response back
		const request = base.pipe(
			map((data: TokenResponse) => {
				if(data.token) {
					this.saveToken(data.token);
				}
				return data;
			}),
			catchError(this.handleError<any>('Incorrect Login Credentials'))
		);

		return request;
	}

	public logout(): void {
		this.token = '';
		window.localStorage.removeItem('mean-token');
		this.router.navigateByUrl('/main');
	}
}
