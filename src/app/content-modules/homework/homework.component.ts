import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomeworkClass, quickRecapClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import Swal from 'sweetalert2';

enum AnswerTypeEnum {
  'Very Short Answer' = 1,
  'Short Answer' = 2,
  'Long Answer' = 3
}

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent {

  homeworkForm!: FormGroup;
  homeworkModel!: HomeworkClass;
  twoWay: any;
  searchBox!: string;
  activeTab: string = 'create';

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allChapters!: any[];
  allChaptersForShow!: any[];
  allBoards!: any[];
  allSubjects: any[] = [];
  allbooks!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  allHomework!: any[];
  formType: string = "Save";
  selectedChapter: string = "select chapter";

  boardId = ''
  mediumId = ''
  classId = ''
  subjectId = ''
  bookId = ''
  chapterId = ''

  lessonId: string = '';          // New property for the selected topic
  //allmulti: any[] = [];           // Reusing the variable name from your snippet for topics
  isQuestionExist: string = ''; // Will be set to 'Exist' or 'Not exist'
  allLessons: any[] = []; // For topics; you might reuse "allmulti" or similar

  totalQuestions: number = 0;
  groupedData: any[] = [];  // To store summary groups from API

  // New variable for toggling the stats view
  showStats: boolean = false;
  hideOnSearch = true;

  // For bulk upload
  homeworkUploadForm!: FormGroup;
  selectedFile: File | null = null;
  uploadedFileName: string = '';
  duplicateHomework: string[] = [];
  duplicatesInDatabaseCount: number = 0;
  uploadedCount: number = 0;

  expandedRowIndex: number | null = null;

  // Access file input element (optional for clearing file input)
  @ViewChild('fileInput') fileInput!: ElementRef;
  duplicateHomeworkDb: any;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.homeworkForm.controls; }
  get fBulk() { return this.homeworkUploadForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.initializeBulkUploadForm();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getAllSubjects();
    this.getAllChapters();
    // this.getAllHomework();
  }

  initializeValidations() {
    this.homeworkForm = this.fb.group({
      boardId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      chapterId: [null, [Validators.required]],
      Question: [null, [Validators.required]],
      // veryShortAnswer: [null, [Validators.required]],
      // shortAnswer: [null, [Validators.required]],
      // longAnswer: [null, [Validators.required]],
      lessonId: [null, [Validators.required]],  // New control for Topic
      answer: [{ value: null, disabled: true }, Validators.required],
      answerType:[ null, Validators.required],
      questionLevel: [null, [Validators.required, Validators.pattern('^[1-4]$')]],
      audioPath: [null],
      id: [null] // Changed from '' to null
    });
  };

  // In your HomeworkComponent class
  levelMapping: { [key: number]: string } = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Common'
};

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

  // getAllSubjects() {
  //   this.httpService.get('subjects?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
  //     if (data.results.length > 0) {
  //       this.allSubjects = data.results;
  //     }
  //   }, (error) => {
  //     this.alertServiceService.error();
  //   })
  // }

  getAllChapters() {
    this.httpService.get('chapter?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allChaptersForShow = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getAllHomework() {
    this.httpService.get('homework?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allHomework = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      } else {
        this.allHomework = [];
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    // this.getAllHomework();
    this.showHomeworkData();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      // this.getAllHomework();
      this.showHomeworkData();
    }
  }

  cancel() {
    this.submitted = false;
    this.formType = "Save";
    this.homeworkForm.reset();
  }

  resetValue() {
    this.submitted = false;
    // this.homeworkForm.controls.chapterId.reset();
    this.homeworkForm.controls.Question.reset();
    this.homeworkForm.controls.answer.reset();
    this.homeworkForm.controls.questionLevel.reset();
    this.homeworkForm.controls.answerType.reset();
  }

  submitForm() {
    console.log(this.homeworkForm)
    this.submitted = true;
    if (this.homeworkForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveHomework();
    } else if (this.formType == "Update") {
      this.updateHomework();
    }
  }

  saveHomework() {
    this.homeworkModel = this.homeworkForm.value;
    this.homeworkModel.Question = (this.homeworkForm.value.Question);
    this.homeworkModel.answer = (this.homeworkForm.value.answer);
    // this.homeworkModel.Question = this.sanitizeHtml(this.homeworkForm.value.Question);
    // this.homeworkModel.answer = this.sanitizeHtml(this.homeworkForm.value.answer);
    
    // this.homeworkModel.shortAnswer = this.sanitizeHtml(this.homeworkForm.value.shortAnswer);
    // this.homeworkModel.longAnswer = this.sanitizeHtml(this.homeworkForm.value.longAnswer);
    delete this.homeworkModel.id
    this.httpService.post('homework', this.homeworkModel).subscribe((data: any) => {
      this.alertServiceService.success();
      // this.getAllHomework();
      this.resetValue();
      this.homeworkForm.reset();
      // Reset flag so additional fields remain hidden next time
      this.isQuestionExist = '';
      console.log(this.homeworkForm);

    },
      (error) => {
        this.alertServiceService.error();
      })
  }

  updateHomework() {
    this.homeworkModel = this.homeworkForm.value;
    this.homeworkModel.Question = (this.homeworkForm.value.Question);
    this.homeworkModel.answer = (this.homeworkForm.value.answer); // Updated line
    // this.homeworkModel.Question = this.sanitizeHtml(this.homeworkForm.value.Question);
    // this.homeworkModel.answer = this.sanitizeHtml(this.homeworkForm.value.answer);

    this.httpService.patch('homework', this.homeworkModel).subscribe((data: any) => {
      this.alertServiceService.update();
      this.cancel();
      this.showHomeworkData();
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  
  
  // sanitizeHtml(input: string): string {
  //   const sanitizedText = input.replace(/<\/?[^>]+(>|$)/g, '');
  //   const sanitizedAndNewlinesRemoved = sanitizedText.replace(/\n/g, '');
  //   const decodedText = document.createElement('textarea');
  //   decodedText.innerHTML = sanitizedAndNewlinesRemoved;
  //   return decodedText.value;
  // }

  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.homeworkForm.controls['bookId'].reset()
        this.allbooks = data;
        if (showForUpdate) {
          this.getChapterByBookId(event)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  };

  getChapterByBookId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.bookId;
      this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
        this.homeworkForm.controls['chapterId'].reset()
        this.allChapters = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };

  edit_Homework(data: any) {
    // Reset dropdown lists first
    this.allSubjects = [];
    this.allbooks = [];
    this.allChapters = [];
    this.allLessons = [];
  
    this.httpService.get('homework/' + data.id).subscribe((res: any) => {
      if (res) {
        this.formType = "Update";
  
        // Step 1: patch static fields immediately
        this.homeworkForm.patchValue({
          boardId: res.boardId,
          mediumId: res.mediumId,
          classId: res.classId,
          id: res.id,
        });
  
        // Step 2: Fetch dependent dropdowns first
        this.getSubjectsForEdit(res, () => {
          this.getBooksForEdit(res, () => {
            this.getChaptersForEdit(res, () => {
              this.getLessonsForEdit(res, () => {
                // Step 3: Finally patch dynamic fields after all dropdowns loaded
                setTimeout(() => {
                  this.homeworkForm.patchValue({
                    subjectId: res.subjectId,
                    bookId: res.bookId,
                    chapterId: res.chapterId,
                    lessonId: res.lessonId,
                    Question: res.Question.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
                    answer: res.answer ? res.answer.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : null,
                    answerType: res.answerType,
                    questionLevel: res.questionLevel,
                    audioPath:res.audioPath
                  });
                  // Enable answer fields after patching
                  this.homeworkForm.get('answer')?.enable();
                  this.homeworkForm.get('answerType')?.enable();
                  this.homeworkForm.get('questionLevel')?.enable();
                }, 200);  // Small timeout to ensure dropdowns rendered
              });
            });
          });
        });
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  getSubjectsForEdit(res: any, callback: Function) {
    this.httpService.get(`subjects/filter/${res.boardId}/${res.mediumId}/${res.classId}`).subscribe((data: any) => {
      this.allSubjects = data;
      callback();
    });
  }
  
  getBooksForEdit(res: any, callback: Function) {
    this.httpService.getById('books/subject', res.subjectId).subscribe((data: any) => {
      this.allbooks = data;
      callback();
    });
  }
  
  getChaptersForEdit(res: any, callback: Function) {
    this.httpService.getById('chapter/getChaptersByBookid', res.bookId).subscribe((data: any) => {
      this.allChapters = data;
      callback();
    });
  }
  
  getLessonsForEdit(res: any, callback: Function) {
    this.httpService.getById('lession/getallLession', res.chapterId).subscribe((data: any) => {
      this.allLessons = data;
      callback();
    });
  }
  
  

  delete_Homework(data: any) {
    this.httpService.delete('homework', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.showHomeworkData();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getByFilterSubjectData() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        this.homeworkForm.controls['subjectId'].reset()
        this.homeworkForm.controls['lessonId'].reset();  // Reset lessonId as well
        if (data.length > 0) {
          this.allSubjects = data;
        }
        else {
          this.allSubjects = [];
        }
          this.allbooks = [];
          this.allChapters = [];
          this.subjectId ='';
          this.bookId = '';
          this.chapterId = '';
          this.lessonId = '';
      });
  }

  getByFilterSubjectDataselect() {
    if (this.homeworkForm.value.boardId && this.homeworkForm.value.mediumId && this.homeworkForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.homeworkForm.value.boardId}/${this.homeworkForm.value.mediumId}/${this.homeworkForm.value.classId}`)
        .subscribe((data: any) => {
          this.homeworkForm.controls['subjectId'].reset()
          this.homeworkForm.controls['bookId'].reset()
          this.homeworkForm.controls['chapterId'].reset()
          this.homeworkForm.controls['lessonId'].reset();  // Reset lessonId as well
          if (data.length > 0) {
            this.allSubjects = data;
          }
          else {
            this.allSubjects = [];
          }
          this.allbooks = [];
          this.allChapters = [];
        });
    }
  }

  getByFilterViewData() {
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId) {
      const apiUrl = `homework/get-by/filter?boardId=${this.boardId}&mediumId=${this.mediumId}&classId=${this.classId}&bookId=${this.bookId}&subjectId=${this.subjectId}&chapterId=${this.chapterId}`;

      this.httpService.get(apiUrl).subscribe((data: any) => {
        if (data && data.length > 0) {
          this.allHomework = data
        }
      });
    } else {
      this.alertServiceService.customError("Please select all data");
    }
  }

  postByFilterHomeworkData() {
    const filterData:any = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      subjectId: this.subjectId,
      bookId: this.bookId,
      chapterId: this.chapterId,
      lessonId: this.lessonId, // Include the new filter
      limit: this.limit,
      page: this.page
    };
  
    this.httpService.post('homework/get-by/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allHomework = data.results;       // Assign fetched homework data
          this.total = data.totalResults;        // Update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
          this.getHomeworkSummary();  // Get summary along with filtering data
        } else {
          this.allHomework = [];                 // Clear array if no homework found
        }
      },
      (error) => {
        console.error('Error fetching Homework:', error);
        this.alertServiceService.customSearchError("Homework Not Found");
        this.allHomework = [];                   // Clear array on error
      }
    );
  }
  
  postBySearchHomeworkData() {
    if (!this.searchBox.trim()) {
      this.allHomework = [];
      return ;
    }
    const searchData = {
      search: this.searchBox,    // user-entered search term
      limit: this.limit,         // items per page
      page: this.page,                   // reset to first page for new searches
    };
  
    this.httpService.post('homework/get-by/filter', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allHomework = data.results;       // update homework array with results
          this.total = data.totalResults;        // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allHomework = [];                 // clear if no homework found
        }
      },
      (error) => {
        console.error('Error fetching Homework:', error);
        this.alertServiceService.customSearchError("Homework Not Found, Try Different Search");
        this.allHomework = [];                 // clear if no homework found
      }
    );
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    
    if (tab === 'create') {
      // Reset create form and clear dependent dropdowns if needed.
      this.homeworkForm.reset();
      this.formType = 'Save';
      this.isQuestionExist = '';
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
      this.homeworkUploadForm.reset();
      this.selectedFile = null;
      this.uploadedFileName = '';
      this.duplicateHomework = [];
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
  
  

go(){
  this.page = 1;
  this.searchBox = "";
  this.hideOnSearch = true;
  this.postByFilterHomeworkData();
}

onSearchChange(){
  this.boardId='';
  this.classId='';
  this.mediumId='';
  this.subjectId='';
  this.bookId='';
  this.chapterId='';
  this.lessonId = '';
  this.page = 1;              // Reset to page 1 whenever search changes
  this.hideOnSearch = false;
  this.postBySearchHomeworkData();    // Perform the search
  // this.cancel();
}

showHomeworkData(){
  if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId ) {
    this.postByFilterHomeworkData();
  } else {
    this.postBySearchHomeworkData();
  }
}

getLessonByChapter(event: any) {
  if (event) {
    const id = event.target?.value ? event.target.value : event.chapterId;
    // this.httpService.getById('lecture-video/get/all-lecture', id).subscribe((data: any) => {
    //   this.allmulti = data;
      this.httpService.getById('lession/getallLession', id).subscribe((data: any) => {
        this.allLessons = data;
    }, (error) => {
      this.alertServiceService.error();
    });
  }
}

 // Method to load lessons based on the selected chapter
 getLessonsByChapter(event: any) {
  if (event) {
    const chapterId = event.target?.value || event.chapterId;
    this.httpService.getById('lession', chapterId).subscribe((data: any) => {
      this.allLessons = data;
    }, error => {
      this.alertServiceService.error();
    });
  }
}

// Verify the question using the checkexist API
verifyQuestion() {
  // Mark form as submitted for validation purposes
  // this.submitted = true;
  
  // Sanitize and get the question value
  // const question: string = this.sanitizeHtml(this.homeworkForm.get('Question')?.value || '');
  const question: string = (this.homeworkForm.get('Question')?.value || '');
  

  if (!question.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Question',
      text: 'Please enter a valid question before verifying.',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Check if all required dropdown fields are filled
  if (
    !this.homeworkForm.value.boardId ||
    !this.homeworkForm.value.mediumId ||
    !this.homeworkForm.value.classId ||
    !this.homeworkForm.value.subjectId ||
    !this.homeworkForm.value.bookId ||
    !this.homeworkForm.value.chapterId ||
    !this.homeworkForm.value.lessonId || 
    !this.homeworkForm.value.answerType || 
    !this.homeworkForm.value.questionLevel
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Select All Dropdowns',
      text: 'Please fill all required fields before verifying the question.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const payload = {
    Question: (this.homeworkForm.get('Question')?.value),
    // Question: this.sanitizeHtml(this.homeworkForm.get('Question')?.value),
    boardId: this.homeworkForm.get('boardId')?.value,
    mediumId: this.homeworkForm.get('mediumId')?.value,
    classId: this.homeworkForm.get('classId')?.value,
    subjectId: this.homeworkForm.get('subjectId')?.value,
    bookId: this.homeworkForm.get('bookId')?.value,
    chapterId: this.homeworkForm.get('chapterId')?.value,
    lessonId: this.homeworkForm.get('lessonId')?.value,
    questionLevel: this.homeworkForm.get('questionLevel')?.value,
    answerType: this.homeworkForm.get('answerType')?.value,
  };

  this.httpService.post('homework/checkexist', payload).subscribe(
    (response: any) => {
      // If the question exists, it might return a success response.
      this.isQuestionExist = 'Exist';
      this.homeworkForm.get('answer')?.disable();
      this.homeworkForm.get('answerType');
      this.homeworkForm.get('questionLevel');
      this.alertServiceService.customError("Question already exists!");
    },
    (error) => {
      // Check the error response.
      if (error.error && error.error.message && error.error.message.toLowerCase().includes("no exists")) {
        // Treat a 404 error with "No Exists" message as the question not existing.
        this.isQuestionExist = 'Not exist';
        this.homeworkForm.get('answer')?.enable();
        this.homeworkForm.get('answerType')?.enable();
        this.homeworkForm.get('questionLevel')?.enable();
        // this.alertServiceService.customSuccess("Question verified. Please complete the remaining fields.");
      } else {
        this.alertServiceService.error();
      }
    }
  );
}

 // Call the Homework Summary API
 getHomeworkSummary() {
  // Prepare payload with required filter values
  const payload = {
    boardId: this.boardId,
    mediumId: this.mediumId,
    classId: this.classId,
    bookId: this.bookId,
    subjectId: this.subjectId,
    chapterId: this.chapterId,
    lessonId: this.lessonId
  };

  this.httpService.post('homework/homework-summary', payload).subscribe(
    (response: any) => {
      this.totalQuestions = response.totalQuestions;
      this.groupedData = response.groupedData;
    },
    (error) => {
      this.alertServiceService.error();
    }
  );
}

toggleStats(): void {
  this.showStats = !this.showStats;
}

// Reactive form for bulk upload
initializeBulkUploadForm() {
  this.homeworkUploadForm = this.fb.group({
    boardId: [null, Validators.required],
    mediumId: [null, Validators.required],
    classId: [null, Validators.required],
    subjectId: [null, Validators.required],
    bookId: [null, Validators.required],
    chapterId: [null, Validators.required],
    lessonId: [null, Validators.required]  // Topic
  });
}

// File change event for bulk upload
onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.uploadedFileName = file.name;
  }
}

// Download sample CSV file for bulk upload
downloadSampleFile(): void {
  const sampleFileUrl = 'assets/files/sample_Homework_Upload.csv';
  const link = document.createElement('a');
  link.href = sampleFileUrl;
  link.download = 'Sample-Bulk-Homework.csv';
  link.click();
}

 // Bulk upload API call
 // Bulk upload API call
 uploadBulkHomework(): void {
  if (!this.selectedFile) {
    Swal.fire({
      icon: 'error',
      title: 'No File Selected',
      text: 'Please select a CSV file to upload.',
      confirmButtonText: 'OK'
    });
    return;
  }
  // Validate that all bulk-upload fields are provided
  if (
    !this.homeworkUploadForm.value.boardId ||
    !this.homeworkUploadForm.value.mediumId ||
    !this.homeworkUploadForm.value.classId ||
    !this.homeworkUploadForm.value.subjectId ||
    !this.homeworkUploadForm.value.bookId ||
    !this.homeworkUploadForm.value.chapterId ||
    !this.homeworkUploadForm.value.lessonId
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Incomplete Form',
      text: 'Please fill all required fields before uploading.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const formData = new FormData();
  formData.append('boardId', this.homeworkUploadForm.value.boardId);
  formData.append('mediumId', this.homeworkUploadForm.value.mediumId);
  formData.append('classId', this.homeworkUploadForm.value.classId);
  formData.append('subjectId', this.homeworkUploadForm.value.subjectId);
  formData.append('bookId', this.homeworkUploadForm.value.bookId);
  formData.append('chapterId', this.homeworkUploadForm.value.chapterId);
  formData.append('lessonId', this.homeworkUploadForm.value.lessonId);
  formData.append('file', this.selectedFile);

  this.httpService.post('homework/bulk-upload', formData).subscribe(
    (res: any) => {
      // Handle success responses:
      // Case 1: Some homework successfully uploaded
      if (res.uploadedCount > 0) {
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: `Uploaded Homework: ${res.uploadedCount}\nDuplicates in Database: ${res.duplicatesInDatabaseCount}`,
          confirmButtonText: 'OK'
        });
      } 
      // Case 2: Bulk processed but all questions are duplicates in the database
      else if (res.duplicatesInDatabaseCount > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Upload Completed',
          text: `All homework questions already exist.\nDuplicates: ${res.duplicatesInDatabaseCount}`,
          confirmButtonText: 'OK'
        });
      }
      this.duplicatesInDatabaseCount = res.duplicatesInDatabaseCount;
      this.duplicateHomeworkDb = res.duplicateHomework;
      this.uploadedCount = res.uploadedCount;
      this.duplicateHomework = [];
      // Reset bulk upload form and file input
      this.homeworkUploadForm.reset();
      this.selectedFile = null;
      this.uploadedFileName = '';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    },
    (error) => {
      // Handle error: duplicate questions found in the uploaded file
      if (error.error && error.error.message === "Duplicate questions found in the uploaded file.") {
        const duplicates = error.error.duplicateQuestions || [];
        this.duplicateHomework = duplicates
        this.duplicateHomeworkDb = [];
        this.duplicatesInDatabaseCount = 0;
        this.uploadedCount = 0;
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: `Duplicate questions found in the uploaded file: ${duplicates.join(', ')}`,
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Something went wrong during upload. Please try again.',
          confirmButtonText: 'OK'
        });
        this.duplicateHomeworkDb = [];
        this.duplicateHomework = [];
        this.duplicatesInDatabaseCount = 0;
        this.uploadedCount = 0;
        // Reset bulk upload form and file input
      this.homeworkUploadForm.reset();
      this.selectedFile = null;
      this.uploadedFileName = '';
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      }
    }
  );
}

decodeHtmlEntities(str: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

readonly answerTypeReverseMap: { [key: number]: string } = {
  1: 'Very Short Answer',
  2: 'Short Answer',
  3: 'Long Answer'
};


// Example methods to load dependent dropdowns for bulk upload (you can reuse common methods)
  // For instance, if board, medium, class changes, update subjects etc.
  getByFilterSubjectDataselectUpload() {
    if (this.homeworkUploadForm.value.boardId && this.homeworkUploadForm.value.mediumId && this.homeworkUploadForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.homeworkUploadForm.value.boardId}/${this.homeworkUploadForm.value.mediumId}/${this.homeworkUploadForm.value.classId}`)
        .subscribe((data: any) => {
          this.homeworkUploadForm.controls['subjectId'].reset();
          if (data.length > 0) {
            this.allSubjects = data;
          } else {
            this.allSubjects = [];
          }
          // Also reset dependent dropdowns
          this.homeworkUploadForm.controls['bookId'].reset();
          this.homeworkUploadForm.controls['chapterId'].reset();
          this.homeworkUploadForm.controls['lessonId'].reset();
          this.allbooks = [];
          this.allChapters = [];
          // this.allmulti = [];
          this.allLessons = [];
        });
    }
  }
}
