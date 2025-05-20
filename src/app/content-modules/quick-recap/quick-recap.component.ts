  import { Component } from '@angular/core';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { quickRecapClass } from 'src/app/models/models';
  import { AlertServiceService } from 'src/app/services/alert-service.service';
  import { HttpServiceService } from 'src/app/services/http-service.service';

  @Component({
    selector: 'app-quick-recap',
    templateUrl: './quick-recap.component.html',
    styleUrls: ['./quick-recap.component.css']
  })
  export class QuickRecapComponent {


    activeTab: string = 'create';
    quickRecapForm!: FormGroup;
    recapModel!: quickRecapClass;
    twoWay: any;
    searchBox!: string;

    limit = 10;
    total: number = 0;
    page: number = 1
    paginationConfig: any;

    allLessons!: any[];

    submitted = false;
    BoardsList!: any[];
    getAllData!: any[];
    allClasses!: any[];
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
    all_Recap!: any[];
    formType: string = "Save";
    selectedChapter: string = "select chapter";

    // modules
    boardId = ''
    mediumId = ''
    classId = ''
    subjectId = ''
    bookId = ''
    chapterId = ''
    lessonId = ''
    
    expandedRowIndex: number | null = null;

    constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
    get f() { return this.quickRecapForm.controls; }

    ngOnInit() {
      this.initializeValidations();
      this.getAllBoards();
      this.getAllMedium();
      this.getAllClasses();
      // this.getAllSubjects();
      // this.getAllRecap();
        }

    initializeValidations() {
      this.quickRecapForm = this.fb.group({
        boardId: [null, [Validators.required]],
        mediumId: [null, [Validators.required]],
        classId: [null, [Validators.required]],
        subjectId: [null, [Validators.required]],
        bookId: [null, [Validators.required]],
        chapterId: [null, [Validators.required]],
        lessonId: [null ],
        description: [null, [Validators.required]],
        id: ['']
      });
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

    getAllRecap() {
      this.httpService.get('quickrecaps?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
        if (data.results.length > 0) {
          this.all_Recap = data.results;
          this.paginationConfig = {
            itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
          }
        } else {
          this.all_Recap = [];
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }

    pageChangeEvent(pageNumber: number): void {
      this.page = pageNumber;
      // this.getAllRecap();
      this.showQuickRecapData();
    }

    selectPaginationSize(event: any) {
      if (event.target.value) {
        this.limit = event.target.value;
        // this.getAllRecap();
        this.showQuickRecapData();
      }
    }

    cancel() {
      this.submitted = false;
      this.formType = "Save";
      this.quickRecapForm.reset();
    }

    submitForm() {
      console.log(this.quickRecapForm)
      this.submitted = true;
      if (this.quickRecapForm.invalid) {
        return;
      }
      if (this.formType == "Save") {
        this.save_Recap();
      } else if (this.formType == "Update") {
        this.update_Recap();
      }
    }

    // sanitizeHtml(input: string): string {
    //   const sanitizedText = input.replace(/<\/?[^>]+(>|$)/g, '');
    //   const sanitizedAndNewlinesRemoved = sanitizedText.replace(/\n/g, '');
    //   const decodedText = document.createElement('textarea');
    //   decodedText.innerHTML = sanitizedAndNewlinesRemoved;
    //   return decodedText.value;
    // }

    save_Recap() {
      // this.showQuickRecapData();
      this.recapModel = this.quickRecapForm.value;

        // Sanitize the description 
    const sanitizedDescription = (this.recapModel.description);
    this.recapModel.description = sanitizedDescription || '';

      for (let i = 0; i < this.allChapters.length; i++) {
        if (this.quickRecapForm.value.chapterId == this.allChapters[i].id) {
          this.recapModel.chapterName = this.allChapters[i].chapterName;
        }
      }
      delete this.recapModel.id;

      // If lessonId is null, remove it from recapModel
      if (this.recapModel.lessonId == null) {
        delete this.recapModel.lessonId;
        // this.recapModel.lessonId = ''
      }
      this.httpService.post('quickrecaps', this.recapModel).subscribe((data: any) => {
        this.alertServiceService.success();
        this.cancel();
        this.quickRecapForm.patchValue({
          description: null
        });
        // this.getAllRecap();
        
        this.submitted = false;
      },
        (error) => {
          this.alertServiceService.error();
        })
    }

    update_Recap() {
     
      this.recapModel = this.quickRecapForm.value;

      // Sanitize the description 
      const sanitizedDescription = (this.recapModel.description);
    this.recapModel.description = sanitizedDescription || '';

      for (let i = 0; i < this.allChapters.length; i++) {
        if (this.quickRecapForm.value.chapterId == this.allChapters[i].id) {
          this.recapModel.chapterName = this.allChapters[i].chapterName;
        } else {
          console.log("Not found");
        }
      }
      delete this.recapModel.chapterName;

      // If lessonId is null, remove it from recapModel
      if (this.recapModel.lessonId == null || this.recapModel.lessonId == '') {
        delete this.recapModel.lessonId;
        // this.recapModel.lessonId = ''
      }

      this.httpService.patch('quickrecaps', this.recapModel).subscribe((data: any) => {
        this.alertServiceService.update();
        this.cancel();
        this.showQuickRecapData();
        // this.getAllRecap();
      }, (error) => {
        this.alertServiceService.error();
      })
    }

    getBookBySubjectId(event: any, showForUpdate: boolean) {
      if (event) {
        const id = event.target?.value ? event.target.value : event.subjectId;
        this.httpService.getById('books/subject', id).subscribe((data: any) => {
          this.quickRecapForm.controls['bookId'].reset()
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
          this.quickRecapForm.controls['chapterId'].reset()
          this.allChapters = data;
        }, (error) => {
          this.alertServiceService.error();
        }
        )
      }
    };

    edit_Recap(data: any) {
      this.httpService.get('quickrecaps/' + data.id).subscribe((response: any) => {
        if (response) {
          this.formType = "Update";
    
          // Step 1: Clear all dependent dropdowns
          this.allSubjects = [];
          this.allbooks = [];
          this.allChapters = [];
          this.allLessons = [];
    
          // Step 2: Patch base fields
          this.quickRecapForm.patchValue({
            boardId: response.boardId,
            mediumId: response.mediumId,
            classId: response.classId,
            description: response.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') || '',
            id: response.id
          });
    
          // Step 3: Load Subjects based on Board + Medium + Class
          this.httpService.get(`subjects/filter/${response.boardId}/${response.mediumId}/${response.classId}`)
            .subscribe((subjectData: any) => {
              this.allSubjects = subjectData || [];
              setTimeout(() => {
                this.quickRecapForm.patchValue({ subjectId: response.subjectId });
    
                // Step 4: Load Books based on Subject
                this.httpService.getById('books/subject', response.subjectId).subscribe((bookData: any) => {
                  this.allbooks = bookData || [];
                  setTimeout(() => {
                    this.quickRecapForm.patchValue({ bookId: response.bookId });
    
                    // Step 5: Load Chapters based on Book
                    this.httpService.getById('chapter/getChaptersByBookid', response.bookId).subscribe((chapterData: any) => {
                      this.allChapters = chapterData || [];
                      setTimeout(() => {
                        this.quickRecapForm.patchValue({ chapterId: response.chapterId });
    
                        // Step 6: Load Lessons based on Chapter
                        this.httpService.getById('lession/getallLession', response.chapterId).subscribe((lessonData: any) => {
                          this.allLessons = lessonData || [];
                          setTimeout(() => {
                            if (response.lessonId) {
                              this.quickRecapForm.patchValue({ lessonId: response.lessonId });
                            }
                          }, 100);
                        });
                      }, 100);
                    });
                  }, 100);
                });
              }, 100);
            });
        }
      }, (error) => {
        this.alertServiceService.error();
      });
    }
    
    
    delete_eBook(data: any) {
      this.httpService.delete('quickrecaps', data.id).subscribe((data: any) => {
        this.alertServiceService.delete();
        this.showQuickRecapData();
      }, (error) => {
        this.alertServiceService.error();
      })
    }

    getByFilterSubjectData() {
      if (this.quickRecapForm.value.boardId && this.quickRecapForm.value.mediumId && this.quickRecapForm.value.classId) {
        this.httpService.get(`subjects/filter/${this.quickRecapForm.value.boardId}/${this.quickRecapForm.value.mediumId}/${this.quickRecapForm.value.classId}`)
          .subscribe((data: any) => {
            this.quickRecapForm.controls['subjectId'].reset();
            this.quickRecapForm.controls['bookId'].reset()
            this.quickRecapForm.controls['chapterId'].reset()
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
    
    getByFilterSubjectDataSelect(){
      if (this.boardId && this.mediumId && this.classId) {
        this.httpService.get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
          .subscribe((data: any) => {
            this.quickRecapForm.controls['subjectId'].reset();
            if (data.length > 0) {
              this.allSubjects = data;
            } else {
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
    }
  
    getByFilterViewData() {
      if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId) {
        const apiUrl = `quickrecaps/filter/${this.boardId}/${this.mediumId}/${this.classId}/${this.subjectId}/${this.bookId}/${this.chapterId}`;

        this.httpService.get(apiUrl).subscribe((data: any) => {
          if (data && data.length > 0) {
            this.all_Recap = data;
          }
        });
      } else {
        this.alertServiceService.customError("Please select all data");
      }
    }

    getmultiBychapterId(event: any) {
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

    postByFilterQuickRecapData() {
      const filterData: any = {
        boardId: this.boardId,
        mediumId: this.mediumId,
        classId: this.classId,
        subjectId: this.subjectId,
        bookId: this.bookId,
        chapterId: this.chapterId,
        // lessonId:this.lessonId,
        limit: this.limit,
        page: this.page
        
      };

        // If lessonId is empty or falsy, remove it from filterData
      if (!this.lessonId) {
        delete filterData.lessonId;
      } else {
        filterData.lessonId = this.lessonId;
      }
    
      this.httpService.post('quickrecaps/filter', filterData).subscribe(
        (data: any) => {
          if (data.results.length > 0) {
            this.all_Recap = data.results;       // Assign fetched quick recap data
            this.total = data.totalResults;      // Update total count for pagination
            this.paginationConfig = {
              itemsPerPage: this.limit,
              currentPage: this.page,
              totalItems: this.total,
            };
          } else {
            this.all_Recap = [];                 // Clear array if no data found
          }
        },
        (error) => {
          console.error('Error fetching Quick Recaps:', error);
          this.alertServiceService.customSearchError("Quick Recaps Not Found");
          this.all_Recap = [];                   // Clear array on error
        }
      );
    }
    
    postBySearchQuickRecapData() {
      if (!this.searchBox.trim()) {
        this.all_Recap = [];
        return ;
      }
      const searchData = {
        search: this.searchBox,   // user-entered search term
        limit: this.limit,        // items per page
        page: this.page,                  // reset to first page for new searches
      };
    
      this.httpService.post('quickrecaps/filter', searchData).subscribe(
        (data: any) => {
          if (data.results.length > 0) {
            this.all_Recap = data.results;        // update quick recap array with results
            this.total = data.totalResults;       // update total count for pagination
            this.paginationConfig = {
              itemsPerPage: this.limit,
              currentPage: this.page,
              totalItems: this.total,
            };
          } else {
            this.all_Recap = [];                  // clear if no quick recaps found
          }
        },
        (error) => {
          console.error('Error fetching Quick Recaps:', error);
          this.alertServiceService.customSearchError("Quick Recaps Not Found, Try Different Search");
          this.all_Recap = [];  
        }
      );
    }
    
    setActiveTab(tab: string) {
      this.activeTab = tab;

      if (tab === 'create') {
        // Reset the form when toggling to the 'Create' tab
        this.allSubjects = [];
        this.allbooks = [];
        this.allChapters = [];
        this.quickRecapForm.reset();
        this.formType = 'Save';
            
    } else if (tab === 'view') {
        // Reset the filters when toggling to the 'View' tab
        this.boardId = '';
        this.mediumId = '';
        this.classId = '';
        this.subjectId = '';
        this.bookId = '';
        this.chapterId = '';
        this.lessonId = '';
        this.searchBox = '';
        
        // Clear dependent dropdowns
        this.allSubjects = [];
        this.allbooks = [];
        this.allChapters = [];
    }
  }

  go(){
    this.page = 1;
    this.searchBox = "";
    this.postByFilterQuickRecapData();
  }

  onSearchChange(){
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.subjectId='';
    this.bookId='';
    this.chapterId='';
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchQuickRecapData();    // Perform the search
    // this.cancel();
  }

  showQuickRecapData(){
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId ) {
      this.postByFilterQuickRecapData();
    } else {
      this.postBySearchQuickRecapData();
    }
  }

  decodeHtmlEntities(str: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  }

