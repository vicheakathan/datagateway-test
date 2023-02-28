import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/services/app.layout.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';
import { SettingsModel } from 'src/app/models/settings';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UploaderService } from 'src/app/services/uploader.service ';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';

const URL = 'http://localhost:8080/api/upload';

class ImageSnippet {
    constructor(public src: string, public file: File) {}
}

@Component({
  templateUrl: './setting.component.html',
  providers: [MessageService]
})

export class SettingComponent implements OnInit {
    subscription!: Subscription;
    submitted: boolean = false;
    isLoadingResults: any = true;
    SettingsModel: SettingsModel[] = [];
    uploadedFiles: any[] = [];
    formSiteConfiguration: any = FormGroup;
    
    constructor(
        public layoutService: LayoutService,
        private _messageService: MessageService,
        public _companyService: CompanyService,
        public _authService: AuthService,
        public _router: Router,
        public _settingsService: SettingsService,
        private formBuilder: FormBuilder,
        private _uploaderService: UploaderService,
        private http: HttpClient
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });

        this._settingsService.getSettings().then(response => {
            this.SettingsModel = response;
            this.formSiteConfiguration = new FormGroup({
                id: new FormControl(response[0].id, Validators.compose([Validators.required])),
                production: new FormControl(response[0].production, Validators.compose([Validators.required])),
                local: new FormControl(response[0].local, Validators.compose([Validators.required])),
                integration: new FormControl(response[0].integration, Validators.compose([Validators.required])),
                siteTitle: new FormControl(response[0].siteTitle, Validators.compose([Validators.required])),
                logo_1: new FormControl(response[0].logo_1, Validators.compose([Validators.required])),
                logo_2: new FormControl(response[0].logo_2, Validators.compose([Validators.required])),
                icon: new FormControl(response[0].icon, Validators.compose([Validators.required])),
            });
        });
        
    }
  
    ngOnInit(): void {
        if (!this._authService.isLoggedIn)
            this._router.navigate(['/login']);

        setTimeout(() => {
            this.isLoadingResults = false;
        }, 1000);

        this.formSiteConfiguration = new FormGroup({
            id: new FormControl('', Validators.compose([Validators.required])),
            production: new FormControl('', Validators.compose([Validators.required])),
            local: new FormControl('', Validators.compose([Validators.required])),
            integration: new FormControl('', Validators.compose([Validators.required])),
            siteTitle: new FormControl('', Validators.compose([Validators.required])),
            logo_1: new FormControl('', Validators.compose([Validators.required])),
            logo_2: new FormControl('', Validators.compose([Validators.required])),
            icon: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    get validation() { return this.formSiteConfiguration.controls; }
    onSubmitData(): void{
        this.submitted = true;
        if (this.formSiteConfiguration.invalid) {
            return;
        }
        
        if(this.submitted) {
            // this.isLoadingResults = true;
            setTimeout(() => {
                this._settingsService.updateSettings(this.formSiteConfiguration.value)
                .subscribe(() => {
                    this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Settings Updated', life: 3000 });
                    this.isLoadingResults = false;
                    window.location.reload();
                }, (err: any) => {
                    this._messageService.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
                });
            }, 200);
        }
    }

    onBasicUploadAuto(event: any) {
        console.log(event);
        this._messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }


    selectedFile2!: ImageSnippet;
    processFile(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
          this.selectedFile2 = new ImageSnippet(event.target.result, file);
          this._uploaderService.uploadImage(this.selectedFile2.file).subscribe(
            (res) => {
                // console.log(res);
            },
            (err) => {
                console.log(err);
            })
        });

        if (file !== undefined) {
          this.formSiteConfiguration.value.icon = file.name;
          const uploadFileIcon  = document.querySelector('#uploadFileIcon') as HTMLInputElement;
          uploadFileIcon.value = file.name;

          reader.readAsDataURL(file);
        }
    }


    selectedFile: any;
    name: any; 
    uploadPercent: any;
    color = "primary"; 
    mode = "determinate"; 
    value = 50.25890809809; 
    onFileSelect(event: any) {
        this.selectedFile = event.target.files[0]; //User selected File
        this.name = this.selectedFile.name;
      }
    resumableUpload() {
        //checks file id exists or not, checks on name and last modified
        let fileId = `${this.selectedFile.name}-${this.selectedFile.lastModified}`;
        let headers = new HttpHeaders({
          size: this.selectedFile.size.toString(),
          "x-file-id": fileId,
          name: this.name
        });
    
        //To know whether file exist or not before making upload
        this.http
          .get("http://localhost:3000/status", { headers: headers })
          .subscribe((res: any) => {
            if (res.status === "file is present") {
              alert("File already exists. Please choose a different file.");
              return;
            }
            let uploadedBytes = res.uploaded; //GET response how much file is uploaded
            let headers2 = new HttpHeaders({
              size: this.selectedFile.size.toString(),
              "x-file-id": fileId,
              "x-start-byte": uploadedBytes.toString(),
              name: this.name
            });
            // Useful for showing animation of Mat Spinner
            const req = new HttpRequest(
              "POST",
              "http://localhost:3000/upload",
              this.selectedFile.slice(uploadedBytes, this.selectedFile.size + 1),
              {
                headers: headers2,
                reportProgress: true //continously fetch data from server of how much file is uploaded
              }
            );
            this.http.request(req).subscribe(
              (res: any) => {
                if (res.type === HttpEventType.UploadProgress) {
                  this.uploadPercent = Math.round((100 * res.loaded) / res.total);
                  // console.log(this.uploadPercent);
                  if (this.uploadPercent >= 100) {
                    this.name = "";
                    this.selectedFile = null;
                  }
                } else {
                  console.log(JSON.stringify(res));
                  if (this.uploadPercent >= 100) {
                    this.name = "";
                    this.selectedFile = null;
                  }
                }
              },
              err => {}
            );
        });
    }

    OnChangeFileUploadIcon() {
      const UploadIcon  = document.querySelector('#UploadIcon') as HTMLLinkElement;
      UploadIcon.click();
    }

    OnChangeFileUploadLogo1() {
      const UploadLogo1  = document.querySelector('#UploadLogo1') as HTMLLinkElement;
      UploadLogo1.click();
    }
}