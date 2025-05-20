import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { RolesMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css'],
})
export class AddRoleComponent implements OnInit {
  mainForm!: FormGroup;
  RolesMasterModel!: RolesMasterClass;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1;

  allRoles!: any[];
  formtype: string = 'Save';
  paginationConfig: any;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertServiceService: AlertServiceService,
    private httpService: HttpServiceService
  ) {}

  ngOnInit() {
    this.formInitialize();
    this.getAllRole();
    this.mainForm.reset();
  }

  formInitialize() {
    this.mainForm = this.fb.group({
      role: new FormControl(null, [Validators.required]),
      id: new FormControl(null, []),
    });
  }

  get f() {
    return this.mainForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.mainForm.invalid) {
      return;
    }
    if (this.formtype == 'Save') {
      this.PostData();
    } else if (this.formtype == 'Update') {
      this.UpdateData();
    }
  }

  PostData() {
    this.RolesMasterModel = this.mainForm.value;
    delete this.RolesMasterModel.id;
    this.httpService
      .post('roles', this.RolesMasterModel)
      .subscribe((res: any) => {
        this.formtype = 'Save';
        this.getAllRole();
        this.alertServiceService.success();
        this.cancelRole();
      });
  }

  UpdateData() {
    this.RolesMasterModel = this.mainForm.value;
    this.httpService
      .patch('roles', this.RolesMasterModel)
      .subscribe((res: any) => {
        this.formtype = 'Save';
        this.getAllRole();
        this.alertServiceService.success();
        this.cancelRole();
      });
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllRole();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = Number(event.target.value);
      this.getAllRole();
    }
  }

  getAllRole() {
    this.httpService.get('roles').subscribe((data: any) => {
      if (data) {
        this.allRoles = data;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total,
        };
      } else {
        this.allRoles = [];
      }
    });
  }

  cancelRole() {
    this.submitted = false;
    this.mainForm.reset();
    this.formtype = 'Save';
  }

  editRoleData(data: any) {
    this.httpService.get('roles/' + data._id).subscribe(
      (data: any) => {
        if (data) {
          this.mainForm.patchValue({
            role: data.role,
            id: data._id,
          });
          this.formtype = 'Update';
        }
      },
      (error) => {
        this.alertServiceService.error();
      }
    );
  }

  deleteRoleData(data: any) {
    this.httpService.delete('roles/', data._id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllRole();
    });
  }
}
