import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Dashbaord', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Company', icon: 'pi pi-fw pi-building', routerLink: ['/company'] },
                    { label: 'Tenant', icon: 'pi pi-fw pi-user', routerLink: ['/tenant'] },
                    { label: 'Mall Transaction History', icon: 'pi pi-fw pi-history', routerLink: ['/transaction-history'] },
                    { label: 'Transaction Log', icon: 'pi pi-fw pi-dollar', routerLink: ['/transaction-log'] },
                ]
            }, 
        ];
    }
}
