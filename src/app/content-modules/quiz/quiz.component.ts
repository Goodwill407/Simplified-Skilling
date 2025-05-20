import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder, RequiredValidator } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { QuizClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

   // Statistics
   totalQuestions = 0;

   // MCQ stats (questionType = 1)
   mcqEasy = 0;
   mcqMedium = 0;
   mcqHard = 0;
   mcqCommon = 0;
  
   // True/False stats (questionType = 2)
   tfEasy = 0;
   tfMedium = 0;
   tfHard = 0;
   tfCommon = 0;
 
   // If you have a third question type (questionType = 3), define similarly:
   type3Easy = 0;
   type3Medium = 0;
   type3Hard = 0;
   type3Common = 0;

   // New variable for toggling the stats view
  showStats: boolean = false;
  expandedQuizRowIndex: number | null = null;
  quizeForm!: FormGroup;
  // optionsArray!: FormArray;
  quizClassModel!: QuizClass;
  searchBox!: string;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('fileInput') fileInput!: ElementRef;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  activeTab: string = 'create';

  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allChapters!: any[];
  allLessons!: any[];
  allBoards!: any[];
  allSubjects: any[] = [];
  allbooks!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  allLession!: any[];
  allQuizes!: any[];
  formType: string = "Save";
  dropdownList: any = [
    { itemid: 1, item_text: 'Option 1' },
    { itemid: 2, item_text: 'Option 2' },
    { itemid: 3, item_text: 'Option 3' },
    { itemid: 4, item_text: 'Option 4' }
  ]
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'itemid',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  isQuestionExist: string = '';

  selectedFile: File | null = null;
  uploadedFileName: string = '';
  duplicateQuestionsList: string[] = [];
  duplicatesCount: number = 0;
  Uploadedcount: number = 0;
  duplicateQuizzes: string[] = [];
  quizUploadForm!: FormGroup;

  hideOnSearch:any =true;

  boardId = ''
  mediumId = ''
  classId = ''
  subjectId = ''
  bookId = ''
  chapterId = ''
  lessonId = ''
  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.quizeForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.initializeBulkUploadForm();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getAllSubject();
    this.quizClassModel = this.quizeForm.value;
  }

  initializeBulkUploadForm() {
    this.quizUploadForm = this.fb.group({
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
    this.quizeForm = this.fb.group({
      boardId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      chapterId: [null, [Validators.required]],
      // lessonId: [null, [Validators.required]],
      questionType: ["", [Validators.required]],     // New
      questionLevel: ["", [Validators.required]],    // New
      weightage: [null, [Validators.required, Validators.min(0.1)]],
      negativeWeightage: [null, [Validators.required, Validators.min(0)]],      
      displayFormat:['', [Validators.required]],
      quizName: ["", [Validators.required]],
      lessonId: [null, [Validators.required]],
      // types: [""],
      options: this.fb.array([
        this.createEditorControl(''),
        this.createEditorControl(''),
        this.createEditorControl(''),
        this.createEditorControl('')
      ]),
      correctOptionsTF:[null],
      correctOptions: [null],
      explain: [null, [Validators.required]],
      hint: [null, [Validators.required]],
      marks: 1,
      id: [null],
    });
  };

  private createEditorControl(value: string, validator?: any) {
    return this.fb.control(value, validator);
  }

  get options() {
    return this.quizeForm.get('options') as FormArray;
  }

  verifyQuestion() {
    // Sanitize the quiz name
    // let quiz = this.sanitizeHtml(this.quizeForm.value.quizName);
    let quiz = this.quizeForm.value.quizName;

    if (!quiz.trim()) {  // Check if the quiz is empty or only contains whitespace
        Swal.fire({
            icon: 'error',
            title: 'Invalid Question',
            text: 'Please enter a valid question before verifying.',
            confirmButtonText: 'OK',
        });
        return;
    }

    // Check if the form is filled properly
    if (!this.quizeForm.value.boardId || 
        !this.quizeForm.value.mediumId || 
        !this.quizeForm.value.classId || 
        !this.quizeForm.value.subjectId || 
        !this.quizeForm.value.bookId || 
        !this.quizeForm.value.chapterId || 
        !this.quizeForm.value.lessonId) {
        
        Swal.fire({
            icon: 'error',
            title: 'Select All Dropdowns',
            text: 'Please fill all required fields before verifying the question.',
            confirmButtonText: 'OK',
        });
        return;
    }
    
    // Prepare payload with all required data
    const QuestionPayload = {
      quizName: quiz,
      boardId: this.quizeForm.value.boardId,
      mediumId: this.quizeForm.value.mediumId,
      classId: this.quizeForm.value.classId,
      subjectId: this.quizeForm.value.subjectId,
      bookId: this.quizeForm.value.bookId,
      chapterId: this.quizeForm.value.chapterId,
      lessonId: this.quizeForm.value.lessonId
    };

    // Make the API request
    this.httpService.post('quizes/checkexist', QuestionPayload).subscribe(
      (data: any) => {
        if (data) {
          this.isQuestionExist = 'Exist';
        }
      },
      (error) => {
        if (error.error && error.error.message) {
          console.error('Error Message:', error.error.message);
          console.error('Stack Trace:', error.error.stack);
        }
        this.isQuestionExist = 'Not exist';
      }
    );
}



  // getAllQuizes() {
  //   this.httpService.get('quizes?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
  //     if (data.results && data.results.length > 0) {
  //       this.allQuizes = data.results;
  //       console.log(this.allQuizes);

  //       this.total = data.totalResults;
  //       this.paginationConfig = {
  //         itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
  //       }
  //     }
  //   })
  // }

  getAllBoards() {
    this.httpService.get('boards?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    })
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


  cancel() {
    this.submitted = false;
    this.formType = "Save";
    this.quizeForm.reset();
    this.quizeForm.controls['quizName'].reset();  // Clears the quiz name
    this.isQuestionExist = ''; // Clear any previous question status
  }

  saveDataClear() {
    this.submitted = false;
    this.quizeForm.controls.quizName.reset()
    this.quizeForm.controls.options.reset()
    this.quizeForm.controls.hint.reset()
    this.quizeForm.controls.explain.reset()
    // this.quizeForm.controls.lessonId.reset()
    this.quizeForm.controls.correctOptions.reset()
    this.quizeForm.controls.types.reset()
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.showQuizData();
    // this.getAllQuizes();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1;
    this.showQuizData();
      // this.getAllQuizes();
    }
  }

  submitForm() {
    this.submitted = true;
    console.log(1);

    console.log("Weightage Errors: ", this.quizeForm.get('weightage')?.errors);
  console.log("Negative Weightage Errors: ", this.quizeForm.get('negativeWeightage')?.errors);

    const questionType = this.quizeForm.get('questionType')?.value;

    // Dynamic Validation based on questionType
    if (questionType === '1') { // MCQ
        this.quizeForm.get('correctOptionsTF')?.clearValidators();
        this.quizeForm.get('correctOptionsTF')?.updateValueAndValidity();

        // Add validators for options and correctOptions
        this.quizeForm.get('correctOptions')?.setValidators([Validators.required]);
        this.quizeForm.get('correctOptions')?.updateValueAndValidity();

        this.options.controls.forEach(control => {
            control.setValidators(Validators.required);
            control.updateValueAndValidity();
        });
    }
    else if (questionType === '2') { // True/False
        this.quizeForm.get('correctOptions')?.clearValidators();
        this.quizeForm.get('correctOptions')?.updateValueAndValidity();

        // Remove validators for options as it's True/False
        this.options.controls.forEach(control => {
            control.clearValidators();
            control.updateValueAndValidity();
        });

        // Add validators for correctOptionsTF
        this.quizeForm.get('correctOptionsTF')?.setValidators([Validators.required]);
        this.quizeForm.get('correctOptionsTF')?.updateValueAndValidity();
    }

    // Now, check the validity of the form
    if (this.quizeForm.invalid) {
        console.log('Form is invalid. Cannot proceed.');
        return;
    }

    console.log(2);
    
    if (this.formType == "Save") {
      this.SaveQuizes();
        }
     else if (this.formType == "Update") {
        this.updateQuize();
    }
}


  async extractImagesAndUpload(quiz: any) {

    const htmlString = quiz;
    const regex = /src=["']([^"']+)["']/i;
    const match = htmlString.match(regex);
    const srcValue = match ? match[1] : null;
    quiz = srcValue;

    const base64Data = quiz;
    const base64 = await fetch(base64Data);
    const blob = await base64.blob();
    if (blob) {
      blob;
    }
  }
  SaveQuizes() {
    this.quizClassModel = this.quizeForm.value;

    // Sanitize text inputs
    // this.quizClassModel.quizName = this.sanitizeHtml(this.quizeForm.value.quizName);
    // this.quizClassModel.explain = this.sanitizeHtml(this.quizeForm.value.explain);
    // this.quizClassModel.hint = this.sanitizeHtml(this.quizeForm.value.hint);
    this.quizClassModel.quizName = (this.quizeForm.value.quizName);
    this.quizClassModel.explain = (this.quizeForm.value.explain);
    this.quizClassModel.hint = (this.quizeForm.value.hint);
    this.quizClassModel.displayFormat = this.quizeForm.value.displayFormat
    this.quizClassModel.questionLevel = parseInt(this.quizeForm.value.questionLevel);
    this.quizClassModel.questionType = parseInt(this.quizeForm.value.questionType);
    this.quizClassModel.weightage = parseFloat(this.quizeForm.value.weightage);
    this.quizClassModel.negativeWeightage = parseFloat(this.quizeForm.value.negativeWeightage);

    const questionType = this.quizClassModel.questionType;

    if (questionType === 1) {  // MCQ
        const optionsArray = this.quizeForm.value.options;
        this.quizClassModel.options = [
            {
                A: optionsArray[0] || '',
                B: optionsArray[1] || '',
                C: optionsArray[2] || '',
                D: optionsArray[3] || ''
            }
          //   {
          //     A: this.sanitizeHtml(optionsArray[0] || ''),
          //     B: this.sanitizeHtml(optionsArray[1] || ''),
          //     C: this.sanitizeHtml(optionsArray[2] || ''),
          //     D: this.sanitizeHtml(optionsArray[3] || '')
          // }
        ];
        
        // Converting selected options to A, B, C, D format
        this.quizClassModel.correctOptions = Array.isArray(this.quizeForm.value.correctOptions)
            ? this.quizeForm.value.correctOptions.map((opt: any) => {
                switch (opt.itemid) {
                    case 1: return "A";
                    case 2: return "B";
                    case 3: return "C";
                    case 4: return "D";
                    default: return "";
                }
            }).filter(Boolean)
            : [];
    
    } 
    else if (questionType === 2) {  // True/False
        this.quizClassModel.correctOptions = [this.quizeForm.value.correctOptionsTF];
        this.quizClassModel.options = [
            { A: "True", B: "False", C: "", D: "" }
        ];
    }

    const typeMapping: { [key: string]: number } = { "easy": 1, "medium": 2, "hard": 3 };
    // this.quizClassModel.types = String(typeMapping[this.quizeForm.value.types.toLowerCase()] || 1);

    delete this.quizClassModel.id;

    this.httpService.post('quizes', this.quizClassModel).subscribe(() => {
        // this.saveDataClear();
        this.quizeForm.reset({}, { emitEvent: false });
        this.quizeForm.reset();
        this.submitted = false;
        this.formType = "Save";
        this.initializeValidations();
        this.isQuestionExist = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.alertServiceService.success();
    }, (error) => {
        this.alertServiceService.error();
    });
}

disableScroll(event: WheelEvent) {
  event.preventDefault();
}

  EiditQuizes(data: any) {
    this.httpService.getById('quizes', data.id).subscribe((quizData: any) => {
      if (quizData) {
  
        // load subjects first (based on board, medium, class)
        this.httpService.get(`subjects/filter/${quizData.boardId}/${quizData.mediumId}/${quizData.classId}`)
          .subscribe((subjects: any) => {
            this.allSubjects = subjects;
  
            // load books based on subjectId
            this.httpService.getById('books/subject', quizData.subjectId)
              .subscribe((books: any) => {
                this.allbooks = books;
  
                // load chapters based on bookId
                this.httpService.getById('chapter/getChaptersByBookid', quizData.bookId)
                  .subscribe((chapters: any) => {
                    this.allChapters = chapters;
  
                    // load topics based on chapterId
                    this.httpService.getById('lession/getallLession', quizData.chapterId)
                      .subscribe((lessons: any) => {
                        this.allLessons = lessons;
  
                        // Now patch the form after all data loaded:
                        this.patchQuizForm(quizData);
                      });
                  });
              });
          });
      }
    });
  }
  
  // Helper function to patch values reliably:
  
  
  patchQuizForm(data: any) {
    const optionsArray = this.quizeForm.get('options') as FormArray;
    optionsArray.clear();
  
    if (data.questionType === 1) { // MCQ
      optionsArray.push(new FormControl(data.options[0]?.A || '', Validators.required));
      optionsArray.push(new FormControl(data.options[0]?.B || '', Validators.required));
      optionsArray.push(new FormControl(data.options[0]?.C || '', Validators.required));
      optionsArray.push(new FormControl(data.options[0]?.D || '', Validators.required));
    } else if (data.questionType === 2) { // True/False
      optionsArray.push(new FormControl('True'));
      optionsArray.push(new FormControl('False'));
    }
  
    // Mapping: dropdown itemid -> letter
    const itemIdToLetter: { [key: number]: string } = { 1: "A", 2: "B", 3: "C", 4: "D" };
  
    // Define the dropdown list as used in your form
    const dropdownList = [
      { itemid: 1, item_text: 'Option 1' },
      { itemid: 2, item_text: 'Option 2' },
      { itemid: 3, item_text: 'Option 3' },
      { itemid: 4, item_text: 'Option 4' }
    ];
  
    // Patch the form with all values.
    // For correctOptions (MCQ), filter the dropdown list using the letters returned from the backend.
    this.quizeForm.patchValue({
      id: data.id,
      boardId: data.boardId,
      mediumId: data.mediumId,
      classId: data.classId,
      subjectId: data.subjectId,
      bookId: data.bookId,
      chapterId: data.chapterId,
      lessonId: data.lessonId,
      quizName: data.quizName,
      hint: data.hint,
      explain: data.explain,
      questionType: data.questionType.toString(),
      questionLevel: data.questionLevel.toString(),
      weightage: data.weightage,
      negativeWeightage: data.negativeWeightage,
      displayFormat: data.displayFormat,
      // Convert backend "types" (e.g., "1") to your UI display (e.g., "easy")
      // types: data.types,
      correctOptions: data.questionType === 1
        ? dropdownList.filter(option => data.correctOptions.includes(itemIdToLetter[option.itemid]))
        : null,
      correctOptionsTF: data.questionType === 2
        ? (data.correctOptions && data.correctOptions.length ? data.correctOptions[0] : null)
        : null
    });
  
    this.formType = "Update";
  }
  
  
  // sanitizeHtml(input: string): string {
  //   const sanitizedText = input.replace(/<\/?[^>]+(>|$)/g, '');
  //   const sanitizedAndNewlinesRemoved = sanitizedText.replace(/\n/g, '');
  //   const decodedText = document.createElement('textarea');
  //   decodedText.innerHTML = sanitizedAndNewlinesRemoved;
  //   return decodedText.value;
  // }


  // updateQuize() {
  //   // Get the current form value and include the id
  //   this.quizClassModel = this.quizeForm.value;
  //   this.quizClassModel.id = this.quizeForm.get('id')?.value;
  
  //   // Sanitize text inputs
  //   this.quizClassModel.quizName = this.sanitizeHtml(this.quizClassModel.quizName);
  //   this.quizClassModel.explain = this.sanitizeHtml(this.quizClassModel.explain);
  //   this.quizClassModel.hint = this.sanitizeHtml(this.quizClassModel.hint);
  
  //   // Handle options based on question type
  //   if (this.quizClassModel.questionType === 1 || this.quizClassModel.questionType === 1) {
  //     // For MCQ, build the options array from the four controls
  //     this.quizClassModel.options = [{
  //       A: this.sanitizeHtml(this.quizeForm.value.options[0]),
  //       B: this.sanitizeHtml(this.quizeForm.value.options[1]),
  //       C: this.sanitizeHtml(this.quizeForm.value.options[2]),
  //       D: this.sanitizeHtml(this.quizeForm.value.options[3])
  //     }];
  
  //     // Map the correctOptions using the dropdown selection
  //     if (Array.isArray(this.quizeForm.value.correctOptions)) {
  //       this.quizClassModel.correctOptions = this.quizeForm.value.correctOptions.map((item: any) => item.itemid.toString());
  //     }
  //   } else if (this.quizClassModel.questionType === 2 || this.quizClassModel.questionType === 2) {
  //     // For True/False, use fixed options and the correctOptionsTF value
  //     this.quizClassModel.options = [{
  //       A: "True",
  //       B: "False",
  //       C: "",
  //       D: ""
  //     }];
  //     this.quizClassModel.correctOptions = [this.quizeForm.value.correctOptionsTF];
  //   }
  
  //   // Convert the types value back for the backend
  //   const typeMapping: { [key: string]: string } = {
  //     "easy": "1",
  //     "medium": "2",
  //     "hard": "3"
  //   };
  //   this.quizClassModel.types = typeMapping[this.quizeForm.value.types.toLowerCase()] || "1";
  
  //   // PATCH request to update the quiz
  //   this.httpService.patch('quizes', this.quizClassModel)
  //     .subscribe((data: any) => {
  //       this.alertServiceService.update();
  //       this.closebutton.nativeElement.click();
  //       this.cancel();
  //       this.formType = "Save";
  //       this.showQuizData();
  //     }, (error) => {
  //       this.alertServiceService.error();
  //     });
  // }
  updateQuize() {
    this.quizClassModel = this.quizeForm.value;
    this.quizClassModel.id = this.quizeForm.get('id')?.value;
  
    // Sanitize quizName, explain, and hint
    // this.quizClassModel.quizName = this.sanitizeHtml(this.quizClassModel.quizName);
    // this.quizClassModel.explain = this.sanitizeHtml(this.quizClassModel.explain);
    // this.quizClassModel.hint = this.sanitizeHtml(this.quizClassModel.hint);
    this.quizClassModel.quizName = this.quizClassModel.quizName;
    this.quizClassModel.explain = this.quizClassModel.explain;
    this.quizClassModel.hint = this.quizClassModel.hint;
  
    const questionType = parseInt(this.quizeForm.value.questionType);
  
    if (questionType === 1) {  // MCQ
      const optionsArray = this.quizeForm.value.options;
  
      // Sanitize each option explicitly
      this.quizClassModel.options = [
        // {
        //   A: this.sanitizeHtml(optionsArray[0] || ''),
        //   B: this.sanitizeHtml(optionsArray[1] || ''),
        //   C: this.sanitizeHtml(optionsArray[2] || ''),
        //   D: this.sanitizeHtml(optionsArray[3] || '')
        // }
        {
          A: optionsArray[0] || '',
          B: optionsArray[1] || '',
          C: optionsArray[2] || '',
          D: optionsArray[3] || ''
        }
      ];
  
      // Convert correctOptions dropdown selection to letters (A,B,C,D)
      this.quizClassModel.correctOptions = Array.isArray(this.quizeForm.value.correctOptions)
        ? this.quizeForm.value.correctOptions.map((opt: any) => {
            switch (opt.itemid) {
              case 1: return "A";
              case 2: return "B";
              case 3: return "C";
              case 4: return "D";
              default: return "";
            }
          }).filter(Boolean)
        : [];
  
      // this.quizClassModel.correctOptionsTF = null; // Explicitly null for MCQ
    } 
    else if (questionType === 2) {  // True/False
      this.quizClassModel.options = [{ A: "True", B: "False", C: "", D: "" }];
      this.quizClassModel.correctOptions = [this.quizeForm.value.correctOptionsTF];
    }
  
    // Ensure numeric fields are properly typed
    this.quizClassModel.questionLevel = parseInt(this.quizeForm.value.questionLevel);
    this.quizClassModel.questionType = questionType;
    this.quizClassModel.weightage = parseFloat(this.quizeForm.value.weightage);
    this.quizClassModel.negativeWeightage = parseFloat(this.quizeForm.value.negativeWeightage); // added this line
  
    // Call PATCH endpoint
    this.httpService.patch('quizes', this.quizClassModel)
      .subscribe((data: any) => {
        this.alertServiceService.update();
        this.closebutton.nativeElement.click();
        this.cancel();
        this.formType = "Save";
        this.showQuizData();
      }, (error) => {
        this.alertServiceService.error();
      });
  }
  

  deleteQuizes(data: any) {
    this.httpService.delete('quizes', data.id).subscribe((res: any) => {
      this.alertServiceService.delete();
      this.showQuizData();
      // this.getAllQuizes();
    })
  }

  getBookBySubjectId(event: any, showForUpdate: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (event) {
        const id = event.target?.value ? event.target.value : event.subjectId;
        this.httpService.getById('books/subject', id).subscribe((data: any) => {
          this.quizeForm.controls['bookId'].reset();
          this.allbooks = data;
          if (showForUpdate) {
            this.getChapterByBookId(event).then(() => {
              resolve();
            }).catch(reject);
          } else {
            resolve();
          }
        }, (error) => {
          this.alertServiceService.error();
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }
  


  getChapterByBookId(event: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (event) {
        const id = event.target?.value ? event.target.value : event.bookId;
        this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
          this.quizeForm.controls['chapterId'].reset();
          this.allChapters = data;
          resolve();
        }, (error) => {
          this.alertServiceService.error();
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }
  
  getLessonByChapter(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.chapterId;
      this.httpService.getById('lession/getallLession', id).subscribe((data: any) => {
        this.quizeForm.controls['lessonId'].reset()
        this.allLession = data;
      }
      )
    }

  }

  getLessonById(id: any) {
    this.httpService.get('lession/' + id).subscribe((data: any) => {
      if (data) {
        this.quizeForm.patchValue({
          name: data.name,
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          bookId: data.bookId,
          chapterId: data.chapterId,
          lessonId: data.lessonId,
          id: data.id
        })
        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  getByFilterSubjectDataselect() {
    if (this.quizeForm.value.boardId && this.quizeForm.value.mediumId && this.quizeForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.quizeForm.value.boardId}/${this.quizeForm.value.mediumId}/${this.quizeForm.value.classId}`)
        .subscribe((data: any) => {
          this.quizeForm.controls['subjectId'].reset()
          this.quizeForm.controls['bookId'].reset()
          this.quizeForm.controls['chapterId'].reset()
          this.quizeForm.controls['lessonId'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
          }
          else {
            this.allSubjects = [];
          }
          this.allbooks = [];
          this.allChapters = [];
          this.allLessons = [];
        });
    }
  }

  getByFilterSubjectData() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        this.quizeForm.controls['subjectId'].reset()
        if (data.length > 0) {
          this.allSubjects = data;
        }
        else {
          this.allSubjects = [];
        }
          this.allbooks = [];
          this.allChapters = [];
          this.allLessons = [];
          this.subjectId ='';
          this.bookId = '';
          this.chapterId = '';
          this.lessonId = '';
      });
  }


  getByFilterViewData() {
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lessonId) {
      const apiUrl = `quizes/get/quiz/filter/section?boardId=${this.boardId}&mediumId=${this.mediumId}&classId=${this.classId}&bookId=${this.bookId}&subjectId=${this.subjectId}&chapterId=${this.chapterId}&lessonId=${this.lessonId}`;

      this.httpService.get(apiUrl).subscribe((data: any) => {
        if (data && data.results && data.results.length > 0) {
          this.allQuizes = data.results;
        } else {
          this.allQuizes = [];
        }
      });
    } else {
      this.alertServiceService.customError("Please select all data");
    }
  }

  postByFilterQuizData() {
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
  
    this.httpService.post('quizes/get/quiz/filter/section', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allQuizes = data.results;         // Store fetched quiz data
          this.total = data.totalResults;        // Update total count
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,

          };
          // Newcall to fetch question stats
          this.getQuestionStats(); 
        } else {
          this.allQuizes = [];                   // Clear array if no quizzes found
        }
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
        this.alertServiceService.customSearchError("Quizzes Not Found");
        this.allQuizes = [];                     // Clear array on error
      }
    );
  }
  
  postBySearchQuizData() {
    if (!this.searchBox.trim()) {
      this.allQuizes = [];
      return ;
    }
    const searchData = {
      search: this.searchBox,  // search term entered by the user
      limit: this.limit,       // items per page
      page: this.page,        
    };
  
    this.httpService.post('quizes/get/quiz/filter/section', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allQuizes = data.results;        // update quizzes array with results
          this.total = data.totalResults;       // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allQuizes = [];                  // clear if no quizzes found
        }
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
        this.alertServiceService.customSearchError("Quizzes Not Found, Try Different Search");
        this.allQuizes = []; 
      }
    );
  }
  

  getLessonsBychapterId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.chapterId;
      this.httpService.getById('lession/getallLession', id).subscribe(
        (data: any) => {
          console.log("Fetched topics:", data); // Debugging line
          
          this.allLessons = data;
        },
        (error) => {
          console.error("Error fetching topics:", error); // Debugging line
          this.alertServiceService.error();
        }
      );
    }
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
    this.postBySearchQuizData();    // Perform the search
    this.hideOnSearch = false;
    // this.cancel();
  }

  showQuizData(){
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId ) {
      this.postByFilterQuizData();
    } else {
      this.postBySearchQuizData();
    }
  }

  go(){
    this.page = 1;
    this.searchBox = "";
    this.hideOnSearch = true;
    this.postByFilterQuizData();
}

setActiveTab(tab: string) {
  this.activeTab = tab;

  if (tab === 'create') {
    this.formType = "Save";  // Switch to Save mode
    this.submitted = false;   // Reset form submission state
    this.initializeValidations(); // Reinitialize the form
    this.isQuestionExist = ''; // Clear question existence status
    this.allSubjects = [];
    this.allbooks = [];
    this.allChapters = [];
    this.allLessons = [];
    this.quizeForm.reset();
    this.lessonId = '';
    this.quizeForm.controls['quizName'].reset();  // Clears the quiz name
    this.isQuestionExist = ''; // Clear any previous question status

  } else if (tab === 'view') {
   
    this.boardId = '';
    this.mediumId = '';
    this.classId = '';
    this.subjectId = '';
    this.bookId = '';
    this.chapterId = '';
    this.lessonId = '';
    this.searchBox = '';        // Clear search box
    this.allSubjects = [];
    this.allbooks = [];
    this.allChapters = [];
    this.allLessons = [];
  }

  else if (tab === 'bulk'){
    this.initializeBulkUploadForm();
    this.boardId = '';
    this.mediumId = '';
    this.classId = '';
    this.subjectId = '';
    this.bookId = '';
    this.chapterId = '';
    this.lessonId = '';
    this.searchBox = '';        // Clear search box
    this.allSubjects = [];
    this.allbooks = [];
    this.allChapters = [];
    this.allLessons = [];
    this.fileInput.nativeElement.value = '';  // Clear the actual file input
    this.uploadedFileName='';
  }
}

onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
      this.selectedFile = file;
      this.uploadedFileName = file.name;  // Store the selected file name
  }
}

submitBulkForm(){

}

// Bulk Upload Logic
uploadBulkQuiz(): void {
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
  if (!this.quizUploadForm.value.boardId || 
      !this.quizUploadForm.value.mediumId || 
      !this.quizUploadForm.value.classId || 
      !this.quizUploadForm.value.subjectId || 
      !this.quizUploadForm.value.bookId || 
      !this.quizUploadForm.value.chapterId || 
      !this.quizUploadForm.value.lessonId
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
  formData.append('boardId', this.quizUploadForm.value.boardId);
  formData.append('mediumId', this.quizUploadForm.value.mediumId);
  formData.append('classId', this.quizUploadForm.value.classId);
  formData.append('subjectId', this.quizUploadForm.value.subjectId);
  formData.append('bookId', this.quizUploadForm.value.bookId);
  formData.append('chapterId', this.quizUploadForm.value.chapterId);
  formData.append('lessonId', this.quizUploadForm.value.lessonId);
  formData.append('file', this.selectedFile);

  this.httpService.post('quizes/bulk-upload', formData).subscribe(
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
          this.duplicateQuestionsList = [];
          this.duplicateQuizzes = res.duplicateQuizzes;

          // Reset form and file selection
          this.quizUploadForm.reset();
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';  // Clear the actual file input
          this.initializeBulkUploadForm();
      },
      (error) => {
        if (error.error && error.error.message === "Duplicate questions found in the uploaded file.") {
          this.duplicateQuestionsList = error.error.duplicateQuestions || [];  // Store duplicate questions
          this.duplicatesCount = 0;
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: `Duplicate questions found in the uploaded file. (File name - ${this.uploadedFileName}). Please try again.`,
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
  const sampleFileUrl = 'assets/files/sample_Question_Upload.csv';
  const link = document.createElement('a');
  link.href = sampleFileUrl;
  link.download = 'Sample-Bulk-Quiz.csv';
  link.click();
}

getByFilterSubjectDataselectBulk() {
  if (this.quizUploadForm.value.boardId && this.quizUploadForm.value.mediumId && this.quizUploadForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.quizUploadForm.value.boardId}/${this.quizUploadForm.value.mediumId}/${this.quizUploadForm.value.classId}`)
          .subscribe((data: any) => {
              this.quizUploadForm.controls['subjectId'].reset();
              this.quizUploadForm.controls['bookId'].reset();
              this.quizUploadForm.controls['chapterId'].reset();
              
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

onQuestionTypeChange() {
  const questionType = this.quizeForm.get('questionType')?.value;

  const optionsFormArray = this.quizeForm.get('options') as FormArray;
  optionsFormArray.clear();  // Clear previous options if any

  // Remove existing validators first
  this.quizeForm.get('correctOptions')?.clearValidators();
  this.quizeForm.get('correctOptionsTF')?.clearValidators();

  if (questionType == '1') {  // MCQ
    optionsFormArray.push(this.fb.control('', Validators.required));
    optionsFormArray.push(this.fb.control('', Validators.required));
    optionsFormArray.push(this.fb.control('', Validators.required));
    optionsFormArray.push(this.fb.control('', Validators.required));

    this.quizeForm.get('correctOptions')?.setValidators([Validators.required]);
    this.quizeForm.get('correctOptionsTF')?.clearValidators(); // Remove validation for True/False answer

  } else if (questionType == '2') {  // True/False
    optionsFormArray.push(this.fb.control('True'));
    optionsFormArray.push(this.fb.control('False'));

    this.quizeForm.get('correctOptionsTF')?.setValidators([Validators.required]);
    this.quizeForm.get('correctOptions')?.clearValidators();  // Remove validation for MCQ correct options
  }

  // Update the form controls to reflect the applied validators
  this.quizeForm.get('correctOptions')?.updateValueAndValidity();
  this.quizeForm.get('correctOptionsTF')?.updateValueAndValidity();
}

getQuestionStats(): void {
  const filterData = {
    boardId: this.boardId,
    mediumId: this.mediumId,
    classId: this.classId,
    subjectId: this.subjectId,
    bookId: this.bookId,
    chapterId: this.chapterId,
    lessonId: this.lessonId
  };

  this.httpService.post('quizes/get-question-stats', filterData).subscribe(
    (response: any) => {
      if (response?.data?.data) {
        const stats = response.data.data;

        // Update total questions
        this.totalQuestions = stats.totalQuestions;

        // Reset previous stats values
        this.mcqEasy = 0; this.mcqMedium = 0; this.mcqHard = 0; this.mcqCommon = 0;
        this.tfEasy  = 0; this.tfMedium  = 0; this.tfHard  = 0; this.tfCommon  = 0;
        this.type3Easy = 0; this.type3Medium = 0; this.type3Hard = 0; this.type3Common = 0;

        // stats.questionTypeStats is now an object where keys are question types.
        const qtStats = stats.questionTypeStats;
        for (const questionType in qtStats) {
          if (qtStats.hasOwnProperty(questionType)) {
            const levelStats = qtStats[questionType]; // e.g., { "1": 1, "2": 0, "3": 1, "4": 0 }
            switch (questionType) {
              case "1": // MCQ stats
                this.mcqEasy   = levelStats["1"] || 0;
                this.mcqMedium = levelStats["2"] || 0;
                this.mcqHard   = levelStats["3"] || 0;
                this.mcqCommon = levelStats["4"] || 0;
                break;
              case "2": // True/False stats
                this.tfEasy   = levelStats["1"] || 0;
                this.tfMedium = levelStats["2"] || 0;
                this.tfHard   = levelStats["3"] || 0;
                this.tfCommon = levelStats["4"] || 0;
                break;
              case "3": // Additional question type stats
                this.type3Easy   = levelStats["1"] || 0;
                this.type3Medium = levelStats["2"] || 0;
                this.type3Hard   = levelStats["3"] || 0;
                this.type3Common = levelStats["4"] || 0;
                break;
              default:
                break;
            }
          }
        }
      }
    },
    (error) => {
      console.error('Error fetching question stats:', error);
    }
  );
}

decodeHtmlEntities(str: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// Method to toggle the stats display
toggleStats(): void {
  this.showStats = !this.showStats;
}

}
