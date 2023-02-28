import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { LocalStorageService } from '../services/localStorage.service';
import { SettingsService } from '../services/settings.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    isLoadingResults: boolean = false;
    checked: any =false;
    items!: MenuItem[];
    image_src: any = "assets/images/logo.png";
    username: any = 'Admin';
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        public _authService: AuthService,
        public _router:Router,
        public themeService: ThemeService,
        public localStorageService: LocalStorageService,
        public _setting: SettingsService
    ) {
        if (this.localStorageService.getIsDarkTheme() != null)
            this.checked = this.getBoolean(this.localStorageService.getIsDarkTheme());

        // if (this.localStorageService.getLogoUrl() != null)
        //     this.image_src = this.localStorageService.getLogoUrl();

        if (this.localStorageService.getUserLogin() != null)
            this.username = this.localStorageService.getUserLogin();
    }

    getBoolean(value: any) {
        switch(value) {
            case "true":
                return true;
            default : 
                return false;
        }
    }

    logout(): void {
        this.isLoadingResults = true;
        setTimeout(() => {
            this._authService.logout();
            this._router.navigate(['/login']);
        }, 1000);
    }

    toggleTheme(event: any) {
        this.themeService.switchTheme(event.checked);
    }
    
}
