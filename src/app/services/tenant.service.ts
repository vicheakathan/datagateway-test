import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CompanyService } from './company.service';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment.prod';
import { TenantModel } from 'src/app/models/tenant';
import { LocalStorageService } from './localStorage.service';
import { Router } from '@angular/router';

const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  redirectUrl = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private http: HttpClient,
    private _CompanyService: CompanyService,
    private _tokenService: TokenService,
    public _localStorageService: LocalStorageService,
    private _router: Router
  ) {}

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

  updateTenant(getData: any): Observable<any> {
    return this.http.put<any>(API_URL + 'api/tanant', getData, this.HTTP_OPTIONS)
      .pipe(
        tap(response => {
          console.log(getData);
        }),
        catchError(TenantService.handleError)
      );
  }

  addTenant(getData: any): Observable<any> {
    return this.http.post<any>(API_URL + 'api/tanant', getData, this.HTTP_OPTIONS)
      .pipe(
        tap(response => {
          console.log(response);
        }),
        catchError(TenantService.handleError)
      );
  }
  
  changePassword(getData: any): Observable<any> {
    return this.http.put<any>(API_URL + 'api/tanant/changepassword/tanant/' + getData.id, getData, this.HTTP_OPTIONS)
      .pipe(
        tap(response => {
          const str = {
            message: "Password changed"
          };
          this._localStorageService.saveNotification(str);
        }),
        catchError(TenantService.handleError)
      );
  }

  getAllCompany(): Observable<any> {
    return this._CompanyService.getAllCompany_v2();
  }

  getTenant(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string, search: any): Observable<any> {
    var dateFilter = "";
    var searchFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }
    if (search != "" || search !== undefined) {
      searchFilter = "&search=" + search;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + dateFilter + searchFilter;
    
    return this.http.get<TenantModel[]>(API_URL + 'api/tanant' + param, this.HTTP_OPTIONS)
      .pipe(catchError(TenantService.handleError));
  }
  getTenant_v2(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string, search: any) {
    var dateFilter = "";
    var searchFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }
    if (search != "" || search !== undefined) {
      searchFilter = "&search=" + search;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + dateFilter + searchFilter;
    
    return this.http.get<any>(API_URL + 'api/tanant' + param, this.HTTP_OPTIONS)
      .toPromise()
      .then(response => {return response;});
  }
  
  decryptPassword(id: any): Observable<any> {
    return this.http.get<any[]>(API_URL + 'api/tanant/decryptPasswords/' + id, this.HTTP_OPTIONS)
      .pipe(
        catchError(TenantService.handleError)
      );
  }
}
