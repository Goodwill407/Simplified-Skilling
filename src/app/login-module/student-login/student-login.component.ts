import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent {
  loginForm!: FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
    
  }

  initializeSaveFormValidations() {
    this.loginForm = this.fb.group({
      'userName': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.loginForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.login();
  }

  login() {
    // this.loginModel = this.loginForm.value;
    this.httpService.post('auth/studentAndParent-login', this.loginForm.value).subscribe((data: any) => {
      if (data) {
        const route: any = this.route;
        // route.queryParams._value.portal
        if (data.user.userName) {
          sessionStorage.setItem('userProfile', JSON.stringify(data.user.userName))
        }
        if (data.tokens) {
          sessionStorage.setItem('tokens', JSON.stringify(data.tokens))
        }
        this.alertServiceService.login();
        this.router.navigateByUrl('/dashboard');
      }
    })
  }
}
