import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ReplaySubject, forkJoin } from 'rxjs';
import { ClassMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-class-master',
  templateUrl: './class-master.component.html',
  styleUrls: ['./class-master.component.css']
})
export class ClassMasterComponent {

  submitted: boolean = false;
  searchBox!: string;
  classForm: any = FormGroup;
  formType: string = "Save";
  allClasss!: any[];
  ClassMasterModel!: ClassMasterClass;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  isProcessing = false;  // Flag to track if a request is being processed
  isUpdateMode: boolean = false;  // Track if the form is in Update mode

  thumbnail: File | null = null;
  poster: File | null = null;

  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
  @ViewChild('posterInput') posterInput!: ElementRef;

  thumbnailPreview: string | ArrayBuffer | null = null;
  posterPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private httpService: HttpServiceService, private alertServiceService: AlertServiceService) {
  }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.getAllClass();
  }

  initializeSaveFormValidations() {
    this.classForm = this.fb.group({
      className: new FormControl('', [Validators.required]),
      order: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
      ]),
      thumbnail: new FormControl(''),
      poster: new FormControl(''),
      id: new FormControl(null, []),
    });
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllClass();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1;
      this.getAllClass();
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.classForm.invalid || this.isProcessing) {
      return;
    }

    this.isProcessing = true;  // Set flag to true to indicate request in progress
    const formData = new FormData();

    // Append fields from form
    formData.append('className', this.classForm.get('className')?.value);
    formData.append('order', this.classForm.get('order')?.value);


  if (this.thumbnail) {
    formData.append('thumbnail', this.thumbnail);
  }
  if (this.poster) {
    formData.append('poster', this.poster);
  }

  if (this.formType === "Save") {
    this.saveClass(formData);
  } else if (this.formType === "Update") {
    formData.append('id', this.classForm.get('id').value);
    this.updateclass(formData);
  }
  }

  saveClass(formData: FormData) {
    this.httpService.post('classes', formData).subscribe((res: any) => {
      this.getAllClass();
      this.cancel();
      this.submitted = false;
      this.alertServiceService.success();
      this.isProcessing = false;  
    },
    (error) => {
      this.isProcessing = false;  
      this.alertServiceService.error();
    });
  }
  
  updateclass(formData: FormData) {
    this.httpService.patch('classes', formData).subscribe((res: any) => {
      this.getAllClass();
      this.cancel();
      this.alertServiceService.update();
      this.isProcessing = false;  
      this.submitted = false;
      this.formType = "Save";
    }, (error) => {
      this.isProcessing = false;  
      this.alertServiceService.error();
    });
  }
  

  cancel() {
    this.submitted = false;
    this.classForm.reset();
    this.thumbnail = null;
    this.poster = null;
    this.thumbnailPreview = null;
    this.posterPreview = null;
    // Clear file input values explicitly
    if (this.thumbnailInput) {
      this.thumbnailInput.nativeElement.value = '';
    }
    if (this.posterInput) {
      this.posterInput.nativeElement.value = '';
    }
    this.ngOnInit()
    this.isUpdateMode = false;  // Reset to false after cancel or update
    this.formType = 'Save'
  }

  getAllClass() {
    this.httpService.get('classes?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasss = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      } else {
        this.allClasss = [];
      }
    })
  }

  editClassData(data: any) {
    this.isUpdateMode = true;
    this.httpService.get('classes/' + data.id).subscribe((data: any) => {
      if (data) {
        this.classForm.patchValue({
          className: data.className,
          order: data.order,
          id: data.id,
          thumbnail: data.thumbnail, // URL from the server
          poster: data.poster        // URL from the server
        });
  
        // Set existing images as preview by default
        this.thumbnailPreview = null;
        this.posterPreview = null;
  
        // Clear existing files
        this.thumbnail = null;
        this.poster = null;
      }
      this.formType = "Update";
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  

  deleteClass(data: any) {
    console.log(data);
    this.httpService.delete('classes', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllClass();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  get f() {
    return this.classForm.controls;
  }

  disableScroll(event: WheelEvent) {
    event.preventDefault();
  }
  
  // Handle file input changes
  onFileChange(event: any, fileType: 'thumbnail' | 'poster') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (fileType === 'thumbnail') {
          this.thumbnailPreview = reader.result;
          this.thumbnail = file;
        } else if (fileType === 'poster') {
          this.posterPreview = reader.result;
          this.poster = file;
        }
        console.log(fileType);
        console.log(this.poster)
        console.log(this.thumbnail)
        // Save file reference
        // if (fileType === 'thumbnail') {
        //   this.classForm.patchValue({ thumbnail: file });
        // } else if (fileType === 'poster') {
        //   this.classForm.patchValue({ poster: file });
        // }
      };
      reader.readAsDataURL(file);
    }
  }


}