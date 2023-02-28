import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { filter, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        private primengConfig: PrimeNGConfig,
        private router: Router, 
        private activatedRoute: ActivatedRoute, 
        private titleService: Title,
        public authService: AuthService,
        private _setting: SettingsService
    ) {
        const favIcon  = document.querySelector('#favIcon') as HTMLLinkElement;
        
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let child = this.activatedRoute.firstChild;
                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                    } else if (child.snapshot.data &&    child.snapshot.data['title']) {
                        return child.snapshot.data['title'];
                    } else {
                        return null;
                    }
                }
                return null;
            })
        ).subscribe( (data: any) => {
            if (data) {
                this._setting.getSettings().then(response => {
                    this.titleService.setTitle(data + ' - ' + response[0].siteTitle);
                    favIcon.href = 'assets/images/' + response[0].icon; 
                });
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
