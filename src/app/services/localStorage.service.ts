import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { getCookie, setCookie,removeCookie } from 'typescript-cookie'


const notification = 'notification';
const username = 'username';
const error = 'error';
const darkTheme = 'dark-theme';
const themeUrl = 'theme-url';
const logoUrl = 'logo-url';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  getNotification() {
    return localStorage.getItem(notification);
  }
  saveNotification(token: any): void {
    localStorage.setItem(notification, token.message);
  }
  removeNotification(): void {
    localStorage.removeItem(notification);
  }

  getUserLogin() {
    return localStorage.getItem(username);
  }
  saveUserLogin(token: any): void {
    localStorage.setItem(username, token);
  }
  removeUserLogin(): void {
    localStorage.removeItem(username);
  }

  setCookie(token: string): void {
    setCookie('name', token);
  }
  getCookie() {
    return getCookie('name');
  }
  removeCookie(): void {
    removeCookie('name')
  }
  setError(token: string): void {
    localStorage.setItem(error, token);
  }
  getError() {
    return localStorage.getItem(error);
  }
  setThemeUrl(str: any): void{
    return localStorage.setItem(themeUrl, str);
  }
  getThemeUrl(){
    return localStorage.getItem(themeUrl);
  }
  setIsDarkTheme(str: any): void{
    return localStorage.setItem(darkTheme, str);
  }
  getIsDarkTheme(){
    return localStorage.getItem(darkTheme);
  }
  setLogoUrl(str: any): void{
    return localStorage.setItem(logoUrl, str);
  }
  getLogoUrl(){
    return localStorage.getItem(logoUrl);
  }
}
