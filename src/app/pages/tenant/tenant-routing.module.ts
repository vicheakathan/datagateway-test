import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TenantComponent } from './tenant.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TenantComponent }
    ])],
    exports: [RouterModule]
})
export class TenantRoutingModule { }
