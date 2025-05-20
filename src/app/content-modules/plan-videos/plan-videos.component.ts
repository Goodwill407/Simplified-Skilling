import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-plan-videos',
  templateUrl: './plan-videos.component.html',
  styleUrls: ['./plan-videos.component.css']
})
export class PlanVideosComponent {

  @ViewChild('closebutton') closebutton: any;
  planVideoForm!: FormGroup;
  searchBox!: string;
  activeTab: string = 'create';

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchSubject: Subject<string> = new Subject<string>();
  submitted = false;
  allBoards!: any[];
  allMediums!: any[];
  allClasses!: any[];
  allSubjects!: any[];
  allBooks!: any[];
  allChapters!: any[];
  allLessons!: any[];
  allStudios!: any[];
  allPlanVideos!: any[];
  formType: string = "Save";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.planVideoForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getAllSubjects();
    this.getAllStudios();
    // this.getAllPlanVideos();

    this.searchSubject.pipe(debounceTime(500)).subscribe(() => {
      this.searchVideos();
  });
  }
//   onSearchChange() {
//     this.searchSubject.next(this.searchBox);
// }

  initializeValidations() {
    this.planVideoForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, [Validators.required]),
      classId: new FormControl(null, [Validators.required]),
      subjectId: new FormControl(null, [Validators.required]),
      bookId: new FormControl(null, [Validators.required]),
      chapterId: new FormControl(''),
      lessonId: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      studioName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      orderId: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
      ]),

      liveStreamingPath: new FormControl('', [Validators.required]),
      id: [''],
    });
  }

  submitForm() {
    this.submitted = true;
  
    // Ensure all fields are marked as touched before validation
    Object.keys(this.planVideoForm.controls).forEach(field => { 
      const control = this.planVideoForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  
    // If form is invalid, stop here
    if (this.planVideoForm.invalid) {
      return;
    }
  
    // Switch between Save and Update
    if (this.formType === "Save") {
      this.savePlanVideo();
    } else if (this.formType === "Update") {
      this.updatePlanVideo();
    }
  }

  savePlanVideo() {
    if (this.planVideoForm.contains('id')) {
      this.planVideoForm.removeControl('id'); // Remove id before saving
    }
  
    this.httpService.post('todayplan', this.planVideoForm.value).subscribe((data: any) => {
      this.alertServiceService.success();
      this.submitted = false; // Reset validation
      this.resetForm(); // Reset form after saving
      this.showPlanVideos();
    });
  }
  
  

  updatePlanVideo() {
    if (!this.planVideoForm.contains('id')) {
      this.planVideoForm.addControl('id', new FormControl(''));
    }
  
    this.httpService.patch('todayplan', this.planVideoForm.value).subscribe((data: any) => {
      this.alertServiceService.update();
      this.submitted = false; // Reset validation
      this.resetForm(); // Reset form after updating
      this.closebutton.nativeElement.click();
      this.showPlanVideos();
    });
  }


resetForm() {
  this.planVideoForm.reset(); // Clears all fields
  this.planVideoForm.controls['chapterId'].setValue('');
  this.planVideoForm.controls['lessonId'].setValue('');
  this.formType = "Save"; // Switch back to Add mode
  this.initializeValidations(); // Re-initialize form fields
  this.submitted = false; // Reset validation errors
}

  

  cancel() {
    this.initializeValidations();
    this.formType = "Save";
    this.submitted = false; // Reset validation errors
  }

  getPlanVideoById(data: any) {
    this.httpService.getById('todayplan', data.id).subscribe((resp: any) => {
      this.formType = 'Update';
  
      // 1) reset & ensure the id control is present
      this.planVideoForm.reset();
      if (this.planVideoForm.contains('id')) {
        this.planVideoForm.removeControl('id');
      }
      this.planVideoForm.addControl('id', new FormControl(resp.id));
  
      // 2) clear out old dropdown data
      this.allSubjects = [];
      this.allBooks    = [];
      this.allChapters = [];
      this.allLessons  = [];
  
      // 3) load everything in sequence, then patch all fields
      this.loadDropdownsForEdit(resp);
    });
  }
  
  loadDropdownsForEdit(resp: any) {
    // 1) Subjects
    this.httpService
      .get(`subjects/filter/${resp.boardId}/${resp.mediumId}/${resp.classId}`)
      .subscribe((subjects: any[]) => {
        this.allSubjects = subjects;
        this.planVideoForm.patchValue({
          boardId:   resp.boardId,
          mediumId:  resp.mediumId,
          classId:   resp.classId,
          subjectId: resp.subjectId
        });
  
        // 2) Books
        this.httpService
          .getById('books/subject', resp.subjectId)
          .subscribe((books: any[]) => {
            this.allBooks = books;
            this.planVideoForm.patchValue({ bookId: resp.bookId });
  
            // 3) Chapters (only if we have an ID)
            if (resp.chapterId) {
              this.httpService
                .getById('chapter/getChaptersByBookid', resp.bookId)
                .subscribe((chapters: any[]) => {
                  this.allChapters = chapters;
                  this.planVideoForm.patchValue({ chapterId: resp.chapterId });
  
                  // 4) Lessons (only if we have an ID)
                  if (resp.lessonId) {
                    this.httpService
                      .getById('lession/getallLession', resp.chapterId)
                      .subscribe((lessons: any[]) => {
                        this.allLessons = lessons;
                        this.planVideoForm.patchValue({ lessonId: resp.lessonId });
                        this.patchRemainingFields(resp);
                      });
                  } else {
                    // no lesson → clear list & patch other fields
                    this.allLessons = [];
                    this.patchRemainingFields(resp);
                  }
                });
            } else {
              // no chapter → clear both lists & patch other fields
              this.allChapters = [];
              this.allLessons  = [];
              this.patchRemainingFields(resp);
            }
          });
      });
  }
/** Patch everything except the IDs (which were handled above) */
private patchRemainingFields(resp: any) {
  this.planVideoForm.patchValue({
    name:               resp.name,
    date:               resp.date,
    time:               resp.time,
    type:               resp.type,
    studioName:         resp.studioName,
    liveStreamingPath:  resp.liveStreamingPath,
    orderId:            resp.orderId,
    description:        resp.description
  });
}  
  
  
getByFilterSubjectDataForEdit(boardId: string, mediumId: string, classId: string, subjectId: string) {
  if (boardId && mediumId && classId) {
    this.httpService.get(`subjects/filter/${boardId}/${mediumId}/${classId}`)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.allSubjects = data;
          // Set subject after fetching the list
          this.planVideoForm.controls['subjectId'].setValue(subjectId);
          this.getBookBySubjectId({ subjectId }, true);
        } else {
          this.allSubjects = [];
        }
      });
  }
}

  
deletePlanVideo(data: any) {
  this.httpService.delete('todayplan', data.id).subscribe((response: any) => {
    this.alertServiceService.delete();
    this.showPlanVideos(); // refresh the list after deletion
  }, (error) => {
    this.alertServiceService.error(); // handle error case
  });
}


  getAllPlanVideos() { // Pagination added only sk
    // Fetch data with pagination parameters
    this.httpService.get(`todayplan?limit=${this.limit}&page=${this.page}`).subscribe(
      (data: any) => {
        if (data && data.results && data.results.length > 0) {
          this.allPlanVideos = data.results; // Store video data
          this.total = data.totalResults; // Store total results for pagination
          // Set pagination config
          this.paginationConfig = {
            itemsPerPage: this.limit, // Items per page
            currentPage: this.page,   // Current page
            totalItems: this.total    // Total number of items (for pagination)
          };
        } else {
          this.allPlanVideos = []; // Clear videos if no data
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Plan Videos Not Found");
        this.allPlanVideos = []; // Clear videos in case of error
      }
    );
  }
  

  getAllBoards() {
    this.httpService.get('boards?limit=' + 0 + '&page=' + 0).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    });
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + 0 + '&page=' + 0).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    })
  }

  getAllClasses() {
    this.httpService.get('classes?limit=' + 0 + '&page=' + 0).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    })
  }

  getByFilterSubjectData() {
    if (this.planVideoForm.value.boardId && this.planVideoForm.value.mediumId && this.planVideoForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.planVideoForm.value.boardId}/${this.planVideoForm.value.mediumId}/${this.planVideoForm.value.classId}`)
        .subscribe((data: any) => {
          this.planVideoForm.controls['subjectId'].reset()
          this.planVideoForm.controls['bookId'].reset()
          this.planVideoForm.controls['chapterId'].setValue('');
          this.planVideoForm.controls['lessonId'].setValue('');
          
          
          if (data.length > 0) {
            this.allSubjects = data;
          }
          else {
            this.allSubjects = [];
          }
          
          this.allBooks = [];
          this.allChapters = [];
          this.allLessons = [];
        //   this.subjectId = '';
        //   this.bookId = '';
        //   this.chapterId = '';
        //   this.lessonId = '';
        });
    }
  }

  getBookBySubjectId(event: any, forEdit: boolean) {
    const subjectId = event.target ? event.target.value : event.subjectId; // Get correct subject ID
  
    this.httpService.getById('books/subject', subjectId).subscribe((data: any) => {
      this.allBooks = data; // Store fetched books
  
      if (forEdit) {
        // Ensure the selected book is retained after loading books
        this.planVideoForm.controls['bookId'].setValue(this.planVideoForm.value.bookId);
        
        // Fetch chapters after setting the book
        this.getChapterByBookId({ bookId: this.planVideoForm.value.bookId }, true);
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  
  

  getChapterByBookId(event: any, forEdit: boolean) {
    const bookId = event.target ? event.target.value : event.bookId; // Get correct book ID
  
    this.httpService.getById('chapter/getChaptersByBookid', bookId).subscribe((data: any) => {
      this.allChapters = data; // Store fetched chapters
  
      if (forEdit && this.planVideoForm.value.chapterId) {
        // Patch value only if chapter exists in dropdown
        const exists = data.some((ch: any) => ch.id === this.planVideoForm.value.chapterId);
        if (exists) {
          this.planVideoForm.controls['chapterId'].setValue(this.planVideoForm.value.chapterId);
          this.getLessonByChapterId({ chapterId: this.planVideoForm.value.chapterId });
        }
      }
      
    }, (error) => {
      this.alertServiceService.error();
    });
  };
  
  fetchLessons() {
    if (this.chapterId) {
      this.httpService.getById('lession/getallLession', this.chapterId).subscribe(
        (data: any) => {
          this.allLessons = data || [];
        },
        (error) => {
          console.error('Error fetching lessons:', error);
          this.alertServiceService.error();
        }
      );
    }
  }
  
  

  getLessonByChapterId(event: any) {
    const chapterId = event.target ? event.target.value : event.chapterId;
  
    this.httpService.getById('lession/getallLession', chapterId).subscribe((data: any) => {
      this.allLessons = data || [];
  
      // During edit, set lessonId only if exists
      if (this.planVideoForm.value.lessonId) {
        const exists = data.some((l: any) => l.id === this.planVideoForm.value.lessonId);
        if (exists) {
          this.planVideoForm.controls['lessonId'].setValue(this.planVideoForm.value.lessonId);
        }
      }
      
    }, (error) => {
      this.alertServiceService.error();
    });
  }
  
  

  getAllStudios() {
    this.httpService.get('studio').subscribe((data: any) => {
      if (data && data.results && data.results.length > 0) {
        this.allStudios = data.results;
      }
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.showPlanVideos();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.showPlanVideos();
    }
  }


  boardId = '';
mediumId = '';
classId = '';
subjectId = '';
bookId = '';
chapterId = '';
lessonId= '';

// applyFilter() {
//   const payload = {
//     boardId: this.boardId || undefined,
//     mediumId: this.mediumId || undefined,
//     classId: this.classId || undefined,
//     subjectId: this.subjectId || undefined,
//     bookId: this.bookId || undefined,
//     chapterId: this.chapterId || undefined,
//     search: this.searchBox ? this.searchBox.trim() : undefined, // Fix here
//     limit: this.limit,
//     page: this.page
//   };

//   this.httpService.post('todayplan/getplanvideo/filter', payload).subscribe(
//     (data: any) => {
//       console.log("Filter Response:", data); // Debugging Output
//       if (data.results.length > 0) {
//         this.allPlanVideos = data.results;
//          // Set pagination config
//          this.paginationConfig = {
//           itemsPerPage: this.limit, // Items per page
//           currentPage: this.page,   // Current page
//           totalItems: this.total    // Total number of items (for pagination)
//         };
//       } else {
//         this.allPlanVideos = [];
//         this.alertServiceService.customSearchError("No videos found for selected filters.");
//       }
//     },
//     (error) => {
//       console.error("Filter Error:", error); // Debugging Output
//       this.alertServiceService.error();
//     }
//   );
// }

applyFilter() {
  const filterData = {
    boardId: this.boardId || undefined,
    mediumId: this.mediumId || undefined,
    classId: this.classId || undefined,
    subjectId: this.subjectId || undefined,
    bookId: this.bookId || undefined,
    chapterId: this.chapterId || '',
    lessonId: this.lessonId || '',
    limit: this.limit,
    page: this.page
  };

  this.httpService.post('todayplan/getplanvideo/filter', filterData).subscribe(
    (data: any) => {
      if (data.results.length > 0) {
        this.allPlanVideos = data.results;    // Assign fetched videos
        this.total = data.totalResults;       // Correctly update total for pagination
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total
        };
      } else {
        this.allPlanVideos = [];              // Clear if no videos found
        this.alertServiceService.customSearchError("No videos found for selected filters.");
      }
    },
    (error) => {
      console.error('Error fetching filtered Plan Videos:', error);
      this.alertServiceService.customSearchError("An error occurred while fetching videos.");
      this.allPlanVideos = [];                // Clear array on error
    }
  );
}

fetchSubjects() {
  if (this.boardId && this.mediumId && this.classId) {
    this.httpService.get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        this.allSubjects = data.length > 0 ? data : [];
         // Reset dependent dropdowns to default
         this.subjectId = '';
         this.bookId = '';
         this.allBooks = [];
         this.chapterId = '';
         this.allChapters = [];
         this.lessonId = '';
         this.allLessons = [];
      });
  }
}
fetchBooks() {
  if (this.subjectId) {
    this.httpService.getById('books/subject', this.subjectId).subscribe((data: any) => {
      this.allBooks = data;
    });
  }
}
fetchChapters() {
  if (this.bookId) {
    this.httpService.getById('chapter/getChaptersByBookid', this.bookId).subscribe((data: any) => {
      this.allChapters = data;
    });
  }
}


searchVideos() {

  if (!this.searchBox.trim()) {
    this.allPlanVideos = [];
    return ;
  }
  const searchData = {
    search: this.searchBox.trim(),  // user-entered search term (trimmed)
    limit: this.limit,              // items per page
    page: this.page,                 
  };

  if (!searchData.search) {
    return; // Exit if search box is empty
  }

  this.httpService.post('todayplan/getplanvideo/filter', searchData).subscribe(
    (data: any) => {
      if (data.results.length > 0) {
        this.allPlanVideos = data.results;      // update plan videos array with results
        this.total = data.totalResults;         // update total count for pagination
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total,
        };
      } else {
        this.allPlanVideos = [];                // clear if no videos found
        this.alertServiceService.customSearchError("No videos found for this search.");
      }
    },
    (error) => {
      console.error('Error fetching Plan Videos:', error);
      this.alertServiceService.customSearchError("No videos found for this search.");
      this.allPlanVideos = [];                // clear if no videos found
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
  this.searchVideos();    // Perform the search
  // this.cancel();
}

showPlanVideos(){
  if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId ) {
    this.applyFilter();
  } else {
    this.searchVideos();
  }
}

setActiveTab(tab: string) {
  this.activeTab = tab;

  if (tab === 'create') {
      // Reset the form when toggling to the 'Create' tab
      this.allSubjects = [];
      this.allBooks = [];
      this.allChapters = [];
      this.allLessons = [];
      
      this.planVideoForm.reset();
      this.planVideoForm.controls['chapterId'].setValue('');
      this.planVideoForm.controls['lessonId'].setValue('');
      this.formType = 'Save';
      this.cancel();
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
      this.allBooks = [];
      this.allChapters = [];
      this.allLessons = [];
  }
}


go(){
  this.page = 1;
  this.searchBox = "";
  this.applyFilter();
}

}
