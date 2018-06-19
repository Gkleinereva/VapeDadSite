import { Injectable } from '@angular/core';

// The comic class that we defined in comic.ts
import { Comic } from './comic';

// Required to use HTTP Client
import { HttpClient, HttpHeaders} from '@angular/common/http';

// REquired to use Observables for HTTP methods
// of required to send an observable back to calling functions on error
import {Observable, of} from 'rxjs';

// catchError used for failed http requests
import {catchError} from 'rxjs/operators';

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

	constructor(private http: HttpClient) { }

	// Uploads a new comic to the server
	addComic(comic: Comic): Observable<Comic> {
		return this.http.post<Comic>(this.comicUrl + '/addComic', comic, this.httpOptions).pipe(
			catchError(this.handleError<Comic>('addComic'))
		);
	}

	uploadImage(file: File): Observable<File> {

		console.log(file);

		const uploadHttpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'multipart/form-data'
				//'Accept': 'application/json'
			})
		};

		return this.http.post<File>(this.comicUrl + '/uploadImage', file, uploadHttpOptions).pipe(
			catchError(this.handleError<File>('uploadImage'))
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

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}
}
