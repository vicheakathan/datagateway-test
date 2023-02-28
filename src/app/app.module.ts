import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { AppLayoutModule } from 'src/app/pages/sidebar/app.layout.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from "primeng/calendar";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import {SkeletonModule} from 'primeng/skeleton';
import { PaginatorModule } from "primeng/paginator";
import {BadgeModule} from 'primeng/badge';
import {SplitButtonModule} from 'primeng/splitbutton';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import {ChartModule} from 'primeng/chart';
import { NgChartsModule } from 'ng2-charts';



// app

import { AuthInterceptor } from './helpers/auth.interceptor';
import { CompanyComponent } from './pages/company/company.component';
import { TenantComponent } from './pages/tenant/tenant.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { SettingComponent } from './pages/setting/setting.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
    declarations: [
        AppComponent, 
        NotfoundComponent,
        CompanyComponent,
        TenantComponent,
        TransactionComponent,
        TransactionHistoryComponent,
        SettingComponent,
        DashboardComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserModule,

        FormsModule,
        SkeletonModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		CalendarModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
		FileUploadModule,
		ToolbarModule,
		DialogModule,
		InputTextareaModule,
		InputNumberModule,
		RadioButtonModule,
        ReactiveFormsModule,
        PaginatorModule,
        BadgeModule,
        SplitButtonModule,
        CheckboxModule,
        FieldsetModule,
        TabViewModule,
        ChartModule,
        NgChartsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }