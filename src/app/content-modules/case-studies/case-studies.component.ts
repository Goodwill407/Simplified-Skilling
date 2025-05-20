import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { caseStudiesClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.css']
})
export class CaseStudiesComponent {

  searchBox!: string;

  caseStudiesForm!: FormGroup;
  caseStudiesModel!: caseStudiesClass;

  isCaseStudyExist: string = ''; // This property tracks the verification status
  isCaseStudyVerified: boolean = false; // Initially false

  // Property to store filtered case studies
  allCaseStudies: any[] = [];

  // modules
  boardId = ''
  mediumId = ''
  classId = ''
  subjectId = ''
  bookId = ''
  chapterId = ''
  lessonId = ''
   
  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  activeTab: string = 'create';
  selectedFile: File | null = null;

  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allChapters!: any[];
  allBoards!: any[];
  allSubjects: any[] = [];
  allbooks!: any[];
  uploadedFileName: string = '';

  caseStudiesUploadForm!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;

  

  formType: string = "Save";
  allLessons: any[] = [];
  selectedCaseStudy: any;
  duplicatesCount: any;
  Uploadedcount: any;
  duplicateCaseListInFile: any = [];
  duplicateCases: any;
  
  constructor(
    private fb: FormBuilder, 
    private alertService: AlertServiceService, 
    private httpService: HttpServiceService
  ) { }

  ngOnInit() {
    this.initializeValidations();
    this.initializeBulkUploadForm();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
  }

  get f() { return this.caseStudiesForm.controls; }

  get questions(): FormArray {
    return this.caseStudiesForm.get('questions') as FormArray;
  }
  
