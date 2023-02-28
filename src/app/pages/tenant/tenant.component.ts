import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TenantModel } from 'src/app/models/tenant';
import { TenantService } from 'src/app/services/tenant.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { CompanyModel } from 'src/app/models/company';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { Paginator } from 'primeng/paginator';

@Component({
  templateUrl: './tenant.component.html',
  providers: [MessageService]
})

export class TenantComponent implements OnInit {
    title = "Tenant";
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults = true;
    itemsPerPage = 25;
    totalRecords = 0;
    pageLinks = 0;
    orderByDate = "desc";
    searchFilter: string = "";
    startDate: string = "";
    date: string = "";
    dailogTitleHeader = "";
    endDate: string = "";
    firstRow: any = 0;
    tenantModel: TenantModel[] = [];
    tenantModelDialog: TenantModel = {};
    pageSizeOptions: number[] = [this.itemsPerPage, 50, 100, 200];
    selectAll: boolean = false;
    tenantDailog: boolean = false;
    tenantDailogChangePassword: boolean = false;
    isSelectedTenant: TenantModel[] = [];
    companyId: any = [];
    isDisabled: boolean = true;
    showPassword: any = "password";
    toggleEyes:boolean = false;
    @ViewChild('dt', { static: true }) dt!: Table;
    @ViewChild('searchValue') searchValue!: ElementRef;
    @ViewChild('paginator', { static: true }) paginator!: Paginator;
    isDisplayNone: any;
    vatType: any[] = [
      {name: 'Inclusive', key: true}, 
      {name: 'Exclusive', key: false}
    ];

    currency: any[] = [
      {
        currencyCode: 'CUR-001',
        currencyName: 'USD', 
        currencyAbv: 'Dollar',
        currencySign: '$',
        exchangeRate: '4100.00'
      },
      {
        currencyCode: 'CUR-002',
        currencyName: 'KHR', 
        currencyAbv: 'Riel',
        currencySign: 'R',
        exchangeRate: '4100.00'
      }
    ];

