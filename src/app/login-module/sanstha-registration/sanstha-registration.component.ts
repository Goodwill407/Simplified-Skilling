import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-registration',
  templateUrl: './sanstha-registration.component.html',
  styleUrls: ['./sanstha-registration.component.css']
})
export class RegistrationComponent {

  registrationForm!: FormGroup;
  submitted: boolean = false;
  loginModel!: LoginClass;
  portal!: string;
  allStates!: any[];
  allDistricts!: any[];

  @Output() loginEvent = new EventEmitter<boolean>();
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef | undefined;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.getAllStates();
    this.route.queryParams.subscribe(params => {
      this.portal = params['portal'];
    });
  }

  initializeSaveFormValidations() {
    this.registrationForm = this.fb.group({
      sansthanName: new FormControl('', [Validators.required]),
      userID: new FormControl('', [Validators.required]),
      mobNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      registrationDist: new FormControl('asas', [Validators.required]),
      state: new FormControl('qwer', [Validators.required]),
      temporaryPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get f() { return this.registrationForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.getOtp();
  }

  getOtp() {
    this.httpService.post('auth/verify-number', this.registrationForm.value.mobNumber).subscribe((data: any) => {
      this.registrationForm.addControl('otp', new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^[0-9]*$")]));
      this.closeAddExpenseModal?.nativeElement.click();
    })
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }
    this.httpService.post('auth/sansthan-register', this.registrationForm.value).subscribe((data: any) => {
      if (data) {
        this.alertServiceService.success();
        const router: any = this.router;
        this.router.navigate(['/login'], { queryParams: router?.currentUrlTree.queryParams });
      }
    })
  }

  getAllStates() {
    this.httpService.get('state').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allStates = data;
      }
    })
  }

  getDistrictById(event: any) {
    const id = event.target.value;
    // this.httpService.getById('district', id).subscribe((data: any) => {
    //   if (data && data.length > 0) {
    //     this.allStates = data;
    //   }
    // })
  }

}
