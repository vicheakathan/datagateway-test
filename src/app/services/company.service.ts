import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from './token.service';
import { LocalStorageService } from './localStorage.service';
import { CompanyModel } from 'src/app/models/company';

const API_URL = environment.api_url;
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private _tokenService: TokenService,
    private _http: HttpClient,
    public _localStorageService: LocalStorageService
  ) { }

  public HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._tokenService.getToken(),
      'Cache-Control': 'no-cache'
    })
  };

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ' + error.status,
        'body was: ' + error.error);
    }
    return throwError(error.error);
  }

  updateCompany(getData: any): Observable<any> {
    return this._http.put<any>(API_URL + 'api/company', getData, this.HTTP_OPTIONS)
      .pipe(
        tap(response => {
          const data = {
            message: "Company updated"
          };
          this._localStorageService.saveNotification(data);
        }),
        catchError(CompanyService.handleError)
      );
  }

  addCompany(getData: any): Observable<any> {
    return this._http.post<any>(API_URL + 'api/company', getData, this.HTTP_OPTIONS)
      .pipe(
        tap(response => {
          const data = {
            message: "Company added"
          };
          this._localStorageService.saveNotification(data);
        }),
        catchError(CompanyService.handleError)
      );
  }

  getCompany(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string, search: any): Observable<any> {
    var dateFilter = "";
    var searchFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }
    if (search != "" || search !== undefined) {
      searchFilter = "&search=" + search;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + dateFilter + searchFilter;
    
    return this._http.get<CompanyModel[]>(API_URL + 'api/company' + param, this.HTTP_OPTIONS)
      .pipe(catchError(CompanyService.handleError));
  }

  getAllCompany_v2(): Observable<any> {
    return this._http.get<CompanyModel[]>(API_URL + 'api/company/getAllCompany', this.HTTP_OPTIONS)
      .pipe(catchError(CompanyService.handleError));
  }
  get() {
    return this._http.get<any>(API_URL + 'api/company/getAllCompany', this.HTTP_OPTIONS)
      .toPromise()
      .then(res => res as CompanyModel[])
      .then(data => data);
  }
  get_v2(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string, search: any) {
    var dateFilter = "";
    var searchFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }
    if (search != "" || search !== undefined) {
      searchFilter = "&search=" + search;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + dateFilter + searchFilter;
    return this._http.get<any>(API_URL + 'api/company' + param, this.HTTP_OPTIONS)
      .toPromise()
      .then(response => {return response;});
  }
}