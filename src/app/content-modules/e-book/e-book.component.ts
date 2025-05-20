import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { eBookClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-e-book',
  templateUrl: './e-book.component.html',
  styleUrls: ['./e-book.component.css']
})
export class EBookComponent {

  activeTab: string = 'create';
  @ViewChild('closebutton') closebutton: any;

  eBookForm!: FormGroup;
  eBookModel!: eBookClass;
  searchBox!: string;

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
  allBoards!: any[];
  allSubjects: any[]= [];
  allbooks!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  all_eBooks!: any[];
  formType: string = "Save";
  selectedChapter: string = "select chapter";

   // for filter
   boardId=''
   mediumId=''
   classId=''
   subjectId=''
   bookId=''
   chapterId=''

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.eBookForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getAllSubjects();
    // this.getAlle_Book();
  }

  initializeValidations() {
    this.eBookForm = this.fb.group({
      boardId: [null, [Validators.required]],
      mediumId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      bookId: [null, [Validators.required]],
      chapterId: [null, [Validators.required]],
      path: [null, [Validators.required]],
      order: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
      ]),

      id: ['']
    });
  };



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

  // getAllSubjects() {
  //   this.httpService.get('subjects?limit=' + 0 + '&page=' + this.page).subscribe((data: any) => {
  //     if (data.results.length > 0) {
  //       this.allSubjects = data.results;
  //     }
  //   }, (error) => {
  //     this.alertServiceService.error();
  //   })
  // }
 
  getAlle_Book() {
    this.httpService.get('ebooks?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.all_eBooks = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    // this.getAlle_Book();
    this.showEbookData();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      // this.getAlle_Book();
    this.showEbookData();

    }
  }

  cancel() {
    this.submitted = false;
    this.formType = "Save";
    this.eBookForm.reset();
  }

  submitForm() {
    console.log(this.eBookForm)
    this.submitted = true;
    if (this.eBookForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.save_eBook();
    } else if (this.formType == "Update") {
      this.update_eBook();
    }
  }

  save_eBook() {
    this.eBookModel = this.eBookForm.value;

    for (let i = 0; i < this.allChapters.length; i++) {
      if (this.eBookForm.value.chapterId == this.allChapters[i].id) {
        this.eBookModel.chapterName = this.allChapters[i].chapterName;
      } else {
        console.log("Not found");
      }
    }
    console.log(this.eBookModel)
    delete this.eBookModel.id;
    this.httpService.post('ebooks', this.eBookModel).subscribe((data: any) => {
      this.alertServiceService.success();
      // this.eBookForm.patchValue({
      //   path:null,
      //   chapterId:null,
      //   order:null
      // })
      this.eBookForm.reset();
      // this.getAlle_Book();
      // this.postByFilterEbookData();
      this.submitted = false;
    },
      (error) => {
        this.alertServiceService.error();
      })
  }

  update_eBook() {
    this.eBookModel = this.eBookForm.value;
    for (let i = 0; i < this.allChapters.length; i++) {
      if (this.eBookForm.value.chapterId == this.allChapters[i].id) {
        this.eBookModel.chapterName = this.allChapters[i].chapterName;
      } else {
        console.log("Not found");
      }
    }
    this.httpService.patch('ebooks', this.eBookModel).subscribe((data: any) => {
      this.alertServiceService.update();
      this.closebutton.nativeElement.click();
      this.cancel();
      // this.getAlle_Book();
      this.showEbookData();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  setMultimediaType(type: string) {
    if (type == 'multimedia') {
      this.activeTab = 'create'
      this.eBookForm.reset();

      this.eBookForm.value.multimediaType = 'multimedia'
      this.eBookForm.patchValue({
        multimediaType: 'multimedia'
      })
      this.formType = "Save";  // Switch to Save mode
      this.submitted = false;   // Reset form submission state
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
    } else {
      this.activeTab = 'view'
      this.eBookForm.value.multimediaType = 'lecture';
      this.eBookForm.patchValue({
        multimediaType: 'lecture'
      })
      this.boardId = '';
      this.mediumId = '';
      this.classId = '';
      this.subjectId = '';
      this.bookId = '';
      this.chapterId = '';
      this.searchBox = '';        // Clear search box
      this.allSubjects = [];
      this.allbooks = [];
      this.allChapters = [];
    }
  }


  getBookBySubjectId(event: any, showForUpdate: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (event) {
        const id = event.target?.value ? event.target.value : event.subjectId;
        this.httpService.getById('books/subject', id).subscribe((data: any) => {
          this.allbooks = data;
          if (showForUpdate) {
            this.getChapterByBookId(event).then(resolve).catch(reject);
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
        const id = event.target?.value ? event.target?.value : event.bookId;
        this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
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
  

  edit_eBook(data: any) {
    this.httpService.get('ebooks/' + data.id).subscribe(async (response: any) => {
      if (response) {
        this.formType = "Update";
  
        this.eBookForm.patchValue({
          boardId: response.boardId,
          mediumId: response.mediumId,
          classId: response.classId,
          path: response.path,
          order: response.order,
          id: response.id,
        });
  
        // Fetch and wait subject list
        await new Promise<void>((resolve, reject) => {
          this.httpService.get(`subjects/filter/${response.boardId}/${response.mediumId}/${response.classId}`)
            .subscribe((subjectData: any) => {
              this.allSubjects = subjectData || [];
              setTimeout(() => {
                if (this.allSubjects.some(sub => sub.id === response.subjectId)) {
                  this.eBookForm.controls['subjectId'].setValue(response.subjectId);
                }
                resolve();
              }, 0); // <= WAIT for view update before patch
            }, (error) => reject(error));
        });
  
        // Fetch and wait book list
        await new Promise<void>((resolve, reject) => {
          this.httpService.getById('books/subject', response.subjectId).subscribe((bookData: any) => {
            this.allbooks = bookData || [];
            setTimeout(() => {
              if (this.allbooks.some(book => book.id === response.bookId)) {
                this.eBookForm.controls['bookId'].setValue(response.bookId);
              }
              resolve();
            }, 0);
          }, (error) => reject(error));
        });
  
        // Fetch and wait chapter list
        await new Promise<void>((resolve, reject) => {
          this.httpService.getById('chapter/getChaptersByBookid', response.bookId).subscribe((chapterData: any) => {
            this.allChapters = chapterData || [];
            setTimeout(() => {
              if (this.allChapters.some(ch => ch.id === response.chapterId)) {
                this.eBookForm.controls['chapterId'].setValue(response.chapterId);
              }
              resolve();
            }, 0);
          }, (error) => reject(error));
        });
  
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  
  

  delete_eBook(data: any) {
    this.httpService.delete('ebooks', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      // this.getByFilterViewData()
      this.showEbookData();
      },
     
       (error) => {
      this.alertServiceService.error();
    })
  }

  getByFilterSubjectDataselect() {
    if (this.eBookForm.value.boardId && this.eBookForm.value.mediumId && this.eBookForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.eBookForm.value.boardId}/${this.eBookForm.value.mediumId}/${this.eBookForm.value.classId}`)
        .subscribe((data: any) => {
          this.eBookForm.controls['subjectId'].reset()
          this.eBookForm.controls['bookId'].reset()
          this.eBookForm.controls['chapterId'].reset()
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

  getByFilterSubjectData() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        this.eBookForm.controls['subjectId'].reset()
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
      });
  }

  getByFilterViewData() {
    this.httpService
    .get(`ebooks/filter/${this.boardId}/${this.mediumId}/${this.classId}/${this.subjectId}/${this.bookId}`)
    .subscribe((data: any) => {
        if (data.length > 0) {
        this.all_eBooks = data;
      }
            
    });
  }
   
  postByFilterEbookData() {
    const filterData = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      subjectId: this.subjectId,
      bookId: this.bookId,
      limit: this.limit,
      page: this.page
    };
  
    this.httpService.post('ebooks/getebooks/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.all_eBooks = data.results;       // Assign fetched eBooks
          this.total = data.totalResults;       // Update total count
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.all_eBooks = [];                 // Clear if no eBooks found
        }
      },
      (error) => {
        console.error('Error fetching eBooks:', error);
        this.alertServiceService.customSearchError("eBooks Not Found");
        this.all_eBooks = [];                   // Clear array on error
      }
    );
  }
  
  postBySearchEbookData() {
    if (!this.searchBox.trim()) {
      this.all_eBooks = [];
      return ;
    }
    const searchData = {
      search: this.searchBox,   // user-entered search term
      limit: this.limit,        // items per page
      page: this.page,                  // reset to first page for new searches
    };
  
    this.httpService.post('ebooks/getebooks/filter', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.all_eBooks = data.results;         // update eBooks array with results
          this.total = data.totalResults;         // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.all_eBooks = [];                   // clear if no eBooks found
        }
      },
      (error) => {
        console.error('Error fetching eBooks:', error);
        this.alertServiceService.customSearchError("eBooks Not Found, Try Different Search");
        this.all_eBooks = []; 
      }
    );
  }
  
  disableScroll(event: WheelEvent) {
    event.preventDefault();
  }

  go(){
    this.page = 1;
    this.searchBox = "";
    this.postByFilterEbookData();
  }

  onSearchChange(){
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.subjectId='';
    this.bookId='';
    this.chapterId='';
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchEbookData();    // Perform the search
    // this.cancel();
  }

  showEbookData(){
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId ) {
      this.postByFilterEbookData();
    } else {
      this.postBySearchEbookData();
    }
  }


 }