  getAllBoards() {
    this.httpService.get('boards?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    });
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    })
  }

  getAllClasses() {
    this.httpService.get('classes?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    })
  }
    
  onSearchChange(){
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.subjectId='';
    this.bookId='';
    this.chapterId='';
    this.lessonId=''
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchCaseStudyData();    // Perform the search
    // this.cancel();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    
    if (tab === 'create') {
      // Reset create form and clear dependent dropdowns if needed.
      this.caseStudiesForm.reset();
      this.isCaseStudyVerified = false;
      this.formType = 'Save';
      // this.isQuestionExist = '';
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
    } else if (tab === 'view') {
      // Clear filter variables and dependent dropdown lists.
      this.boardId = '';
      this.mediumId = '';
      this.classId = '';
      this.subjectId = '';
      this.bookId = '';
      this.chapterId = '';
      this.lessonId = '';
      this.searchBox = '';
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
    } else if (tab === 'bulk') {
      // Reset the bulk upload form and file input.
      // this.homeworkUploadForm.reset();aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      this.selectedFile = null;
      this.uploadedFileName = '';
      // this.duplicateHomework = []; sasaaaaaaaaaaaaaaaaaaaaaaaaa
      this.boardId = '';
      this.mediumId = '';
      this.classId = '';
      this.subjectId = '';
      this.bookId = '';
      this.chapterId = '';
      this.lessonId = '';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  getByFilterSubjectData() {
    if (this.caseStudiesForm.value.boardId && this.caseStudiesForm.value.mediumId && this.caseStudiesForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.caseStudiesForm.value.boardId}/${this.caseStudiesForm.value.mediumId}/${this.caseStudiesForm.value.classId}`)
        .subscribe((data: any) => {
          this.caseStudiesForm.controls['subjectId'].reset();
          this.caseStudiesForm.controls['bookId'].reset()
          this.caseStudiesForm.controls['chapterId'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
          } else {
            this.allSubjects = [];
          }
          this.allbooks = [];
          this.allChapters = [];
        });
    }
  }

  getByFilterSubjectDataSelect() {
    if (this.boardId && this.mediumId && this.classId) {
      this.httpService.get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
        .subscribe((data: any) => {
          this.caseStudiesForm.controls['subjectId'].reset();
          this.caseStudiesForm.controls['bookId'].reset()
          this.caseStudiesForm.controls['chapterId'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
          } else {
            this.allSubjects = [];
          }
          this.allbooks = [];
          this.allChapters = [];
        });
    }
  }

  getByFilterSubjectDataselectBulk() {
    if (this.caseStudiesUploadForm.value.boardId && this.caseStudiesUploadForm.value.mediumId && this.caseStudiesUploadForm.value.classId) {
        this.httpService.get(`subjects/filter/${this.caseStudiesUploadForm.value.boardId}/${this.caseStudiesUploadForm.value.mediumId}/${this.caseStudiesUploadForm.value.classId}`)
            .subscribe((data: any) => {
                this.caseStudiesUploadForm.controls['subjectId'].reset();
                this.caseStudiesUploadForm.controls['bookId'].reset();
                this.caseStudiesUploadForm.controls['chapterId'].reset();
                
                if (data.length > 0) {
                    this.allSubjects = data;
                } else {
                    this.allSubjects = [];
                }
                
                this.allbooks = [];
                this.allChapters = [];
                this.allLessons = [];
            });
    }
  }
  
  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.caseStudiesForm.controls['bookId'].reset()
        this.allbooks = data;
        if (showForUpdate) {
          this.getChapterByBookId(event)
        }
      }, (error) => {
        this.alertService.error();
      })
    }
  };

  getChapterByBookId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.bookId;
      this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
        this.caseStudiesForm.controls['chapterId'].reset()
        this.allChapters = data;
      }, (error) => {
        this.alertService.error();
      }
      )
    }
  };

  getLessonByChapter(event: any): void {
    if (event) {
      // Get chapter id from the event (either from event.target.value or event.chapterId)
      const chapterId = event.target?.value ? event.target.value : event.chapterId;
      // Call your API to fetch lessons/topics based on chapter id.
      this.httpService.getById('lession/getallLession', chapterId).subscribe(
        (data: any) => {
          // Assign the fetched topics to your property that is bound to the Topic dropdown.
          this.allLessons = data;
        },
        (error) => {
          this.alertService.error();
        }
      );
    }
  }
  
  getmultiBychapterId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.chapterId;
      this.httpService.getById('lession/getallLession', id).subscribe(
        (data: any) => {
          // console.log("Fetched topics:", data); // Debugging line
          
          this.allLessons = data;
        },
        (error) => {
          // console.error("Error fetching topics:", error); // Debugging line
          this.alertService.error();
        }
      );
    }
  }
  
  initializeBulkUploadForm() {
    this.caseStudiesUploadForm = this.fb.group({
      boardId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      chapterId: [null, [Validators.required]],
      lessonId: [null, [Validators.required]],
    });
  }

  initializeValidations() {
    this.caseStudiesForm = this.fb.group({
      boardId: [null, Validators.required],
      mediumId: [null, Validators.required],
      classId: [null, Validators.required],
      subjectId: [null, Validators.required],
      bookId: [null, Validators.required],
      chapterId: [null, Validators.required],
      lessonId: [null, Validators.required],
      case: [null, Validators.required],
      questions: this.fb.array([ this.createQuestionGroup() ], Validators.required),
      id: [null]  
    });
  }
  
  createQuestionGroup(): FormGroup {
    return this.fb.group({
      question: [null, Validators.required],
      answer: [null, Validators.required]
    });
  }

  // sanitizeHtml(input: string): string {
  //   const sanitizedText = input.replace(/<\/?[^>]+(>|$)/g, '');
  //   const sanitizedAndNewlinesRemoved = sanitizedText.replace(/\n/g, '');
  //   const decodedText = document.createElement('textarea');
  //   decodedText.innerHTML = sanitizedAndNewlinesRemoved;
  //   return decodedText.value;
  // }

  
  verifyCaseStudy() {
    // Get and sanitize the case study text
    const caseStudyText: string = this.caseStudiesForm.get('case')?.value || '';
    // const caseStudyText: string = this.sanitizeHtml(this.caseStudiesForm.get('case')?.value || '');
    
    // Validate that the case study text is not empty
    if (!caseStudyText.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Case Study',
        text: 'Please enter a valid case study text before verifying.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Check that all required dropdown fields are filled
    if (
      !this.caseStudiesForm.value.boardId ||
      !this.caseStudiesForm.value.mediumId ||
      !this.caseStudiesForm.value.classId ||
      !this.caseStudiesForm.value.subjectId ||
      !this.caseStudiesForm.value.bookId ||
      !this.caseStudiesForm.value.chapterId ||
      !this.caseStudiesForm.value.lessonId
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Select All Dropdowns',
        text: 'Please fill all required fields before verifying the case study.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Build the payload using the sanitized case study text and dropdown values
    const payload = {
      caseStudy: caseStudyText,
      boardId: this.caseStudiesForm.get('boardId')?.value,
      mediumId: this.caseStudiesForm.get('mediumId')?.value,
      classId: this.caseStudiesForm.get('classId')?.value,
      subjectId: this.caseStudiesForm.get('subjectId')?.value,
      bookId: this.caseStudiesForm.get('bookId')?.value,
      chapterId: this.caseStudiesForm.get('chapterId')?.value,
      lessonId: this.caseStudiesForm.get('lessonId')?.value
    };
  
    // Call the API endpoint for checking if the case study exists
    this.httpService.post('case-study/checkexist', payload).subscribe(
      (response: any) => {
        // If the case study exists, assume the API returns a success response.
        Swal.fire({
          icon: 'error',
          title: 'Case Study Exists',
          text: 'This case study already exists!',
          confirmButtonText: 'OK'
        });
        // Optionally disable further editing of the case study field.
      },
      (error) => {
        // If the error message indicates that the case study does not exist:
        if (error.error && error.error.message && error.error.message.toLowerCase().includes("no exists")) {
          Swal.fire({
            icon: 'success',
            title: 'Case Study Verified',
            text: 'Case study verified – please complete the remaining fields.',
            confirmButtonText: 'OK'
          });
          this.isCaseStudyVerified = true;
          // Optionally, enable any additional fields for further editing.
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Something went wrong during verification.',
            confirmButtonText: 'OK'
          });
          this.isCaseStudyVerified = false;
        }
      }
    );
  }
  
// Method to add another question–answer pair to the FormArray
addMoreQuestion() {
  (this.caseStudiesForm.get('questions') as FormArray).push(this.createQuestionGroup());
}

removeQuestion(index: number): void {
  const questionsArray = this.caseStudiesForm.get('questions') as FormArray;
  // Optionally, prevent deletion if only one question remains.
  if (questionsArray.length > 1) {
    questionsArray.removeAt(index);
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Cannot Delete',
      text: 'At least one question is required.',
      confirmButtonText: 'OK'
    });
  }
}


  cancel() {
    this.submitted = false;
    this.formType = "Save";
    this.caseStudiesForm.reset();
  }

  submitForm() {
    this.submitted = true;
    
    // If the form is invalid, exit early.
    if (this.caseStudiesForm.invalid) {
      return;
    }
    
    // Check formType to decide whether to save a new case study or update an existing one.
    if (this.formType === 'Save') {
      this.saveCaseStudy();
    } else if (this.formType === 'Update') {
      this.updateCaseStudy();
    }
  }
  

  saveCaseStudy() {
    this.submitted = true;
    
    // If the form is invalid, exit early.
    if (this.caseStudiesForm.invalid) {
      return;
    }
    
    // Get the raw value (including disabled controls if any)
    const payload: any = this.caseStudiesForm.getRawValue();
  
    // Sanitize the case study text
    payload.case = (payload.case);
    // payload.case = this.sanitizeHtml(payload.case);
  
    // Loop through each question group and sanitize question and answer fields
    payload.questions = payload.questions.map((q: any) => ({
      question: (q.question),
      answer: (q.answer)
      // question: this.sanitizeHtml(q.question),
      // answer: this.sanitizeHtml(q.answer)
    }));
    
    // Log payload for debugging
    console.log('Case Study Payload:', payload);
    
    // Call the API to save the case study
    this.httpService.post('case-study', payload).subscribe(
      (response: any) => {
        this.alertService.customSuccess('Case Study saved successfully!');
        // Reset the form and submitted flag after successful save
        this.caseStudiesForm.reset();
        this.submitted = false;
        this.isCaseStudyVerified = false;
      },
      (error: any) => {
        this.alertService.customError('Failed to save Case Study.');
      }
    );
  }
  
  updateCaseStudy() {
    // Get the raw form value including disabled fields
    const payload: any = this.caseStudiesForm.getRawValue();
  
    // Sanitize the case study text
    payload.case = (payload.case);
    // payload.case = this.sanitizeHtml(payload.case);
    
    // Loop through the questions array and sanitize each question and answer
    payload.questions = payload.questions.map((q: any) => ({
      question: (q.question),
      answer: (q.answer)
      // question: this.sanitizeHtml(q.question),
      // answer: this.sanitizeHtml(q.answer)
    }));
  
    // Ensure the payload includes an identifier for update
    // if (!payload.id) {
    //   // Optionally, you might remove the id if it's null/undefined
    //   delete payload.id;
    // }
  
    // Send a PATCH request for updating an existing case study.
    this.httpService.patch('case-study/', payload).subscribe(
      (response: any) => {
        this.alertService.customSuccess("Case Study updated successfully!");
        // this.caseStudiesForm.reset();
        this.submitted = false;
        this.cancel();
        this.showCaseStudies();
      },
      (error: any) => {
        this.alertService.customError("Failed to update Case Study.");
      }
    );
  }
  
  // Method to call the filter API using POST
postByFilterCaseStudyData() {
  const filterData = {
    boardId: this.boardId,
    mediumId: this.mediumId,
    classId: this.classId,
    subjectId: this.subjectId,
    bookId: this.bookId,
    chapterId: this.chapterId,
    lessonId: this.lessonId,
    limit: this.limit,
    page: this.page
  };

  this.httpService.post('case-study/get-by/filter', filterData).subscribe(
    (data: any) => {
      if (data.results && data.results.length > 0) {
        this.allCaseStudies = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total
        };
      } else {
        this.allCaseStudies = [];
      }
    },
    (error) => {
      console.error('Error fetching case studies:', error);
      this.alertService.customError("Case Studies Not Found");
      this.allCaseStudies = [];
    }
  );
}

// Method for searching (if a search term is provided)
postBySearchCaseStudyData() {
  if (!this.searchBox.trim()) {
    this.allCaseStudies = [];
    return;
  }
  const searchData = {
    search: this.searchBox,
    limit: this.limit,
    page: this.page
  };

  this.httpService.post('case-study/get-by/filter', searchData).subscribe(
    (data: any) => {
      if (data.results && data.results.length > 0) {
        this.allCaseStudies = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total
        };
      } else {
        this.allCaseStudies = [];
      }
    },
    (error) => {
      console.error('Error fetching case studies:', error);
      this.alertService.customError("Case Studies Not Found, Try Different Search");
      this.allCaseStudies = [];
    }
  );
}

// A method to decide which method to call
showCaseStudies() {
  if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lessonId) {
    this.postByFilterCaseStudyData();
  } else {
    this.postBySearchCaseStudyData();
  }
}

// "Go" button method
go() {
  this.page = 1;
  this.searchBox = "";
  this.postByFilterCaseStudyData();
}

// Pagination change methods (if not already defined)
pageChangeEvent(pageNumber: number): void {
  this.page = pageNumber;
  this.showCaseStudies();
}

selectPaginationSize(event: any) {
  if (event.target.value) {
    this.limit = event.target.value;
    this.page = 1;
    this.showCaseStudies();
  }
}

edit_CaseStudy(data: any): void {
  this.httpService.get('case-study/' + data.id).subscribe(
    (cs: any) => {
      if (cs) {
        this.formType = "Update";
        this.submitted = false;
        this.isCaseStudyVerified = true;

        // 🧹 Step 1: CLEAR previous dropdown arrays
        this.allSubjects = [];
        this.allbooks = [];
        this.allChapters = [];
        this.allLessons = [];

        // Step 2: Fetch all new dropdowns parallelly
        Promise.all([
          this.httpService.get(`subjects/filter/${cs.boardId}/${cs.mediumId}/${cs.classId}`).toPromise(),
          this.httpService.getById('books/subject', cs.subjectId).toPromise(),
          this.httpService.getById('chapter/getChaptersByBookid', cs.bookId).toPromise(),
          this.httpService.getById('lession/getallLession', cs.chapterId).toPromise()
        ])
        .then(([subjects, books, chapters, lessons]) => {
          // Step 3: Fill lists
          this.allSubjects = subjects;
          this.allbooks = books;
          this.allChapters = chapters;
          this.allLessons = lessons;

          // Step 4: Now patch form
          this.caseStudiesForm.patchValue({
            boardId: cs.boardId,
            mediumId: cs.mediumId,
            classId: cs.classId,
            subjectId: cs.subjectId,
            bookId: cs.bookId,
            chapterId: cs.chapterId,
            lessonId: cs.lessonId,
            case: cs.case ? cs.case.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : null,
            id: cs.id
          });

          // Step 5: Clear and patch questions array
          const questionsArray = this.caseStudiesForm.get('questions') as FormArray;
          questionsArray.clear();
          if (cs.questions && cs.questions.length > 0) {
            cs.questions.forEach((q: any) => {
              questionsArray.push(this.fb.group({
                question: [this.decodeHtmlEntities(q.question), Validators.required],
                answer: [this.decodeHtmlEntities(q.answer), Validators.required]
              }));
            });
          } else {
            questionsArray.push(this.createQuestionGroup());
          }
        })
        .catch((error) => {
          console.error('Dropdown fetching failed', error);
          this.alertService.error();
        });
      }
    },
    (error) => {
      this.alertService.error();
    }
  );
}



delete_CaseStudy(data: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpService.delete('case-study', data.id).subscribe(
        (response: any) => {
          this.alertService.customSuccess('Case Study deleted successfully!');
          // Refresh your list of case studies. For example:
          this.showCaseStudies();
        },
        (error: any) => {
          this.alertService.customError('Failed to delete case study.');
        }
      );
    }
  });
}

view_CaseStudy(data: any): void {
  // Example: open a modal or route to a detail page
  // If you want a simple modal, you might do something like:
  this.selectedCaseStudy = data; // store in a property
  // console.log(this.selectedCaseStudy);
  // Then open a modal with the full case text, or do a router navigate.
}

onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
      this.selectedFile = file;
      this.uploadedFileName = file.name;  // Store the selected file name
  }
}

// Bulk Upload Logic
uploadBulkCaseStudies(): void {
  if (!this.selectedFile) {
      Swal.fire({
          icon: 'error',
          title: 'No File Selected',
          text: 'Please select a CSV file to upload.',
          confirmButtonText: 'OK',
      });
      return;
  }

  // Check if all IDs are selected
  if (!this.caseStudiesUploadForm.value.boardId || 
      !this.caseStudiesUploadForm.value.mediumId || 
      !this.caseStudiesUploadForm.value.classId || 
      !this.caseStudiesUploadForm.value.subjectId || 
      !this.caseStudiesUploadForm.value.bookId || 
      !this.caseStudiesUploadForm.value.chapterId || 
      !this.caseStudiesUploadForm.value.lessonId
  ) {
      Swal.fire({
          icon: 'error',
          title: 'Incomplete Form',
          text: 'Please select all required fields before uploading.',
          confirmButtonText: 'OK',
      });
      return;
  }

  const formData = new FormData();
  formData.append('boardId', this.caseStudiesUploadForm.value.boardId);
  formData.append('mediumId', this.caseStudiesUploadForm.value.mediumId);
  formData.append('classId', this.caseStudiesUploadForm.value.classId);
  formData.append('subjectId', this.caseStudiesUploadForm.value.subjectId);
  formData.append('bookId', this.caseStudiesUploadForm.value.bookId);
  formData.append('chapterId', this.caseStudiesUploadForm.value.chapterId);
  formData.append('lessonId', this.caseStudiesUploadForm.value.lessonId);
  formData.append('file', this.selectedFile);

  this.httpService.post('case-study/bulk-upload', formData).subscribe(
      (res: any) => {
          // Display success message
          Swal.fire({
              icon: 'success',
              title: 'Upload Successful',
              text: `Uploaded Questions: ${res.uploadedCount}, Duplicates Found: ${res.duplicatesInDatabaseCount}, Uploaded File Name: ${this.uploadedFileName}`,
              confirmButtonText: 'OK',
          });

          // Update duplicate count and uploaded count
          this.duplicatesCount = res.duplicatesInDatabaseCount;
          this.Uploadedcount = res.uploadedCount;
          this.duplicateCaseListInFile = [];
          this.duplicateCases = res.duplicateCaseStudies;

          // Reset form and file selection
          this.caseStudiesUploadForm.reset();
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';  // Clear the actual file input
          this.initializeBulkUploadForm();
      },
      (error) => {
        if (error.error && error.error.message === "Duplicate case studies found in the uploaded file.") {
          this.duplicateCaseListInFile = error.error.duplicateCaseStudiesInFile || [];  // Store duplicate questions
          this.duplicatesCount = 0;
          this.Uploadedcount = 0;
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: `Duplicate cases found in the uploaded file. (File name - ${this.uploadedFileName}). Please try again.`,
            confirmButtonText: 'OK',
        });
        } else {
          console.error('❌ Error during upload:', error);
          Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: `Something went wrong during upload (File name - ${this.uploadedFileName}). Please try again.`,
              confirmButtonText: 'OK',
          });
        }
      }
  );
}

downloadSampleFile() {
  const sampleFileUrl = 'assets/files/sample_Casestudy_Upload.csv';
  const link = document.createElement('a');
  link.href = sampleFileUrl;
  link.download = 'Sample-Case-Study.csv';
  link.click();
}

decodeHtmlEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

}
