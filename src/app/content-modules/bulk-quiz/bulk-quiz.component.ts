import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder, RequiredValidator } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { QuizClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-bulk-quiz',
  templateUrl: './bulk-quiz.component.html',
  styleUrls: ['./bulk-quiz.component.css']
})
export class BulkQuizComponent {

  quizeForm!: FormGroup;
  // optionsArray!: FormArray;
  quizClassModel!: QuizClass;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  activeTab: string = 'create';
  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  selectedFile: File | null = null;
  allMediums!: any[];
  allChapters!: any[];
  allBoards!: any[];
  allSubjects: any[] = [];
  allbooks!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  allmulti!: any[];
  allLession!: any[];
  allQuizes!: any[];
  formType: string = "Save";
  lessionName!: string ;
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

  boardId = ''
  mediumId = ''
  classId = ''
  subjectId = ''
  bookId = ''
  chapterId = ''
  lectureVideoId = ''
  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService,private cdr: ChangeDetectorRef,private ngZone: NgZone) { }
  get f() { return this.quizeForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getAllSubject();
    this.quizClassModel = this.quizeForm.value;
  }

  initializeValidations() {
    this.quizeForm = this.fb.group({
      boardId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      chapterId: [null, [Validators.required]],
      lectureVideoId: [null, [Validators.required]], // Changed this to match the field name
      quizName: ["", [Validators.required]],
      types: ["", [Validators.required]],
      options: this.fb.array([
        this.createEditorControl('', Validators.required),
        this.createEditorControl('', Validators.required),
        this.createEditorControl('', Validators.required),
        this.createEditorControl('', Validators.required)
      ]),
      correctOptions: [null, Validators.required],
      explain: [null, [Validators.required]],
      hint: [null, [Validators.required]],
      marks: 1,
      id: [null],
    });
  }
  

  private createEditorControl(value: string, validator?: any) {
    return this.fb.control(value, validator);
  }

  get options() {
    return this.quizeForm.get('options') as FormArray;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  

  duplicatesCount: number = 0;
  Uploadedcount: number = 0;
  duplicateQuizzes: string[] = [];
  
  uploadFiltree(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.httpService.post('quizes/bulk-upload', formData).subscribe(
        (response: any) => {
          console.log("🚀 API Response Received:", response);

          if (response) {
            // Assign data properly
            this.duplicatesCount = response.duplicatesCount || 0;
            this.Uploadedcount = response.uploadedCount || 0;
            this.duplicateQuizzes = response.duplicateQuizzes || [];

            console.log("✅ Duplicate Count Updated:", this.duplicatesCount);
            console.log("✅ Duplicate Quizzes Updated:", this.duplicateQuizzes);

            // Force UI update
            this.cdr.detectChanges();

            // Another method: Delay UI update slightly to ensure it's displayed
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 100);

            // Show SweetAlert success message
            Swal.fire({
              icon: 'success',
              title: 'Bulk Upload Completed!',
              text: `${this.Uploadedcount} questions uploaded, ${this.duplicatesCount} duplicates found.`,
              confirmButtonText: 'OK',
            });

            // Show duplicates if available
            if (this.duplicatesCount > 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Questions Found',
                html: `
                  <h5>Total Duplicates: ${this.duplicatesCount}</h5>
                  <h5>Total Uploaded: ${this.Uploadedcount}</h5>
                  <ul style="text-align: left;">
                    ${this.duplicateQuizzes.map(quiz => `<li>${quiz}</li>`).join('')}
                  </ul>
                `,
                confirmButtonText: 'Close',
              });
            }
          }
        },
        (error) => {
          console.error("❌ API Error:", error);

          // Show error message if upload fails
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was an issue uploading the file.',
            confirmButtonText: 'Try Again',
          });
        }
      );
    } else {
      // If no file is selected
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a CSV file to upload.',
        confirmButtonText: 'OK',
      });
    }
  }
  
  verifyQuestion() {
    // let question = this.quizeForm.value.quizName.split('').slice(3, -5).join('');
    let quiz = this.sanitizeHtml(this.quizeForm.value.quizName);
    var Qestion = {
      "quizName": quiz
    };
    this.httpService.post('quizes/checkexist', Qestion).subscribe((data: any) => {
      if (data) {
        this.isQuestionExist = 'Exist';
      }
    }, (error) => {
      this.isQuestionExist = 'Not exist';
    })
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
  this.selectedFile = null;  // Clear file input
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
    // this.getAllQuizes();
    this.showBulkQuizData();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.showBulkQuizData();
      // this.getAllQuizes();
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.quizeForm.invalid) {
      return;
    }
    if (this.formType === "Save") {
      this.SaveQuizes();  
    } else if (this.formType === "Update") {
      this.updateQuize();
    }
    this.uploadFiltree();  // Trigger the file upload after form submission
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
    if (this.selectedFile) {
      this.quizClassModel = this.quizeForm.value;
      const formData = new FormData();

      // Append form data fields
      formData.append('boardId', this.quizClassModel.boardId);
      formData.append('mediumId', this.quizClassModel.mediumId);
      formData.append('classId', this.quizClassModel.classId);
      formData.append('bookId', this.quizClassModel.bookId);
      formData.append('subjectId', this.quizClassModel.subjectId);
      formData.append('chapterId', this.quizClassModel.chapterId);
      formData.append('lectureVideoId', this.quizClassModel.lectureVideoId);

      // Append the file
      formData.append('file', this.selectedFile, this.selectedFile.name);

      // Send the data via HTTP
      this.httpService.post('quizes/bulk-upload', formData).subscribe(
        (res: any) => {
          console.log('🚀 Quiz data uploaded successfully:', res);

          // Update UI with duplicate data inside `ngZone.run()`
          this.ngZone.run(() => {
            this.duplicatesCount = res.duplicatesCount || 0;
            this.duplicateQuizzes = res.duplicateQuizzes || [];
            this.Uploadedcount = res.uploadedCount || 0;
          
            // Force UI refresh
            this.cdr.detectChanges();

            // Additional backup delay to ensure UI updates
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 200);

            // Show SweetAlert Success Message
            Swal.fire({
              icon: 'success',
              title: 'Bulk Upload Completed!',
              text: `${this.Uploadedcount} questions  uploaded, ${this.duplicatesCount} duplicates found.`,
              confirmButtonText: 'OK',
            });

            // Show duplicates in SweetAlert
            if (this.duplicatesCount > 0) {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Questions Found',
                html: `
                  <h5>Total Duplicates: ${this.duplicatesCount}</h5>
                 <h5>Total Uploaded: ${this.Uploadedcount}</h5>
                `,
                confirmButtonText: 'Close',
              });
            }
          });
        },
        (err: any) => {
          console.error('❌ Error uploading quiz data:', err);

          // Show SweetAlert Error Message
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was an issue uploading the file.',
            confirmButtonText: 'Try Again',
          });
        }
      );
    } else {
      console.log('❌ No file selected');

      // SweetAlert if no file is selected
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a CSV file to upload.',
        confirmButtonText: 'OK',
      });
    }
  }
  
  

  EiditQuizes(data: any) {
    this.httpService.getById('quizes', data.id).subscribe((data: any) => {
      if (data) {
        if (data.options && data.options.length > 0) {
          for (let i = 0; i < data.options.length; i++) {
            data.options[i] = data.options[i].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
          }
        }

        let selectedCorrectOptions: any;
        for (let i = 0; i < data.correctOptions.length; i++) {
          //  const asd = data.correctOptions.indexOf(this.dropdownList[i].item_text);
          const mappedOption = this.dropdownList.map(function (dropdown: any) {
            if (dropdown.item_text == data.correctOptions[i]) {
              return dropdown;
            }
          })
        }
        this.quizeForm.patchValue({
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          bookId: data.bookId,
          chapterId: data.chapterId,
          lectureVideoId: data.lectureVideoId,
          // lessonId: data.lessonId,
          quizName: data.quizName.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          hint: data.hint.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          explain: data.explain.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          options: data.options,
          id: data.id,
          correctOptions: data.correctOptions,
          types: data.types,
          marks: 1
        })
        this.formType = "Update";
        this.getBookBySubjectId(data, true);
        // this.getLessonByChapter(data)
      }
    });
  }

  sanitizeHtml(input: string): string {
    const sanitizedText = input.replace(/<\/?[^>]+(>|$)/g, '');
    const sanitizedAndNewlinesRemoved = sanitizedText.replace(/\n/g, '');
    const decodedText = document.createElement('textarea');
    decodedText.innerHTML = sanitizedAndNewlinesRemoved;
    return decodedText.value;
  }


  updateQuize() {
    this.quizClassModel = this.quizeForm.value;
    this.quizClassModel.quizName = this.sanitizeHtml(this.quizClassModel.quizName);
    this.quizClassModel.explain = this.sanitizeHtml(this.quizClassModel.explain);
    this.quizClassModel.hint = this.sanitizeHtml(this.quizClassModel.hint);
    const temp: any = [];
    for (let i = 0; i < this.options.controls.length; i++) {
      temp.push(this.sanitizeHtml(this.quizeForm.value.options[i]));
    }
    this.quizClassModel.options = temp;
    // this.quizClassModel.hint = (this.quizeForm.get('hint')?.value).replace(/<p>/g, '').replace(/<\/p>/g, '');
    // this.quizClassModel.explain = (this.quizeForm.get('explain')?.value).replace(/<p>/g, '').replace(/<\/p>/g, '');

    this.httpService.patch('quizes', this.quizClassModel).subscribe((data: any) => {
      this.alertServiceService.success();
      this.cancel();
      this.formType = "Save";
      this.showBulkQuizData();
      // this.closebutton.nativeElement.click();
      // this.getAllQuizes();
    })
  }

  deleteQuizes(data: any) {
    this.httpService.delete('quizes', data.id).subscribe((res: any) => {
      this.alertServiceService.delete();
      this.showBulkQuizData();
      // this.getAllQuizes();
    })
  }

  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.quizeForm.controls['bookId'].reset()
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
        this.quizeForm.controls['chapterId'].reset()
        this.allChapters = data;
        if (event) {
          this.getmultiBychapterId(event)
        }
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };
  // getLessonByChapter(event: any) {
  //   if (event) {
  //     const id = event.target?.value ? event.target?.value : event.chapterId;
  //     this.httpService.getById('lession/getallLession', id).subscribe((data: any) => {
  //       this.quizeForm.controls['lessonId'].reset()
  //       this.allLession = data;
  //     }, (error) => {
  //       this.alertServiceService.error();
  //     }
  //     )
  //   }

  // }

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
          lectureVideoId: data.lectureVideoId,
          // lessonId: data.lessonId,
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
          this.quizeForm.controls['lectureVideoId'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
          }
          else {
            this.allSubjects = [];
          }
          this.allbooks = [];
          this.allChapters = [];
          this.allmulti = [];
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
          this.allmulti = [];
          this.subjectId ='';
          this.bookId = '';
          this.chapterId = '';
          this.lectureVideoId = '';
      });
  }


  getByFilterViewData() {
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lectureVideoId) {
      const apiUrl = `quizes/get/quiz/filter/section?boardId=${this.boardId}&mediumId=${this.mediumId}&classId=${this.classId}&bookId=${this.bookId}&subjectId=${this.subjectId}&chapterId=${this.chapterId}&lectureVideoId=${this.lectureVideoId}`;

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

  getmultiBychapterId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.chapterId;
      this.httpService.getById('lecture-video/get/all-lecture', id).subscribe(
        (data: any) => {
          console.log("Fetched topics:", data); // Debugging line
          
          this.allmulti = data;
        },
        (error) => {
          console.error("Error fetching topics:", error); // Debugging line
          this.alertServiceService.error();
        }
      );
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
      lectureVideoId: this.lectureVideoId,
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
      page: this.page,                 // reset to first page on new search
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

  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'create') {
      this.formType = "Save";  // Switch to Save mode
      this.submitted = false;   // Reset form submission state
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
      this.allmulti = [];
      this.quizeForm.reset();
        
    } else if (tab === 'view') {
     
      this.boardId = '';
      this.mediumId = '';
      this.classId = '';
      this.subjectId = '';
      this.bookId = '';
      this.chapterId = '';
      this.lectureVideoId = '';
      this.searchBox = '';        // Clear search box
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
      this.allmulti = [];
    }
}

go(){
  this.page = 1;
  this.searchBox = "";
  this.postByFilterQuizData();
}

onSearchChange(){
  this.boardId='';
  this.classId='';
  this.mediumId='';
  this.subjectId='';
  this.bookId='';
  this.chapterId='';
  this.lectureVideoId='';
  this.page = 1;              // Reset to page 1 whenever search changes
  this.postBySearchQuizData();    // Perform the search
  // this.cancel();
}

showBulkQuizData(){
  if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lectureVideoId) {
    this.postByFilterQuizData();
  } else {
    this.postBySearchQuizData();
  }
}

downloadSampleFile(): void {
  const sampleFileUrl = 'assets/files/sample_Question_Upload.csv';  // Correct path, no 'src/' prefix
  const link = document.createElement('a');
  link.href = sampleFileUrl;
  link.download = 'Sample-Bulk-Quiz.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



}
