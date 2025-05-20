import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MediumMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-medium-master',
  templateUrl: './medium-master.component.html',
  styleUrls: ['./medium-master.component.css']
})
export class MediumMasterComponent implements OnInit {

  mainForm!: FormGroup;
  mediumMasterModel!: MediumMasterClass;
  searchBox!: string;
  limit = 10;
  total: number = 0;
  page: number = 1;
  allMediums!: any[];
  formtype: string = "Save";
  paginationConfig: any;
  submitted: boolean = false;
  isUpdateMode: boolean = false;  // Track if the form is in Update mode

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  ngOnInit() {
    this.formInitialize();
    this.getAllMedium();
    this.mainForm.reset()
  }
  formInitialize() {
    this.mainForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      id: new FormControl(null, []),
    });
  }

  get f() { return this.mainForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.mainForm.invalid) {
      return;
    }
    if (this.formtype == "Save") {
      this.PostData();
    }
    else if (this.formtype == "Update") {
      this.UpdateData();
    }
  }

  PostData() {
    this.mediumMasterModel = this.mainForm.value;
    delete this.mediumMasterModel.id;
    this.httpService.post('medium', this.mediumMasterModel).subscribe((res: any) => {
      this.formtype = "Save";
      this.getAllMedium();
      this.alertServiceService.success();
      this.cancelMedium();
    });
  }


  UpdateData() {
    this.mediumMasterModel = this.mainForm.value;
    this.httpService.patch('medium', this.mediumMasterModel).subscribe((res: any) => {
      this.formtype = "Save";
      this.getAllMedium();
      this.alertServiceService.update();
      this.cancelMedium();
    });
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllMedium();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = Number(event.target.value);
      this.page = 1;
      this.getAllMedium();
    }
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total
        }
      } else {
        this.allMediums = [];
      }
    })
  }

  cancelMedium() {
    this.submitted = false;
    this.mainForm.reset();
    this.formtype = 'Save'
    this.isUpdateMode = false;  // Reset to false after cancel or update
  }

  editMediumData(data: any) {
    this.httpService.get('medium/' + data.id).subscribe((data: any) => {
      if (data) {
        this.mainForm.patchValue(data);
        this.formtype = "Update";
        this.isUpdateMode = true;  // Set to true when in update mode
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  deleteMediumData(data: any) {
    this.httpService.delete('medium/', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllMedium();
    })
  }

}