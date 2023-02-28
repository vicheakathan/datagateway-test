import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CompanyComponent }
    ])],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
