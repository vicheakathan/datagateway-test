import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from 'src/app/pages/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './helpers/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent, canActivate: [AuthGuard],
                children: [
                    { 
                        path: '', 
                        data: {
                            title: 'Dashboard'
                        }, 
                        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardMudule) 
                    },
                    { 
                        path: 'company', 
                        data: {
                            title: 'Company'
                        }, 
                        loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyMudule) 
                    },
                    { 
                        path: 'tenant', 
                        data: {
                            title: 'Tenant'
                        }, 
                        loadChildren: () => import('./pages/tenant/tenant.module').then(m => m.TenantMudule) 
                    },
                    { 
                        path: 'transaction-log', 
                        data: {
                            title: 'Transaction Log'
                        }, 
                        loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionMudule) 
                    },
                    { 
                        path: 'transaction-history', 
                        data: {
                            title: 'Transaction History'
                        }, 
                        loadChildren: () => import('./pages/transaction-history/transaction-history.module').then(m => m.TransactionHistoryMudule) 
                    },
                    { 
                        path: 'settings', 
                        data: {
                            title: 'Settings'
                        }, 
                        loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingMudule) 
                    },
                ]
            },
            { 
                path: 'error/access', 
                data: {
                    title: 'Error'
                }, 
                canActivate: [AuthGuard], 
                loadChildren: () => import('./pages/access/access.module').then(m => m.AccessModule) 
            },
            { 
                path: 'login', 
                data: {
                    title: 'Login'
                }, 
                loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) 
            },
            { 
                path: 'notfound',
                data: {
                    title: 'Page Not Found'
                }, 
                canActivate: [AuthGuard], 
                loadChildren: () => import('./pages/notfound/notfound.module').then(m => m.NotFoundModule) 
            },
            { 
                path: '**', 
                redirectTo: '/notfound' 
            },
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
