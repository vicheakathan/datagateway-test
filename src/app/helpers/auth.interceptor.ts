import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {TokenService} from 'src/app/services/token.service';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private tokenService: TokenService,
        private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        const token = this.tokenService.getToken();
        const refreshToken = this.tokenService.getRefreshToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                Authorization: 'Bearer ' + token
                }
            });
        }
        if (!request.headers.has('Content-Type')) {
            request = request.clone({
              setHeaders: {
                'content-type': 'application/json'
              }
            });
        }
        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('event--->>>', event.statusText);
            }
            return event;
        }),
        catchError((err: HttpErrorResponse) => {
            console.log(err);
            if (err.ok == false) {
                this.router.navigate(["/error/access"]);
            }
            else {
                this.authService.logout();
                this.router.navigate(["/login"]);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
        
    }

}