import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, Observable, tap, throwError } from 'rxjs';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    private _tokenService: TokenService,
    private _router: Router
  ) { }

  public HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._tokenService.getToken(),
      'Cache-Control': 'no-cache'
    })
  };

  public static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ' + error.status,
        'body was: ' + error.error);
    }
    return throwError(error.error);
  }

  updateSettings(getData: any): Observable<any> {
    return this.http.put<any>(API_URL + 'api/settings', getData, this.HTTP_OPTIONS)
    .pipe(
      tap(response => {
        // console.log(getData);
      }),
      catchError(SettingsService.handleError)
    );
  }

  getSettings() {
    return this.http.get<any>(API_URL + 'api/settings', this.HTTP_OPTIONS)
      .toPromise()
      .then(response => {return response;});
  }
}
