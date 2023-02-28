import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    @Input() username: string = '';
    @Input() password: string = '';
    loginForm: any = FormGroup;
    isLoadingResults: boolean = false;
    image_src: any = 'assets/images/logo.png';
    toggleEyes:boolean = false;
    showPassword: any = "password";
    constructor(
        public layoutService: LayoutService,
        public formBuilder: FormBuilder,
        public router: Router,
        public authService: AuthService,
        public localStorageService: LocalStorageService,
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.compose([Validators.required])),
            password: new FormControl('', Validators.compose([Validators.required])),
        });

        if (this.localStorageService.getLogoUrl() != null)
            this.image_src = this.localStorageService.getLogoUrl();
    }

    ngOnInit(): void {
       
    }

    submitted = false;
    isIncorrectUsernamePassword = false;
    get f() { return this.loginForm.controls; }
    onFormSubmit() : void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        
        if(this.submitted) {
            // this.isLoadingResults = true;
            setTimeout(() => {
                this.authService.login(this.loginForm.value)
                .subscribe(() => {
                    // this.router.navigate(['/']);
                    window.location.href = '/';
                }, (err: any) => {
                    if (err)
                        this.isIncorrectUsernamePassword = true;
                    // this.isLoadingResults = false;
                });
            }, 100);
        }
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
