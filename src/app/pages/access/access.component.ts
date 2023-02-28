import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
})
export class AccessComponent { 
    image_src: any = 'assets/images/logo3.png';

    constructor(public localStorageService: LocalStorageService) {
        if (this.localStorageService.getLogoUrl() != null)
            this.image_src = this.localStorageService.getLogoUrl();
    }

}
