import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Table } from 'primeng/table';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyModel } from 'src/app/models/company';
import { LazyLoadEvent } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { Paginator } from 'primeng/paginator';

interface expandedRows {
  [key: string]: boolean;
} 

@Component({
  templateUrl: './company.component.html',
  providers: [MessageService]
})

export class CompanyComponent implements OnInit {
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
    endDate: string = "";
    firstRow: any = 0;
    company: CompanyModel[] = [];
    companys: CompanyModel = {};
    pageSizeOptions: number[] = [this.itemsPerPage, 50, 100, 200];
    @ViewChild('dt', { static: true }) dt!: Table;
    @ViewChild('searchValue') searchValue!: ElementRef;
    @ViewChild('paginator', { static: true }) paginator!: Paginator;
    selectAll: boolean = false;
    companyDailog: boolean = false;
    isSelectedCompany: CompanyModel[] = [];

    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _companyService: CompanyService,
        public _authService: AuthService,
        public _router: Router
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });
    }
  
    ngOnInit(): void {
        if (!this._authService.isLoggedIn)
            window.location.href = '/login';
    }

    OnLoadDataSource(event: any) {
        this.isLoadingResults = true;
        setTimeout(() => {
            if (event.sortOrder == 1 && event.sortField !== undefined && event.sortField !== null)
                this.orderByDate = "asc";
            if (event.sortOrder == -1)
                this.orderByDate = "desc";

            this._companyService.get_v2(
                this.itemsPerPage,
                this.pageLinks,
                this.orderByDate,
                '','',
                this.searchFilter
            ).then(res => {
                this.totalRecords = res.total;
                this.company = res.data;
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
        table.clear();
        this.searchFilter = "";
        this.orderByDate = "desc";
        this.searchValue.nativeElement.value = "";
        this.dt.selectionKeys = [];
        this.dt._selection = [];
        this.paginator.changePageToFirst(event);
    }

    add() {
        this.companys = {};
        this.submitted = false;
        this.companyDailog = true;
        this.dailogTitleHeader = "Add Company";
        const d = new Date();
        const createAt = moment(d).format('MM/DD/YYYY');
        this.date = createAt;
        this.companys = {
            createAt: createAt,
            url: "https://atech-it.com",
            imageUrl: "https://atech-it.com",
            website: "www.atech-it.com",
            username: "atech1",
            password: "atech1@",
            hashCode: "string",
            lg: 0,
            lat: 0,
            activeDate: "2022-09-02T08:45:11.943Z",
            blockDate: "2022-09-02T08:45:11.943Z",
            verifyDate: "2022-09-02T08:45:11.943Z",
            deleteDate: "2022-09-02T08:45:11.943Z",
            activedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            blockedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            verifiedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            deletedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            isActive: true,
            isBlocked: true,
            isVerified: true,
            isDeleted: true,
            userId: "84365900-b3f0-428d-d537-08da909ebcd9",

            // name: "Impect",
            // description: "Impect Company",
            // address: "TK Phnom Penh",
            // email: "atech@gmail.com",
            // phone: "023569636",
        };
    }

    edit(company: CompanyModel) {
        this.dailogTitleHeader = "Edit Company";
        if (company.createAt)
            this.date = moment(company.createAt).format('MM/DD/YYYY');
        this.companys = { ...company };
        this.companyDailog = true;
    }

    OnDateChange(Event: any) {
        const createAt = moment(Event).format('MM/DD/YYYY');
        this.companys.createAt = createAt;
    }

    update() {
        this.submitted = true;

        if (this.companys.createAt && this.companys.name && this.companys.email && this.companys.phone && this.companys.address && this.companys.description) {
            if (this.companys.id) {
                this._companyService.updateCompany(this.companys)
                    .subscribe(() => {
                        setTimeout(() => {
                            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Updated', life: 3000 });
                        },1200);
                    }, (err: any) => {
                        this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
                    }
                );
            } else {
                this._companyService.addCompany(this.companys)
                    .subscribe(() => {
                        setTimeout(() => {
                            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company Created', life: 3000 });
                        },1200);
                    }, (err: any) => {
                        this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
                    }
                );
            }
            this.dt.reset();
            this.company = [...this.company];
            this.companyDailog = false;
            this.companys = {};
        }
    }

    onSelectionChange(value = []) {
        this.isSelectedCompany = value;
    }

    closeDialog() {
        this.companys = {};
        this.companyDailog = false;
        this.submitted = false;
    }

    exportExcel(table: Table): void {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet("List Company");
        var rowHeight = 30;
        // header-----------------
          let header = ["Date","Name","Email","Phone Number","Address","Active"];
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
          worksheet.getColumn("B").width = 25;
          worksheet.getColumn("C").width = 30;
          worksheet.getColumn("D").width = 20;
          worksheet.getColumn("E").width = 50;
          worksheet.getColumn("F").width = 20;
        // set width----------
        var selectData = this.isSelectedCompany;
        if (selectData.length > 0) {
            for (let i=0; i<=selectData.length; i++) {
                if (selectData[i] !== undefined) {
                    var temp: any = [];
                    temp.push(moment(selectData[i]['createAt']).format('MM/DD/YYYY'));
                    temp.push(selectData[i]['name']);
                    temp.push(selectData[i]['email']);
                    temp.push(selectData[i]['phone']);
                    temp.push(selectData[i]['address']);
                    temp.push(selectData[i]['isActive']);
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
                FileSaver.saveAs(blob, 'List Company.xlsx');
            });
            this.isSelectedCompany = [];
            this.dt.selectionKeys = [];
            this.dt._selection = [];
            this.paginator.changePageToFirst(event);
            this.dt.reset();
        } else
            this._messageService.add({ severity: 'error', summary: 'Error', detail: "Please select at least one company", life: 2000 });

    }

    paginate(event: any): any {
        var temp = JSON.parse(JSON.stringify(event));
        this.pageLinks = temp.page;
        this.itemsPerPage = temp.rows;
        this.OnLoadDataSource(Event);
    }
}