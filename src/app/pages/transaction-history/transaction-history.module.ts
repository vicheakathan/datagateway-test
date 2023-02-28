import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { TransactionHistoryComponent } from './transaction-history.component';

@NgModule({
    imports: [
        CommonModule,
        TransactionHistoryRoutingModule
    ],
    // declarations: [TransactionComponent]
})
export class TransactionHistoryMudule { }

