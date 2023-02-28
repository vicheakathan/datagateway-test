import { Injectable } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private _loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    this.totalRequests++;
    this._loadingService.setLoading(true);
    return next.handle(request).pipe(
      delay(800),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this._loadingService.setLoading(false);
        }
      })
    );
  }
}
