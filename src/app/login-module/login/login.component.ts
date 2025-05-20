import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginClass } from '../../models/models';
import { HttpServiceService } from '../../services/http-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from '../../services/alert-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;
  // portal!: string
  // @Output() loginEvent = new EventEmitter<boolean>();
  // @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef | undefined;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.route.queryParams.subscribe(params => {
      // this.portal = params['portal'];
    });
  }

  initializeSaveFormValidations() {
    this.loginForm = this.fb.group({
      'userID': new FormControl('', [Validators.required]),
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
    this.loginModel = this.loginForm.value;
    this.httpService.post('auth/sansthan-login', this.loginModel).subscribe((data: any) => {
      if (data) {
        const route: any = this.route;
        // route.queryParams._value.portal
        if (data.sansthan) {
          sessionStorage.setItem('userProfile', JSON.stringify(data.sansthan))
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
