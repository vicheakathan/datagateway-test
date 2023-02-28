import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {TokenService} from './token.service';
import { environment } from 'src/environments/environment.prod';
import { LocalStorageService } from './localStorage.service';

const OAUTH_CLIENT = 'express-client';
const OAUTH_SECRET = 'express-secret';
const API_URL = environment.api_url;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache,no-store',
    'Pragma': 'no-cache',
    'Vary': 'Accept-Encoding',
    'Request-Context': 'appId=cid-v1:351600bc-d3fe-42d9-b751-a88ea02d8f1c'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = "";
  constructor(
    private http: HttpClient, 
    private tokenService: TokenService,
    private _localStorageService: LocalStorageService,
  ) {
  }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ' + error.status,
        'body was: ' + error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
  private static log(message: string): any {
    console.log(message);
  }

  login(loginData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this._localStorageService.removeUserLogin();
    
    return this.http.post<any>(API_URL + 'api/token', loginData, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this._localStorageService.saveUserLogin(loginData.username);
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }
  
  refreshToken(refreshData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('refresh_token', refreshData.refresh_token)
      .set('grant_type', 'refresh_token');
    return this.http.post<any>(API_URL + 'api/token', body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this._localStorageService.removeUserLogin();
  }
  
  getCompany(): Observable<any> {
    return this.http.get<any>(API_URL + 'api/company')
      .pipe(catchError(AuthService.handleError));
  }
  
  get isLoggedIn(): boolean {
    // let authToken = localStorage.getItem('access_token');
    // return (authToken !== null) ? true : false;
    let authToken = this.tokenService.getToken();
    return (authToken !== undefined) ? true : false;
  }
}
