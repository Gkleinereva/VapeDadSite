import { Injectable } from '@angular/core';

// The comic class that we defined in comic.ts
import { Comic } from './comic';

// Required to use HTTP Client
import { HttpClient, HttpHeaders} from '@angular/common/http';

// REquired to use Observables for HTTP methods
// of required to send an observable back to calling functions on error
import {Observable, of} from 'rxjs';

// catchError used for failed http requests
import { catchError, tap, publishReplay, refCount} from 'rxjs/operators';

// Import the router so that we can redirect when we get a failed API call
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ComicService {

	// Holds the relative URL that API calls should be directed at
	private comicUrl = 'api';

	// HTTP options for PUT and POST requests
	private httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	// Uploads a new comic to the server
	addComic(comic: Comic): Observable<Comic> {
		return this.http.post<Comic>(this.comicUrl + '/addComic', comic, this.httpOptions).pipe(
			catchError(this.handleError<Comic>('addComic'))
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
		return this.http.get<any>(this.comicUrl + '/adminList').pipe(
			catchError(this.handleError<any>('Get Admin List'))
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
}
