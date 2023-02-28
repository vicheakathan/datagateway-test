import { Component } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    currentYear: number=new Date().getFullYear();
    constructor(public layoutService: LayoutService) { }
}
