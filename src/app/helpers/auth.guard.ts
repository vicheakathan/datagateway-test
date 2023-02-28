import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from 'src/app/services/auth.service';
import {TokenService} from 'src/app/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    public tokenService: TokenService, 
    private router: Router,
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): any {
    if (this.tokenService.getRefreshToken()) {
      return true;
    }
    // this.authService.redirectUrl = url;
    this.router.navigate(['/login']).then(_ => false);
  }
}