    constructor(
      public layoutService: LayoutService,
      private _messageService: MessageService,
      public _tenantService: TenantService,
      public _authService: AuthService,
      public _router: Router,
      public _companyServie: CompanyService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });

    }

  ngOnInit(): void {
    if (!this._authService.isLoggedIn)
      window.location.href = '/login';

    this._tenantService.getAllCompany().subscribe(
      response => {
        for(var i = 0; i < response.length; i++){ 
          this.companyId.push(response[i]);
        }
      }
    );
  }

  OnLoadDataSource(event: any) {
    this.isLoadingResults = true;
    setTimeout(() => {
        if (event.sortOrder == 1 && event.sortField !== undefined && event.sortField !== null)
            this.orderByDate = "asc";
        if (event.sortOrder == -1)
            this.orderByDate = "desc";

        this._tenantService.getTenant_v2(
            this.itemsPerPage,
            this.pageLinks,
            this.orderByDate,
            this.startDate,
            this.endDate,
            this.searchFilter
        ).then(response => {
            this.totalRecords = response.total;
            this.tenantModel = response.data;
            this.isLoadingResults = false;
        });
    }, 1000);
  }

  onGlobalFilter(table: Table, value: any) {
    table.filterGlobal(value, 'contains');
    this.searchFilter = value;
    this.paginator.changePageToFirst(event);
  }

  clear(table: Table) {
    table.reset();
    this.orderByDate = "desc";
    this.searchFilter = "";
    this.searchValue.nativeElement.value = "";
    this.dt.selectionKeys = [];
    this.dt._selection = [];
    this.paginator.changePageToFirst(event);
  }

  onSelectionChange(value = []) {
    this.isSelectedTenant = value;
  }

  add() {
    this.isDisplayNone = "";
    this.isDisabled = false;
    this.tenantModelDialog = {};
    this.submitted = false;
    this.tenantDailog = true;
    this.dailogTitleHeader = "Add Tenant";
    const d = new Date();
    const createAt = moment(d).format('MM/DD/YYYY');
    this.date = createAt;
    this.tenantModelDialog = {
      // id: "04969730-505a-454a-9fc7-08dad9016381",
      createAt: createAt,
      imageUrl: "string",
      openDate: "06:00:00",
      closeDate: "20:00:00",
      isActive: true,
      isBlocked: true,
      isVerified: true,
      isDeleted: true,
      vatType: [{
        date: createAt,
        cd: "TAX",
        code:"001",
        name:"VAT",
        // percentage: "50",
        isExclude: false,
      }],
      currency: [
        {
          currencyCode: 'CUR-001',
          currencyName: 'USD', 
          currencyAbv: 'Dollar',
          currencySign: '$',
          exchangeRate: '4100.00'
        }
      ]

      // companyId: "8A90B313-C718-4A84-BEA9-08DADBFCBAD3",
      // remoteCode: "test",
      // username:"test",
      // password:"Admin#123",
      // name:"test",
      // description:"ATECH Toul Touk",
      // address: "Phnom Penh",
    };
  }

  edit(tenant: TenantModel) {
    this._tenantService.decryptPassword(tenant.id).subscribe(
      response => {
        this.tenantModelDialog.password = response[0]['password'];
      }
    );
      
    this.isDisplayNone = "display:none";
    this.isDisabled = true;
    this.dailogTitleHeader = "Edit Tenant";
    if (tenant.createAt)
        this.date = moment(tenant.createAt).format('MM/DD/YYYY');
    this.tenantModelDialog = { ...tenant };
    this.tenantDailog = true;
  }

  onChangeCurrency(value: any) {
    this.tenantModelDialog.currency = [{
      currencyName: value.currencyName,
      currencyCode: value.currencyCode,
      currencyAbv: value.currencyAbv,
      currencySign: value.currencySign,
      exchangeRate: value.exchangeRate
    }];
  }

  update() {
    this.submitted = true;
    var vat = JSON.parse(JSON.stringify(this.tenantModelDialog.vatType));
    var percentage = "";
    for (let i=0; i<=vat.length; i++) {
      if (vat[i] !== undefined) {
        percentage = vat[i]['percentage'];
      }
    }

    if (this.tenantModelDialog.createAt && this.tenantModelDialog.companyId && this.tenantModelDialog.name?.trim() && this.tenantModelDialog.address?.trim() && this.tenantModelDialog.description?.trim() && this.tenantModelDialog.username?.trim() && this.tenantModelDialog.password?.trim() && this.tenantModelDialog.remoteCode?.trim() && percentage) {
        if (this.tenantModelDialog.id) {
            this._tenantService.updateTenant(this.tenantModelDialog)
            .subscribe(() => {
              setTimeout(()  => {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Updated', life: 3000 });
              },1300);
            }, (err: any) => {
                this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            });
        } else {
            this._tenantService.addTenant(this.tenantModelDialog)
            .subscribe(() => {
              setTimeout(() => {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tenant Created', life: 3000 });
              },1000);
            }, (err: any) => {
                this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            });
        }
        
        this.dt.reset();
        this.tenantModel = [...this.tenantModel];
        this.tenantDailog = false;
        this.tenantModelDialog = {};
    }
  }

  changePasswordDailog(tenant: TenantModel) {
    this.submitted = false;
    this.dailogTitleHeader = "Change Password";
    if (tenant.createAt)
        this.date = moment(tenant.createAt).format('MM/DD/YYYY');
    this.tenantModelDialog = { ...tenant };
    this.tenantDailogChangePassword = true;
    this.tenantModelDialog.password = "";
  }

  updatePassword() {
    this.submitted = true;
    if (this.tenantModelDialog.username && this.tenantModelDialog.password) {
      if (this.tenantModelDialog.id) {
        this._tenantService.changePassword(this.tenantModelDialog)
        .subscribe(() => {
          setTimeout(() => {
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Password Changed', life: 3000 });
          },1200);
        }, (err: any) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
        });
      }
      this.dt.reset();
      this.tenantModel = [...this.tenantModel];
      this.tenantDailogChangePassword = false;
      this.tenantModelDialog = {};
    }
  }

  OnDateChange(Event: any) {
      const createAt = moment(Event).format('MM/DD/YYYY');
      this.tenantModelDialog.createAt = createAt;
  }

  closeDialog() {
    this.tenantModelDialog = {};
    this.tenantDailog = false;
    this.tenantDailogChangePassword = false;
    this.submitted = false;
    this.toggleEyes = false;
    // this.dt.reset();
  }

  exportExcel(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("List Tenant");
    var rowHeight = 30;
    // header-----------------
      let header = ["Date","Tenant Id","Name","Company","Vat","Currency"];
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell(cell => {
        cell.font = {
          bold: true,
          size: 14,
          color: { argb: "FFFFFF" }
        },
        cell.alignment = {
          vertical: "middle",
          horizontal: "center"
        },
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "5b9bd5" },
        } // set background color
      });
      
      worksheet.views = [
        {state: 'frozen', ySplit: 1}
      ]; // freeze panes
      worksheet.getRow(1).height = rowHeight;
    // header-----------------
    
    // set width----------
      worksheet.getColumn("A").width = 25;
      worksheet.getColumn("B").width = 50;
      worksheet.getColumn("C").width = 30;
      worksheet.getColumn("D").width = 30;
      worksheet.getColumn("E").width = 20;
      worksheet.getColumn("F").width = 20;
    // set width----------
    var selectData = this.isSelectedTenant;
    var company = this.companyId;
    if (selectData.length > 0) {
        for (let i=0; i<=selectData.length; i++) {
            if (selectData[i] !== undefined) {
                var temp: any = [];
                
                for (let j=0; j<= company.length; j++) {
                  var companyName: any;
                  if (company[j] !== undefined) {
                    if (selectData[i]['companyId'] == company[j]['id']) {
                      companyName = company[j]['name'];
                    }
                  }
                }

                temp.push(moment(selectData[i]['createAt']).format('MM/DD/YYYY'));
                temp.push(selectData[i]['id']);
                temp.push(selectData[i]['name']);
                temp.push(companyName);

                var vat = JSON.parse(JSON.stringify(selectData[i]['vatType']));
                for (let k=0; k<=vat.length; k++)
                {
                  var vatType:any;
                  if (vat[k] !== undefined)
                  {
                    if (vat[k]['isExclude'] == true)
                      vatType = "Inclusive";
                    else 
                      vatType = "Exclusive";
                  }
                }
                temp.push(vatType);

                var curr = JSON.parse(JSON.stringify(selectData[i]['currency']));
                for (let k=0; k<=curr.length; k++)
                {
                  var currency:any;
                  if (curr[k] !== undefined)
                  {
                    currency = curr[k]['currencyAbv'];
                  }
                }
                temp.push(currency);

                worksheet.addRow(temp);

                worksheet.eachRow(row => {
                    row.alignment = {
                      vertical: "middle",
                      horizontal: "center",
                      wrapText: true
                    }
                    row.height = rowHeight
                });
            }
        }
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, 'List Tenant.xlsx');
        });
        this.isSelectedTenant = [];
        this.dt.selectionKeys = [];
        this.dt._selection = [];
        this.paginator.changePageToFirst(event);
        this.dt.reset();
    } else
        this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please select at least one tenant", life: 2000 });

  }

  paginate(event: any): any {
    var temp = JSON.parse(JSON.stringify(event));
    this.pageLinks = temp.page;
    this.itemsPerPage = temp.rows;
    this.OnLoadDataSource(Event);
  }
  
  OnChangePassword(value: any) {
    this.tenantModelDialog.other = value;
  }

  toggleShowPassword() {
    if (this.showPassword == "password") {
        this.showPassword = "text";
        this.toggleEyes = true;
    } else {
        this.showPassword = "password";
        this.toggleEyes = false;
    }
  }
}