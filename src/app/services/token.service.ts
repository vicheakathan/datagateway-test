import { Injectable } from '@angular/core';
import { getCookie, setCookie,removeCookie } from 'typescript-cookie';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }
  getToken() {
    return getCookie(ACCESS_TOKEN);
  }

  getRefreshToken() {
    return getCookie(REFRESH_TOKEN);
  } 

  saveToken(token: any): void {
    var date = new Date();
    date.setTime(date.getTime() + (7200 *1000)); // 2*60*60*1000 expires 7200 = 2h
    setCookie(ACCESS_TOKEN, token, { expires: date });
  }

  saveRefreshToken(refreshToken: any): void {
    var date = new Date();
    date.setTime(date.getTime() + (7200 *1000)); // expires 7200 = 2h
    setCookie(REFRESH_TOKEN, refreshToken, { expires: date });
  }

  removeToken(): void {
    removeCookie(ACCESS_TOKEN);
  }

  removeRefreshToken(): void {
    removeCookie(REFRESH_TOKEN);
  }
}
