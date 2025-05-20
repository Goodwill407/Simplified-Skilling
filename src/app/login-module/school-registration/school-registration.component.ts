import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.css']
})
export class SchoolRegistrationComponent {

  registrationForm!: FormGroup;
  passwordForm!: FormGroup;

  submitted: boolean = false;
  passwordSubmitted: boolean = false;

  loginModel!: LoginClass;
  portal!: string;
  showPasswordFields: boolean = false;
  userDetails: any;
  asd: any;
  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
  }

  initializeSaveFormValidations() {
    this.registrationForm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      mobNumber: new FormControl('', [Validators.required, Validators.pattern("[789][0-9]{9}")]),
    });
  }

  initializePasswordFormValidations() {
    this.passwordForm = this.fb.group({
      userId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")]),
      confirmPassword: new FormControl(''),
    });
  }

  get f() { return this.registrationForm.controls; }
  get p() { return this.passwordForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.verifyMobileNumber();
  }

  submitPasswordForm() {
    this.passwordForm.patchValue({
      userId: this.userDetails.user.id
    })
    if (this.passwordForm.value.password != this.passwordForm.value.confirmPassword) {
      this.passwordForm.controls['confirmPassword'].setErrors({ 'incorrect': true })
    }
    this.passwordSubmitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.passwordForm.removeControl('confirmPassword');
    this.savePassword();
  }

  verifyMobileNumber() {
    this.httpService.post('auth/first-verifyNo-login', this.registrationForm.value).subscribe((data: any) => {
      if (data) {
        this.showPasswordFields = true;
        this.userDetails = data;
        this.initializePasswordFormValidations();
      }
    }, (error) => {
      error
      this.alertServiceService.loginError();
    })
  }

  savePassword() {
    this.httpService.post('auth/set-password', this.passwordForm.value).subscribe((data: any) => {
      if (data) {
        this.alertServiceService.setPassword();
        this.router.navigate(['/school-login']);
      }
    })
  }

  register() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.httpService.post('auth/register', this.registrationForm.value).subscribe((data: any) => {
      if (data) {
        this.alertServiceService.success();
        const router: any = this.router;
        this.router.navigate(['/school-login'], { queryParams: router?.currentUrlTree.queryParams });
      }
    })
  }
}
