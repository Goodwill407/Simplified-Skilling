      import { group } from '@angular/animations';
      import { Component, SimpleChanges, ViewChild } from '@angular/core';
      import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
      import { LessonMasterClass, MultimediaClass } from 'src/app/models/models';
      import { AlertServiceService } from 'src/app/services/alert-service.service';
      import { HttpServiceService } from 'src/app/services/http-service.service';
      import { NgxPaginationModule } from 'ngx-pagination';
      @Component({
        selector: 'app-multimedia-videos',
        templateUrl: './multimedia-videos.component.html',
        styleUrls: ['./multimedia-videos.component.css']
      })
      export class MultimediaVideosComponent {

        @ViewChild('closebutton') closebutton: any;

        multimediaForm!: FormGroup;
        multimediaArray!: FormArray;
        multimediaModel!: MultimediaClass;
        searchBox!: string;

        page: number = 1;
        total: number = 0;
        limit: number = 10;
        
        totalPages: number = 0;
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
        formType: string = "Save";
      
        activeTab: string = 'create';

        // for filter
        boardId = ''
        mediumId = ''
        classId = ''
        subjectId = ''
        bookId = ''
        chapterId = ''

        constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
        get f() { return this.multimediaForm.controls; }

        ngOnInit() {
          this.getAllMedium();
          this.initializeValidations();
          this.getAllBoards();
          // this.getVideoByType();  
          this.getAllClasses();
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
            lessionName: new FormControl(null, Validators.required),
            order: new FormControl('', [
              Validators.required,
              Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
            ]),
            icon1: new FormControl(null, Validators.required),
            icon2: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            path: new FormControl(null, Validators.required),
            multimediaType: new FormControl(null, Validators.required),
            videoType: new FormControl(null, Validators.required),
            mobileVideoType: new FormControl(null, Validators.required),
            mobileVideoPath: new FormControl(null, Validators.required),
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

        setMultimediaType(type: string) {
          if (type == 'multimedia') {
            this.multimediaForm.value.multimediaType = 'Multimedia'
            this.multimediaForm.patchValue({
              multimediaType: 'Multimedia'
            })
          } else {
            this.multimediaForm.value.multimediaType = 'Lecture';
            this.multimediaForm.patchValue({
              multimediaType: 'Lecture'
            })
          }
          // this.getVideoByType();
        }

        getAllBoards() {
          this.httpService.get(`boards`).subscribe((data: any) => {
            if (data.results.length > 0) {
              this.allBoards = data.results;
              this.total = data.totalCount; // Update total count for pagination
            }
          });
        }
        
        getAllMedium() {
          this.httpService.get(`medium`).subscribe((data: any) => {
            if (data.results.length > 0) {
              this.allMediums = data.results;
              this.total = data.totalCount;
            }
          });
        }
        
        getAllClasses() {
          this.httpService.get(`classes`).subscribe((data: any) => {
            if (data.results.length > 0) {
              this.allClasses = data.results;
              this.total = data.totalCount;
            }
          });
        }
        
        getVideoByType() {
          const requestBody = {
            limit: this.limit,
            page: this.page
          };
        
          this.httpService.post(`multimedia/getByType`, requestBody).subscribe((data: any) => {
            if (data.results && data.results.length > 0) {
              this.allMultimedia = data.results;
              this.total = data.totalResults; 
              this.totalPages = Math.ceil(this.total / this.limit); 
        
              this.paginationConfig = {
                itemsPerPage: this.limit,
                currentPage: this.page,
                totalItems: this.total
              };
            } else {
              this.allMultimedia = [];
              this.total = 0;
              this.totalPages = 0;
            }
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
          this.multimediaForm.controls['icon1'].reset();
          this.multimediaForm.controls['icon2'].reset();
          this.multimediaForm.controls['path'].reset();
          this.multimediaForm.controls['order'].reset();
          this.multimediaForm.reset();
          this.submitted = false;
          this.multimediaForm.patchValue({
            multimediaType: "Multimedia"
          })
        }

        pageChangeEvent(pageNumber: number): void {
          // if (pageNumber < 1 || pageNumber > this.totalPages) {
          //   return; // Prevents navigation to invalid pages
          // }
          this.page = pageNumber;
          this.showMultimedia();
          // this.getVideoByType();
        }
        
        selectPaginationSize(event: any) {
          if (event.target.value) {
            this.limit = Number(event.target.value);
            this.page = 1; // Reset to first page
            // this.getVideoByType();
            this.showMultimedia();
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
          this.httpService.post('multimedia', this.multimediaForm.value).subscribe((data: any) => {
            this.alertServiceService.success();
            this.cancelForSave();
            this.showMultimedia();
          })
        }

        updateMultimedia() {
          this.httpService.patch('multimedia', this.multimediaForm.value).subscribe((data: any) => {
            this.alertServiceService.update();
            this.cancel();
            this.formType = "Save";
            this.closebutton.nativeElement.click();
            this.showMultimedia();
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
          appendData.append("lessionName", this.multimediaModel.lessionName);
          appendData.append("path", this.multimediaModel.path);
          appendData.append("multimediaType", this.multimediaModel.multimediaType);
          appendData.append("videoType", this.multimediaModel.videoType);
          appendData.append("mobileVideoType", this.multimediaModel.mobileVideoType);
          appendData.append("description", this.multimediaModel.description);
          appendData.append("mobileVideoPath", this.multimediaModel.mobileVideoPath);
          appendData.append("order", this.multimediaModel.order)
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

        getMultimediaById(data: any) {
          this.httpService.getById('multimedia', data.id).subscribe((response: any) => {
            if (response) {
              this.formType = "Update";
        
              // Step 1: Patch Board, Medium, Class, Other Fields
              this.multimediaForm.patchValue({
                boardId: response.boardId,
                mediumId: response.mediumId,
                classId: response.classId,
                lessionName: response.lessionName,
                icon1: response.icon1,
                icon2: response.icon2,
                description: response.description,
                path: response.path,
                order: response.order,
                multimediaType: response.multimediaType,
                videoType: response.videoType,
                mobileVideoPath: response.mobileVideoPath,
                mobileVideoType: response.mobileVideoType,
                id: response.id
              });
        
              // Step 2: Load Subjects first
              this.httpService.get(`subjects/filter/${response.boardId}/${response.mediumId}/${response.classId}`)
                .subscribe((subjectData: any) => {
                  if (subjectData && subjectData.length > 0) {
                    this.allSubjects = subjectData;
        
                    setTimeout(() => {
                      this.multimediaForm.controls['subjectId'].setValue(response.subjectId);
        
                      // Step 3: Now load Books
                      this.httpService.getById('books/subject', response.subjectId).subscribe((bookData: any) => {
                        if (bookData && bookData.length > 0) {
                          this.allbooks = bookData;
        
                          setTimeout(() => {
                            this.multimediaForm.controls['bookId'].setValue(response.bookId);
        
                            // Step 4: Now load Chapters
                            this.httpService.getById('chapter/getChaptersByBookid', response.bookId).subscribe((chapterData: any) => {
                              if (chapterData && chapterData.length > 0) {
                                this.allChapters = chapterData;
        
                                setTimeout(() => {
                                  this.multimediaForm.controls['chapterId'].setValue(response.chapterId);
                                }, 100); // Minor delay for chapters
                              }
                            });
        
                          }, 100); // Minor delay for books
        
                        }
                      });
        
                    }, 100); // Minor delay for subjects
        
                  }
                });
            }
          });
        }
        
        

        getBookBySubjectId(event: any, showForUpdate: boolean) {
          if (event) {
            const id = event.target?.value ? event.target.value : event.subjectId;
            this.httpService.getById('books/subject', id).subscribe((data: any) => {
              console.log(data);
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
          // if (this.multimediaForm.value.boardId && this.multimediaForm.value.mediumId && this.multimediaForm.value.classId) {
            this.httpService.get(`subjects/filter/${this.multimediaForm.value.boardId}/${this.multimediaForm.value.mediumId}/${this.multimediaForm.value.classId}`)
              .subscribe((data: any) => {
                this.multimediaForm.controls['subjectId'].reset()
              this.multimediaForm.controls['chapterId'].reset()
              this.multimediaForm.controls['bookId'].reset()
                if (data.length > 0) {
                  this.allSubjects = data;
                }
                else {
                  this.allSubjects = [];
                }
              });
              // Reset dependent dropdowns to default
              this.subjectId = '';
              this.bookId = '';
              this.allbooks = [];
              this.chapterId = '';
              this.allChapters = [];
              // }
        }

        getByFilterSubjectData() {
          this.httpService
            .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
            .subscribe((data: any) => {
              //this.multimediaForm.controls['subjectId'].reset()
              if (data.length > 0) {
                this.allSubjects = data;
              }
              else {
                this.allSubjects = [];
              }
            });
             // Reset dependent dropdowns to default
          this.subjectId = '';
          this.bookId = '';
          this.allbooks = [];
          this.chapterId = '';
          this.allChapters = [];
        }


        getMultimediaByFilter() {
          if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId) {
            this.httpService.get(`multimedia/filter/${this.boardId}/${this.mediumId}/${this.classId}/${this.subjectId}/${this.bookId}/${this.chapterId}`)
              .subscribe((data: any) => {
                this.allMultimedia = data;

              });
          }
        }

        getMultimediaByFilterPost() {
          const filterData = {
            boardId: this.boardId,
            mediumId: this.mediumId,
            classId: this.classId,
            subjectId: this.subjectId,
            bookId: this.bookId,
            chapterId: this.chapterId,
            multimediaType: "Multimedia",  // Set the multimedia type
            limit: this.limit,  
            page: this.page
          };
        
          this.httpService.post('multimedia/getmultimedia/filter', filterData).subscribe(
            (data: any) => {
              if (data.results && data.results.length > 0) {
                this.allMultimedia = data.results;  // Assign the results to the multimedia array
                this.total = data.totalResults;   // Update total results
                this.paginationConfig = {
                  itemsPerPage: this.limit,
                  currentPage: this.page,
                  totalItems: this.total,
                };
              } else {
                this.allMultimedia = [];  // If no results are found, clear the multimedia array
              }
            },
            (error) => {
              // Handle error
              this.alertServiceService.customSearchError("Multimedia Not Found");
              this.allMultimedia = [];  // Clear the multimedia array on error
            }
          );
        }
        
        deleteMultimedia(data: any) {
          this.httpService.delete('multimedia', data.id).subscribe((data: any) => {
            this.alertServiceService.delete();
            this.showMultimedia();
          })
        }

        postBySearchMultimediaData() {
          if (!this.searchBox.trim()) {
            this.allMultimedia = [];
            return ;
          }
          const searchData = {
            search: this.searchBox,  // search term entered by the user
            limit: this.limit,       // items per page
            page: this.page,         // current page number
          };
        
          this.httpService.post('multimedia/getmultimedia/filter', searchData).subscribe(
            (data: any) => {
              if (data.results.length > 0) {
                this.allMultimedia = data.results;  // update multimedia list
                this.total = data.totalResults;     // update total count for pagination
                this.paginationConfig = {
                  itemsPerPage: this.limit,
                  currentPage: this.page,
                  totalItems: this.total,
                };
              } else {
                this.allMultimedia = [];  // No multimedia found, clear the list
              }
            },
            (error) => {
              console.error('Error fetching filtered Multimedia:', error);
              this.alertServiceService.customSearchError("Multimedia Not Found, Try Different Search");  // Show an error alert
              this.allMultimedia = [];  // No multimedia found, clear the list
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
          this.page = 1;              // Reset to page 1 whenever search changes
          this.postBySearchMultimediaData();    // Perform the search
          // this.cancel();
        }

        showMultimedia(){
          if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId ) {
            this.getMultimediaByFilterPost();
          } else {
            this.postBySearchMultimediaData();
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
              
              // Ensure the multimediaType is set to 'Multimedia' by default
              this.multimediaForm.patchValue({
                  multimediaType: 'Multimedia'
              });
              
          } else if (tab === 'view') {
              // Reset the filters when toggling to the 'View' tab
              this.boardId = '';
              this.mediumId = '';
              this.classId = '';
              this.subjectId = '';
              this.bookId = '';
              this.chapterId = '';
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
        this.getMultimediaByFilterPost();
    }
    

      }
