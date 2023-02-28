import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LocalStorageService } from './localStorage.service';
const darkTheme = 'dark-theme';
const themeUrl = 'theme-Url';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document, private localStorageService: LocalStorageService) {}
  switchTheme(theme: any) {
      let themeLink = this.document.getElementById("theme-css") as HTMLLinkElement;
      let logo = this.document.getElementById("logo") as HTMLInputElement;

      if (theme == true) {
        themeLink.href = 'assets/layout/styles/theme/bootstrap4-dark-blue/theme.css';
        logo.src= 'assets/images/logo3.png';
      }
      else {
        themeLink.href = 'assets/layout/styles/theme/lara-light-blue/theme.css';
        logo.src= 'assets/images/logo.png';
      }

      this.localStorageService.setIsDarkTheme(theme);
      this.localStorageService.setLogoUrl(logo.src);
      this.localStorageService.setThemeUrl(themeLink.href);
  }
}
