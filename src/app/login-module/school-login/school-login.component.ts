import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/authentication.service';
import { LoginClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-school-login',
  templateUrl: './school-login.component.html',
  styleUrls: ['./school-login.component.css']
})
export class SchoolLoginComponent {
  loginForm!: FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;
  showPassword: boolean = false;


  // portal!: string
  // @Output() loginEvent = new EventEmitter<boolean>();
  // @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef | undefined;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService, private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.route.queryParams.subscribe(params => {
      // this.portal = params['portal'];
    });
    this.checkIfAlreadyLogin();
  }

  initializeSaveFormValidations() {
    this.loginForm = this.fb.group({
      'userName': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  checkIfAlreadyLogin() {
    const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    if (user) {
      if (user.role == "school") {
        this.router.navigateByUrl('/dashboard/school-dashboard');
      } else if (user.role == "teacher") {
        this.router.navigateByUrl('/dashboard/teacher-dashboard');
      } else if (user.role == "student") {
        this.router.navigateByUrl('/dashboard/attend-quiz');
      } else if (user.role == "admin") {
        this.router.navigateByUrl('/dashboard');
      } else if (user.role == "superadmin") {
        this.router.navigateByUrl('/dashboard/superadmin-dashboard');
      } else if (user.role == "studio") {
        this.router.navigateByUrl('/dashboard/studio-dashboard');
      }
    }
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.login()
    }

  }

  login() {
    this.spinner.show();
    this.httpService.post('auth/login', this.loginForm.value).subscribe((data: any) => {
      if (data) {
        if (data.user) {
          sessionStorage.setItem('userProfile', JSON.stringify(data.user))
        }
        if (data.tokens) {
          sessionStorage.setItem('tokens', JSON.stringify(data.tokens))
        }
        this.alertServiceService.login();
        if (data.user.role == "school") {
          this.router.navigateByUrl('/dashboard/school-dashboard');
        } else if (data.user.role == "Teacher") {
          this.router.navigateByUrl('/dashboard/teacher-dashboard');
        } else if (data.user.role == "student") {
          this.router.navigateByUrl('/dashboard/attend-quiz');
        } else if (data.user.role == "admin") {
          this.router.navigateByUrl('/dashboard');
        } else if (data.user.role == "superadmin") {
          this.router.navigateByUrl('/dashboard/superadmin-dashboard');
        } else if (data.user.role == "studio") {
          this.router.navigateByUrl('/dashboard/studio-dashboard');
        }
        this.authService.setAuthenticationStatus(data.user.role)
      }
      this.spinner.hide();
    }, (error) => {
      this.alertServiceService.loginError();
      this.spinner.hide();
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
