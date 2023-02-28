import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalStorageService } from './localStorage.service';
import { TokenService } from './token.service';
const darkTheme = 'dark-theme';
const themeUrl = 'theme-Url';
const API_URL = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  uploadPercent: any;
  constructor(
    private http: HttpClient,
    private _tokenService: TokenService,
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
  
  public uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    let fileId = `${image.name}-${image.lastModified}`;
    let headers = new HttpHeaders({
      size: image.size.toString(),
      "x-file-id": fileId,
      name: image.name
    });

    return this.http.get(API_URL + 'status', { headers: headers })
      .pipe(
        tap((res:any) => {
          // if (res.status === "file is present") {
          //   alert("File already exists. Please choose a different file.");
          //   return;
          // }
    
          let uploadedBytes = res.uploaded;
          let headers2 = new HttpHeaders({
            size: image.size.toString(),
            "x-file-id": fileId,
            "x-start-byte": uploadedBytes.toString(),
            name: image.name
          });
    
          const req = new HttpRequest(
            "POST",
            API_URL + "upload",
            image.slice(uploadedBytes, image.size + 1),
            {
              headers: headers2,
              reportProgress: true
            }
          );
    
          this.http.request(req).subscribe(
            (res: any) => {
              return res;
            },
            err => {}
          );
        }),
        catchError(UploaderService.handleError)
    );
  }
}
