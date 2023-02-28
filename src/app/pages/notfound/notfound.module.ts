import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { NotFoundRoutingModule } from './notfound-routing.module';
import { NotfoundComponent } from './notfound.component';

@NgModule({
    imports: [
        CommonModule,
        NotFoundRoutingModule,
        ButtonModule
    ],
    declarations: [NotfoundComponent]
})
export class NotFoundModule { }
