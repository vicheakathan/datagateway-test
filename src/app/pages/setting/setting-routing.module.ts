import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { Fieldset } from 'primeng/fieldset';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SettingComponent }
    ])],
    exports: [RouterModule]
})
export class SettingRoutingModule { }
