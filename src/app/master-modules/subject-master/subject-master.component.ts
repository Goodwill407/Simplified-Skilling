import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SubjectMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-subject-master',
  templateUrl: './subject-master.component.html',
  styleUrls: ['./subject-master.component.css']
})
export class SubjectMasterComponent implements OnInit {

  subjectForm: any = FormGroup;
  subjectMasterModel!: SubjectMasterClass;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox: string = '';

  submitted = false;
  allBoards!: any[];
  allClasses!: any[];
  allMediums!: any[];
  getAllData!: any[];
  allSubjects!: any[];

  boardId:string='';
  classId:string='';
  mediumId:string='';

  formType: string = "Save";
  isUpdateMode: boolean = false;  // Track if the form is in Update mode

  thumbnail: File | null = null;
  poster: File | null = null;

  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
  @ViewChild('posterInput') posterInput!: ElementRef;

  thumbnailPreview: string | ArrayBuffer | null = null;
  posterPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoard()
    this.getAllClass()
    this.getAllMedium()
    this.subjectMasterModel = this.subjectForm.value;
    // this.getAllSubjects();
  }

  initializeValidations() {
    this.subjectForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, [Validators.required]),
      classId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      thumbnail: new FormControl(''),
      poster: new FormControl(''),
      code: new FormControl(null, [Validators.required]),
      description: new FormControl(''), // Add description field
      id: new FormControl('')
    });
  }

  get f() { return this.subjectForm.controls; }

  // saveFormReset(){
  //   this.submitted = false
  //   this.subjectForm.controls.name.reset();
  //   this.subjectForm.controls.code.reset();
  //   this.subjectForm.controls.thumbnail.reset();
  // }

  getAllSubjects() {
    this.httpService.get(`/subjects?page=${this.page}&limit=${this.limit}`).subscribe((response: any) => {
        // console.log(this.page, "res"); // Log the page value for debugging
        if (response && response.results && response.results.length > 0) {
          this.allSubjects = response.results;
          this.total = response.totalResults;
            this.paginationConfig = {
              itemsPerPage: this.limit,
              currentPage: this.page,
              totalItems: this.total,
            }
        } else {
          this.allSubjects = [];
        }
      }, error => {
        console.error('Error fetching subjects:', error);
      });
  }
  
  
  submitForm() {
    this.submitted = true;
    if (this.subjectForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('boardId', this.subjectForm.get('boardId').value);
    formData.append('mediumId', this.subjectForm.get('mediumId').value);
    formData.append('classId', this.subjectForm.get('classId').value);
    formData.append('name', this.subjectForm.get('name').value);
    formData.append('code', this.subjectForm.get('code').value);
    formData.append('description', this.subjectForm.get('description').value || '');

    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }
    if (this.poster) {
      formData.append('poster', this.poster);
    }
  
    if (this.formType === "Save") {
      this.saveSubject(formData);
    } else if (this.formType === "Update") {
      formData.append('id', this.subjectForm.get('id').value);
      this.updateSubject(formData);
    }
  }

  //Handle page change event
  pageChangeEvent(pageNumber: number): void {
    console.log("Page Number Changed:", pageNumber);  // Add logging for debugging
    this.page = pageNumber;  // Update the current page
    // this.getAllSubjects();  // Fetch subjects for the updated page
    this.showAllSubjects(); // Show all subjects as per condition
  }

   // Handle page size change
   selectPaginationSize(event: any) {
    this.limit = Number(event.target.value);  // Update the limit (items per page)
    this.page = 1;  // Reset to page 1 when changing the page size
    // this.getAllSubjects();  // Fetch subjects for the new page size and reset page
    this.showAllSubjects(); // Show all subjects as per condition
  }

  
  onFileSelect(event: any, fromEdit?: any) {
    const reader = new FileReader();
    let [file]: any = '';
    if (fromEdit) {
      [file] = event
    } else {
      [file] = event.target.files;
    }
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.subjectForm.patchValue({
        thumbnail: reader.result
      });
    }
    this.subjectMasterModel.thumbnail = file;
    event.target.value = null;
  }

  saveSubject(formData: FormData) {
    this.httpService.post('subjects', formData).subscribe((data: any) => {
      this.alertServiceService.success();
      this.showAllSubjects();
      this.cancel();
    }, (error) => {
      this.alertServiceService.error();
    });
  }


  updateSubject(formData: FormData) {
    this.httpService.patch('subjects', formData).subscribe((data: any) => {
      this.alertServiceService.update();
      this.showAllSubjects();
      this.cancel();
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  
cancel() {
  this.subjectForm.reset();
  this.submitted = false;
  this.thumbnailPreview = null;
  this.posterPreview = null;
  this.thumbnail = null;
  this.poster = null;

  if (this.thumbnailInput) {
    this.thumbnailInput.nativeElement.value = '';
  }
  if (this.posterInput) {
    this.posterInput.nativeElement.value = '';
  }

  this.formType = 'Save';
  this.isUpdateMode = false;
}

  editSubjectData(data: any) {
    this.isUpdateMode = true;  // Set to true when in update mode
    this.httpService.get('subjects/' + data.id).subscribe((data: any) => {
      if (data) {
        // this.onFileSelect(data.thumbnail, true);
        this.subjectForm.patchValue(data);
        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  deleteSubjectData(data: any) {
    this.httpService.delete('subjects', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      //this.getByFilterSubjectData()
      // this.getAllSubjects();
      this.showAllSubjects(); // Show all subjects as per condition
    }, (error) => {
      this.alertServiceService.error();
    })
  }

   getByFilterSubjectData(){
    this.httpService.get('subjects/filter' + '/' + this.boardId + '/' + this.mediumId + '/' + this.classId).subscribe((data:any)=>{
      if(data.length > 0){
        this.allSubjects=data;
        // console.log(this.allSubjects); 
       }
        else {
          this.allSubjects = [];
        }
    },
    (error) => {
      // Handle error
      this.alertServiceService.error();
    }
  )
  }

  postByFilterSubjectData() {
    const filterData = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      limit: this.limit,  
      page: this.page     
    };
  
    this.httpService.post('subjects/getsubjects/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allSubjects = data.results;
          this.total = data.totalResults;
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          }
        } else {
          this.allSubjects = [];
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Subjects Not Found");
        this.allSubjects = [];
      }
    );
  }
  
  postBySearchData() {
    if (!this.searchBox.trim()) {
       this.allSubjects = [];
      // this.showAllSubjects(); // Show all subjects as per condition
      return ;
    }
  const searchData = {
    search: this.searchBox,  // search term entered by the user
    limit: this.limit,       // items per page
    page : this.page,          // current page number
  };

  this.httpService.post('subjects/getsubjects/filter', searchData).subscribe(
    (data: any) => {
      if (data.results.length > 0) {
        this.allSubjects = data.results;  // update subjects list
        this.total = data.totalResults;   // update total count for pagination
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total,
        };
      } else {
        this.allSubjects = [];  // No subjects found, clear the list
      }
    },
    (error) => {
      console.error('Error fetching filtered subjects:', error);
      this.alertServiceService.customSearchError("Subject Not Found, Try Different Search");  // Show an error alert
      this.allSubjects = [];  // No subjects found, clear the list
    }
  );
}


  getAllBoard(){
    this.httpService.get('boards').subscribe((data:any)=>{
      if(data.results.length > 0){
        this.allBoards = data.results;
        console.log(data.result);
        
      }
    })
  }
  getAllClass(){
    this.httpService.get('classes').subscribe((data:any)=>{
      if(data.results.length > 0){
        this.allClasses = data.results;
      }
    })
  }
  getAllMedium(){
    this.httpService.get('medium').subscribe((data:any)=>{
      if(data.results.length > 0){
        this.allMediums = data.results;
      }
    })
  }

  showAllSubjects(){
    if (this.boardId && this.mediumId && this.classId) {
      this.postByFilterSubjectData();
    }
     else {
      this.postBySearchData();
    }
  }

  go(){
    this.page = 1;
    this.searchBox = "";
    this.postByFilterSubjectData();
    this.cancel();
  }

  // Method triggered when search input changes
  onSearchChange() {
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.page = 1;
    this.cancel();              // Reset to page 1 whenever search changes
    this.postBySearchData();    // Perform the search
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
      };
      reader.readAsDataURL(file);
    }
  }


}
