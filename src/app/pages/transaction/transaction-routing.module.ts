import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TransactionComponent }
    ])],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
