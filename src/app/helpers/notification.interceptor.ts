import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

  constructor(private _toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // console.log(event);
        if (event instanceof HttpResponse && event.status === 200) {
          // this._toastr.success("...", "Success");
        }
      })
    );
  }
}
