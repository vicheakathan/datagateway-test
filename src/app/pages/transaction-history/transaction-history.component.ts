import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';
import { TransactionHistoryModel } from 'src/app/models/transaction-history';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TransactionHistoryService } from 'src/app/services/transaction-history.service ';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { Workbook } from 'exceljs';
import { Paginator } from 'primeng/paginator';

import { TenantService } from 'src/app/services/tenant.service';

interface City {
  name: string,
  code: string
};

@Component({
  templateUrl: './transaction-history.component.html',
  providers: [MessageService]
})


export class TransactionHistoryComponent implements OnInit {
    title = "Company";
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults = true;
    no_record_found = true;
    itemsPerPage = 25;
    totalRecords = 0;
    pageLinks = 0;
    orderByDate = "desc";
    searchFilter: string = "";
    startDate: string = "";
    date: string = "";
    dailogTitleHeader = "";
    firstRow: any = 0;
    endDate: string = "";
    status = "asc";
    transactionHistoryModel: TransactionHistoryModel[] = [];
    pageSizeOptions: number[] = [this.itemsPerPage, 50, 100, 200];
    @ViewChild('dt', { static: true }) dt!: Table;
    @ViewChild('searchValue') searchValue!: ElementRef;
    @ViewChild('calendar') private calendar: any;
    checkbox: boolean = false;
    selectAll: boolean = false;
    isSelectedTransactionHistory: TransactionHistoryModel[] = [];
    rangeDates!: Date[];
    @ViewChild('paginator', { static: true }) paginator!: Paginator;
    itemTenant: any = [];
    tenantId: any;
    getTenant: any;

    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _transactionHistoryService: TransactionHistoryService,
        public _authService: AuthService,
        public _router: Router,
        public _tenantService: TenantService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });

        this._tenantService.getTenant(50,0,"","","","").subscribe(res => {this.itemTenant = res.data;});
    }

  ngOnInit() {
    if (!this._authService.isLoggedIn)
      window.location.href = '/login';
  }

  paginate(event: any): any {
      var temp = JSON.parse(JSON.stringify(event));
      this.pageLinks = temp.page;
      this.itemsPerPage = temp.rows;
      this.OnLoadDataSource(Event);
  }

  OnLoadDataSource(event: any) {
    this.isLoadingResults = true;
    setTimeout(() => {
      if (event.sortOrder == 1 && event.sortField !== undefined && event.sortField !== null)
      this.orderByDate = "asc";
      if (event.sortOrder == -1)
          this.orderByDate = "desc";

      this._transactionHistoryService.getTransactionHistory(
          this.itemsPerPage,
          this.pageLinks,
          this.orderByDate,
          this.startDate,
          this.endDate,
          this.tenantId
      ).then(response => {
          this.totalRecords = response.total;
          this.transactionHistoryModel = response.data;
          this.isLoadingResults = false;
      });
    }, 1000);
  }

  onChangeDate(){
    if (this.rangeDates[1]) {
      this.startDate = moment(this.rangeDates[0]).format('YYYY-MM-DD');
      this.endDate = moment(this.rangeDates[1]).format('YYYY-MM-DD');
      this.calendar.overlayVisible = false;
    }
  }

  onGlobalFilter(event: any) {
    if (this.startDate != "" && this.endDate != "")
      this.dt.filterGlobal(event, 'contains');
    else
      this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please enter a date range", life: 2000 });

    this.paginator.changePageToFirst(event);
  }

  clear() {
    this.dt.selectionKeys = [];
    this.dt._selection = [];
    this.startDate = "";
    this.endDate = "";
    this.rangeDates = [];
    this.orderByDate = "desc";
    this.isSelectedTransactionHistory = [];
    this.paginator.changePageToFirst(event);
    this.itemTenant = this._tenantService.getTenant(50,0,"","","","").subscribe(res => {this.itemTenant = res.data;});
    this.tenantId = "";
    this.dt.clear();  
  }

  onSelectionChange(value = []) {
    this.isSelectedTransactionHistory = value;
  }

  exportExcel(table: Table): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("List Transaction History");
    var rowHeight = 30;
    // header-----------------
      let header = ["Date", "Data", "Response","Document Type", "Tenant"];
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
      worksheet.getColumn("A").width = 20;
      worksheet.getColumn("B").width = 100;
      worksheet.getColumn("C").width = 60;
      worksheet.getColumn("D").width = 25;
      worksheet.getColumn("E").width = 25;
    // set width----------
    var selectData = this.isSelectedTransactionHistory;
    if (selectData.length > 0) {
        for (let i=0; i<=selectData.length; i++) {
            if (selectData[i] !== undefined) {
                var temp: any = [];
                temp.push(moment(selectData[i]['date']).format('MM/DD/YYYY'));
                // temp.push(selectData[i]['saleTransactionId'].toUpperCase());
                temp.push(selectData[i]['data']);
                temp.push(selectData[i]['response']);
                temp.push(selectData[i]['documentType']);
                temp.push(selectData[i]['tenant']);
                worksheet.addRow(temp);
                worksheet.eachRow(row => {
                    row.alignment = {
                      vertical: "middle",
                      horizontal: "center",
                      wrapText: true,
                    }
                    // row.height = 10
                });
            }
        }
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileSaver.saveAs(blob, 'List Transactions History.xlsx');
        });
        
        // this.isSelectedTransaction = [];
        // this.dt.selectionKeys = [];
        // this.dt._selection = [];
        // this.paginator.changePageToFirst(event);
        // this.dt.clear();
        this.clear();
    } else
        this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please select at least one transaction history", life: 2000 });
  }
  
  onFilterByTenant(event: any) {
    // console.log(event.value);
    if (event.value != null || event.value !== undefined) {
      this.tenantId = event.value;
      this.dt.filterGlobal(event, 'contains');
    }
   
  }

}