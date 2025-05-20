  import { group } from '@angular/animations';
  import { Component, SimpleChanges, ViewChild } from '@angular/core';
  import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
  import { LessonMasterClass, MultimediaClass } from 'src/app/models/models';
  import { AlertServiceService } from 'src/app/services/alert-service.service';
  import { HttpServiceService } from 'src/app/services/http-service.service';
  @Component({
    selector: 'app-lecture-videos',
    templateUrl: './lecture-videos.component.html',
    styleUrls: ['./lecture-videos.component.css']
  })
  export class LectureVideosComponent {


    @ViewChild('closebutton') closebutton: any;

    multimediaForm!: FormGroup;
    multimediaArray!: FormArray;
    multimediaModel!: MultimediaClass;
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
    allbooks!: any[];
    MediumList!: any[];
    SubjectList!: any[];
    ClassList!: any[];
    BooksList!: any[];
    ChapterList!: any[];
    allMultimedia: any = [];
    allSubjects: any[] = [];
    allLessons: any[] = [];
    formType: string = "Save";

    activeTab: string = 'create';
    // for filter
    boardId = ''
    mediumId = ''
    classId = ''
    subjectId = ''
    bookId = ''
    chapterId = ''
    lessonId = ''

    constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
    get f() { return this.multimediaForm.controls; }

    ngOnInit() {
      this.initializeValidations();
      this.getAllBoards();
      this.getAllMedium();
      this.getAllClasses();
      // this.getVideoByType();
      // this.getMultimediaById()
      // this.getAllSubjects();
      this.multimediaArray = this.multimediaForm.get('multimediaArray') as FormArray;
      this.multimediaModel = this.multimediaForm.value;
      this.multimediaForm.patchValue({
        multimediaType: "Multimedia"
      })
      // this.getVideoByType();
    }

    initializeValidations() {
      this.multimediaForm = new FormGroup({
        boardId: new FormControl(null, [Validators.required]),
        mediumId: new FormControl(null, Validators.required),
        classId: new FormControl(null, Validators.required),
        subjectId: new FormControl(null, Validators.required),
        bookId: new FormControl(null, Validators.required),
        chapterId: new FormControl(null, Validators.required),
        lessonId: new FormControl(null, Validators.required),
        lessionName: new FormControl(null, Validators.required),
        order: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
        ]),  
        // icon1: new FormControl(null, Validators.required),
        // icon2: new FormControl(null, Validators.required),
        path: new FormControl(null, Validators.required),
        videoType: new FormControl(null, Validators.required),
        mobileVideoType: new FormControl(null, Validators.required),
        mobileVideoPath: new FormControl(null, Validators.required),
        // description: new FormControl(null, Validators.required),
        id: new FormControl(null)
      });
    };

    onFileSelect(event: any) {
      const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.multimediaForm.patchValue({
          icon1: reader.result
        });
      }
      this.multimediaModel.icon1 = file;
      event.target.value = null;
    }

    onFileSelect2(event: any) {
      const reader = new FileReader();
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.multimediaForm.patchValue({
          icon2: reader.result
        });
      }
      this.multimediaModel.icon2 = file;
      event.target.value = null;
    }

    onLessonChange(event: any) {
      const selectedLessonId = event.target.value;
      const selectedLesson = this.allLessons.find(lesson => lesson.id === selectedLessonId);
      if (selectedLesson) {
        this.multimediaForm.patchValue({
          lessionName: selectedLesson.name
        });
      }
    }
    

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


    getVideoByType() {
      this.httpService.get('lecture-video').subscribe((data: any) => {
        this.allMultimedia = data.results;
        console.log(this.allMultimedia)
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.allMultimedia?.length || 0, // Ensure `totalItems` is not undefined
          directionLinks: false
        };
      });
    }

    cancel() {
      this.multimediaForm.reset();
      this.submitted = false;
      this.formType = "Save";
      this.multimediaForm.patchValue({
        multimediaType: "Multimedia"
      })
    }

    cancelForSave() {
      this.multimediaForm.controls['lessionName'].reset();
      // this.multimediaForm.controls['icon1'].reset();
      // this.multimediaForm.controls['icon2'].reset();
      this.multimediaForm.controls['path'].reset();
      this.multimediaForm.controls['order'].reset();
      this.multimediaForm.reset();
      this.submitted = false;
    }

    pageChangeEvent(pageNumber: number): void {
      this.page = pageNumber;
      // this.getVideoByType();
      this.showLectureVideo();
    }

    selectPaginationSize(event: any) {
      if (event.target.value) {
        this.limit = event.target.value;
        // this.getVideoByType();
        this.showLectureVideo();
      }
    }

    submitForm() {
      this.submitted = true;
      if (this.multimediaForm.invalid) {
        return;
      }
      if (this.formType == "Save") {
        this.saveMultimedia();
      } else if (this.formType == "Update") {
        this.updateMultimedia();
      }
    }

    saveMultimedia() {
      this.httpService.post('lecture-video', this.multimediaForm.value).subscribe((data: any) => {
        this.alertServiceService.success();
        this.cancelForSave();
        // this.getVideoByType();
        this.showLectureVideo();
        this.multimediaForm.reset();
      })
    }

    updateMultimedia() {
      this.httpService.patch('lecture-video', this.multimediaForm.value).subscribe((data: any) => {
        this.alertServiceService.update();
        this.cancel();
        this.formType = "Save";
        this.closebutton.nativeElement.click();
        // this.getVideoByType();
        this.showLectureVideo();
      })
    }

    forAppendData(files: any) {

      const appendData = new FormData();
      appendData.append("boardId", this.multimediaModel.boardId);
      appendData.append("mediumId", this.multimediaModel.mediumId);
      appendData.append("classId", this.multimediaModel.classId);
      appendData.append("subjectId", this.multimediaModel.subjectId);
      appendData.append("bookId", this.multimediaModel.bookId);
      appendData.append("chapterId", this.multimediaModel.chapterId);
      appendData.append("lessonId", this.multimediaModel.lessonId);
      appendData.append("lessionName", this.multimediaModel.lessionName);
      appendData.append("path", this.multimediaModel.path);
      appendData.append("videoType", this.multimediaModel.videoType);
      appendData.append("order", this.multimediaModel.order)
      appendData.append("mobileVideoType", this.multimediaModel.mobileVideoType);
      appendData.append("mobileVideoPath", this.multimediaModel.mobileVideoPath);
      // appendData.append("description", this.multimediaModel.mobileVideoPath);
      // appendData.append("files", this.multimediaModel.icon1);
      // appendData.append("files", this.multimediaModel.icon2);
      for (let i = 0; i < files.length; i++) {
        const type = files[i].length;
        if (!type) {
          appendData.append('files', files[i]);
        }
      }

      if (this.formType == 'Update') {
        appendData.append('id', this.multimediaModel.id)
      }
      return appendData;
    }

    getMultimediaById(multimediaItem: any) {
      if (multimediaItem) {
        this.formType = "Update";
    
        // Patch board, medium, class first
        this.multimediaForm.patchValue({
          boardId: multimediaItem.boardId || null,
          mediumId: multimediaItem.mediumId || null,
          classId: multimediaItem.classId || null,
          lessionName: multimediaItem.lessionName || '',
          // icon1: multimediaItem.icon1 || '',
          // icon2: multimediaItem.icon2 || '',
          path: multimediaItem.path || '',
          order: multimediaItem.order || '',
          videoType: multimediaItem.videoType || '',
          id: multimediaItem.id || null,
          mobileVideoType: multimediaItem.mobileVideoType || '',
          mobileVideoPath: multimediaItem.mobileVideoPath || '',
          // description: multimediaItem.description || '',
        });
    
        // Step 1: Load Subjects
        this.httpService.get(`subjects/filter/${multimediaItem.boardId}/${multimediaItem.mediumId}/${multimediaItem.classId}`)
          .subscribe((subjects: any) => {
            this.allSubjects = subjects || [];
    
            // Only patch after subject list loaded
            setTimeout(() => {
              this.multimediaForm.patchValue({
                subjectId: multimediaItem.subjectId || null,
              });
    
              // Step 2: Load Books
              if (multimediaItem.subjectId) {
                this.httpService.getById('books/subject', multimediaItem.subjectId).subscribe((books: any) => {
                  this.allbooks = books || [];
    
                  // Only patch after books loaded
                  setTimeout(() => {
                    this.multimediaForm.patchValue({
                      bookId: multimediaItem.bookId || null,
                    });
    
                    // Step 3: Load Chapters
                    if (multimediaItem.bookId) {
                      this.httpService.getById('chapter/getChaptersByBookid', multimediaItem.bookId).subscribe((chapters: any) => {
                        this.allChapters = chapters || [];
    
                        // Only patch after chapters loaded
                        setTimeout(() => {
                          this.multimediaForm.patchValue({
                            chapterId: multimediaItem.chapterId || null,
                          });
    
                          // Step 4: Load Lessons
                          if (multimediaItem.chapterId) {
                            this.httpService.getById('lession/getallLession', multimediaItem.chapterId).subscribe((lessons: any) => {
                              this.allLessons = lessons || [];
    
                              // Only patch after lessons loaded
                              setTimeout(() => {
                                this.multimediaForm.patchValue({
                                  lessonId: multimediaItem.lessonId || null,
                                });
                              }, 100);
                            });
                          }
                        }, 100);
                      });
                    }
                  }, 100);
                });
              }
            }, 100);
          });
      }
    }
    
    

    getBookBySubjectId(event: any, showForUpdate: boolean) {
      if (event) {
        const id = event.target?.value ? event.target.value : event.subjectId;
        this.httpService.getById('books/subject', id).subscribe((data: any) => {
          this.multimediaForm.controls['bookId'].reset()
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
          this.multimediaForm.controls['chapterId'].reset()
          this.allChapters = data;
        }, (error) => {
          this.alertServiceService.error();
        }
        )
      }
    };

    getByFilterSubjectDataselect() {
      if (this.multimediaForm.value.boardId && this.multimediaForm.value.mediumId && this.multimediaForm.value.classId) {
        this.httpService.get(`subjects/filter/${this.multimediaForm.value.boardId}/${this.multimediaForm.value.mediumId}/${this.multimediaForm.value.classId}`)
          .subscribe((data: any) => {
            this.multimediaForm.controls['subjectId'].reset()
            if (data.length > 0) {
              this.allSubjects = data;
              // Reset Book and Chapter Dropdowns
             
            }
            else {
              this.allSubjects = [];
            }
          });
           // Clear book and chapter lists to ensure they are refreshed
            this.allbooks = [];
            this.allChapters = [];
            this.multimediaForm.controls['bookId'].reset();  
            this.multimediaForm.controls['chapterId'].reset();
            this.allLessons = [];
            this.multimediaForm.controls['lessonId'].reset(); 
            this.multimediaForm.controls['lessionName'].reset();
      }
    }

    getByFilterSubjectData() {
      this.httpService
        .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
        .subscribe((data: any) => {
          this.multimediaForm.controls['subjectId'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
          }
          else {
            this.allSubjects = [];
          }
          // Clear book and chapter lists to ensure they are refreshed
          this.allbooks = [];
          this.allChapters = [];
          this.allLessons = [];
          this.subjectId = '';
          this.bookId = '';
          this.chapterId = '';
          this.lessonId = '';
          // this.multimediaForm.controls['bookId'].reset();  
          // this.multimediaForm.controls['chapterId'].reset();
        });
    }


    getMultimediaByFilter() {
      if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lessonId) {
        this.httpService.get(`lecture-video/filter/${this.boardId}/${this.mediumId}/${this.classId}/${this.subjectId}/${this.bookId}/${this.chapterId}/${this.lessonId}`)
          .subscribe((data: any) => {
            this.allMultimedia = data;

          });
      }
    }

    postByFilterLectureVideoData() {
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
    
      this.httpService.post('lecture-video/filter', filterData).subscribe(
        (data: any) => {
          if (data.results.length > 0) {
            this.allMultimedia = data.results;   // Assign fetched lecture videos
            this.total = data.totalResults;         // Update total count
            this.paginationConfig = {
              itemsPerPage: this.limit,
              currentPage: this.page,
              totalItems: this.total,
            };
          } else {
            this.allMultimedia = [];             // Clear if no videos found
          }
        },
        (error) => {
          console.error('Error fetching lecture videos:', error);
          this.alertServiceService.customSearchError("Lecture Videos Not Found");
          this.allMultimedia = [];               // Clear array on error
        }
      );
    }
    

    deleteMultimedia(data: any) {
      this.httpService.delete('lecture-video', data.id).subscribe((data: any) => {
        this.alertServiceService.delete();
        // this.getVideoByType();
        this.showLectureVideo();
      })
    }

    postBySearchLectureVideoData() {
      if (!this.searchBox.trim()) {
        this.allMultimedia = [];
        return ;
      }
      const searchData = {
        search: this.searchBox,  // user-entered search term
        limit: this.limit,       // items per page
        page: this.page,         
      };
    
      this.httpService.post('lecture-video/filter', searchData).subscribe(
        (data: any) => {
          if (data.results.length > 0) {
            this.allMultimedia = data.results;   // Assign fetched lecture videos
            this.total = data.totalResults;         // Update total count
            this.paginationConfig = {
              itemsPerPage: this.limit,
              currentPage: this.page,
              totalItems: this.total,
            };
          } else {
            this.allMultimedia = [];             // Clear if no videos found
          }
        },
        (error) => {
          console.error('Error fetching searched lecture videos:', error);
          this.alertServiceService.customSearchError("Lecture Videos Not Found, Try Different Search");
          this.allMultimedia = [];   
        }
      );
    }

    disableScroll(event: WheelEvent) {
      event.preventDefault();
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
      this.postBySearchLectureVideoData();    // Perform the search
      // this.cancel();
    }

    showLectureVideo(){
      if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId && this.lessonId ) {
        this.postByFilterLectureVideoData();
      } else {
        this.postBySearchLectureVideoData();
      }
    }

    setActiveTab(tab: string) {
      this.activeTab = tab;
  
      if (tab === 'create') {
          // Reset the form when toggling to the 'Create' tab
          this.allSubjects = [];
          this.allbooks = [];
          this.allChapters = [];
          this.multimediaForm.reset();
          this.formType = 'Save';
          
           // Ensure the multimediaType is set to 'Lecture' by default
          // this.multimediaForm.patchValue({
          //     multimediaType: 'Lecture'
          // });
          
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
  
  getLessonByChapterId(event: any) {
    const chapterId = event.target ? event.target.value : event.chapterId;
  
    this.httpService.getById('lession/getallLession', chapterId).subscribe((data: any) => {
      this.allLessons = data;
    });
  }
  
  
  go(){
    this.page = 1;
    this.searchBox = "";
    this.postByFilterLectureVideoData();
}

  }


