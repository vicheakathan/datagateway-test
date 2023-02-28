import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';


@NgModule({
    imports: [
        CommonModule,
        TenantRoutingModule,
    ],
    // declarations: [TenantComponent]
})
export class TenantMudule { }

