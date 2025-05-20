import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChapterMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewChild, ElementRef } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-chapter-master',
  templateUrl: './chapter-master.component.html',
  styleUrls: ['./chapter-master.component.css'],
})
export class ChapterMasterComponent implements OnInit {
  ChapterForm: any = FormGroup;
  chapterMasterModel!: ChapterMasterClass;

  limit = 10;
  total: number = 0;
  page: number = 1;
  paginationConfig: any;
  searchBox: any;

  submitted: boolean = false;
  allChapter!: any[];
  ClassList!: any[];
  MediumList!: any[];
  BoardsList!: any[];
  SubjectList!: any[];
  BooksList!: any[];
  allSubjects: any[] = [];
  formType: string = 'Save';

  boardId = '';
  mediumId = '';
  classId = '';
  subjectId = '';
  bookId = '';
  allSubjectsForm: any;
  BooksListForm: any;
  isUpdateMode: boolean = false;  // Track if the form is in Update mode
  
  // File Upload Variables
  thumbnail: File | null = null;
  poster: File | null = null;
  thumbnailPreview: string | ArrayBuffer | null = null;
  posterPreview: string | ArrayBuffer | null = null;
  
  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
  @ViewChild('posterInput') posterInput!: ElementRef;
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
  
  mediaFileObjects: { [key: string]: File | null } = {};
  mediaPreviews: { [key: string]: string | ArrayBuffer | null } = {};
  previousMediaUrls: { [key: string]: string } = {}; // on patch update

  constructor(
    private fb: FormBuilder,
    private alertServiceService: AlertServiceService,
    private httpService: HttpServiceService
  ) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    // this.getAllChapters();
    // this.getAllBooks();
    // this.getAllSubject();
    this.ChapterForm.reset();
    this.chapterMasterModel = this.ChapterForm.value;
  }

  initializeValidations() {
    this.ChapterForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, Validators.required),
      classId: new FormControl(null, Validators.required),
      subjectId: new FormControl(null, Validators.required),
      bookId: new FormControl(null, Validators.required),
      chapterName: new FormControl(null, Validators.required),
      thumbnail: new FormControl(null), // Change to support File Upload
      poster: new FormControl(null), // Change to support File Upload
      order: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
      ]),
      id: [null],
      description: new FormControl(''), // Add description field

      // Ebook
      ebookIcon: new FormControl(null),
      ebookPoster: new FormControl(null),
      ebookDescription: new FormControl(''),

      // Quick Recap
      quickRecapIcon: new FormControl(null),
      quickRecapPoster: new FormControl(null),
      quickRecapDescription: new FormControl(''),

      // Book Questions Solutions
      bookQuestionSolutionsIcon: new FormControl(null),
      bookQuestionSolutionsPoster: new FormControl(null),
      bookQuestionSolutionsDescription: new FormControl(''),

      // Chapter Evaluation
      chapterEvaluationIcon: new FormControl(null),
      chapterEvaluationPoster: new FormControl(null),
      chapterEvaluationDescription: new FormControl('')
    });
  }

  get f() {
    return this.ChapterForm.controls;
  }

  saveFormReset() {
    this.submitted = false;
    this.ChapterForm.reset();
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.showAllChapter();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1
      this.showAllChapter();
    }
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'thumbnail') {
          this.thumbnail = file;
          this.thumbnailPreview = reader.result;
        } else if (controlName === 'poster') {
          this.poster = file;
          this.posterPreview = reader.result;
        } else {
          // Handle new dynamic media fields
          this.mediaFileObjects[controlName] = file;
          this.mediaPreviews[controlName] = reader.result;
          this.ChapterForm.patchValue({ [controlName]: file });
        }
      };
      reader.readAsDataURL(file);
    }
  }
  

onSave() {
  this.submitted = true;
  if (this.ChapterForm.invalid) return;

  const formData = new FormData();
  formData.append('boardId', this.ChapterForm.get('boardId')!.value);
  formData.append('mediumId', this.ChapterForm.get('mediumId')!.value);
  formData.append('classId', this.ChapterForm.get('classId')!.value);
  formData.append('subjectId', this.ChapterForm.get('subjectId')!.value);
  formData.append('bookId', this.ChapterForm.get('bookId')!.value);
  formData.append('chapterName', this.ChapterForm.get('chapterName')!.value);
  formData.append('order', this.ChapterForm.get('order')!.value);
  formData.append('description', this.ChapterForm.get('description')!.value || '');

  if (this.thumbnail) formData.append('thumbnail', this.thumbnail);
  if (this.poster) formData.append('poster', this.poster);

  if (this.formType === "Save") {
      this.saveChapter(formData);
  } else if (this.formType === "Update") {
      formData.append('id', this.ChapterForm.get('id')!.value);
      this.updateChapter(formData);
  }
}


saveChapter(formData: FormData) {

  const mediaFields = [
    'ebook', 'quickRecap', 'bookQuestionSolutions', 'chapterEvaluation'
  ];
  
  mediaFields.forEach(section => {
    const icon = this.mediaFileObjects[`${section}Icon`];
    const poster = this.mediaFileObjects[`${section}Poster`];
    const desc = this.ChapterForm.get(`${section}Description`)?.value;
  
    if (icon) formData.append(`${section}Icon`, icon);
    if (poster) formData.append(`${section}Poster`, poster);
    if (desc) formData.append(`${section}Description`, desc);
  });
  
  this.httpService.post('chapter', formData).subscribe(() => {
      this.cancelBtn();  // Ensure form resets properly after save
      this.alertServiceService.success();
      this.showAllChapter();
  }, () => {
      this.alertServiceService.error();
  });
}

updateChapter(formData: FormData) {
  const mediaSections = [
    'ebook',
    'quickRecap',
    'bookQuestionSolutions',
    'chapterEvaluation'
  ];

  mediaSections.forEach(section => {
    const icon = this.mediaFileObjects?.[`${section}Icon`];
    const poster = this.mediaFileObjects?.[`${section}Poster`];
    const desc = this.ChapterForm.get(`${section}Description`)?.value;

    if (icon) {
      formData.append(`${section}Icon`, icon);
    } else if (this.previousMediaUrls?.[`${section}Icon`]) {
      formData.append(`${section}IconUrl`, this.previousMediaUrls[`${section}Icon`]);
    }

    if (poster) {
      formData.append(`${section}Poster`, poster);
    } else if (this.previousMediaUrls?.[`${section}Poster`]) {
      formData.append(`${section}PosterUrl`, this.previousMediaUrls[`${section}Poster`]);
    }

    if (desc) {
      formData.append(`${section}Description`, desc);
    }
  });

  formData.append('id', this.ChapterForm.get('id')!.value);

  this.httpService.patch('chapter', formData).subscribe(() => {
    this.alertServiceService.update();
    this.showAllChapter();
    this.cancelBtn();
  }, () => {
    this.alertServiceService.error();
  });
}



  updateBooks() {   // method of Update chapter someone named wrong
    this.isUpdateMode = false;  // Reset to false after cancel or update
    this.httpService.patch('chapter', this.ChapterForm.value).subscribe((data: any) => {
      this.alertServiceService.update();
      this.formType = 'Save';
      this.submitted = false;
      this.showAllChapter();
      // this.getByFilter();
      this.ChapterForm.reset();
    });
  }

  onFileSelect(event: any) {
    const reader = new FileReader();
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.ChapterForm.patchValue({
        thumbnail: reader.result,
      });
    };
    this.chapterMasterModel.thumbnail = file;
    event.target.value = null;
  }

  // getByFilter() {
  //   this.httpService.get('chapter/filter/' + this.boardId + '/' + this.mediumId + '/' + this.classId + '/' + this.subjectId + '/' + this.bookId).subscribe((data: any) => {
  //     if (data.length > 0) {
  //       this.allChapter = data;
  //       console.log(this.allChapter);
  //     }
  //   })
  // }

  getByFilter() {
    if (
      this.boardId &&
      this.mediumId &&
      this.classId &&
      this.subjectId &&
      this.bookId
    ) {
      this.httpService
        .get(
          `chapter/filter/${this.boardId}/${this.mediumId}/${this.classId}/${this.subjectId}/${this.bookId}`
        )
        .subscribe((data: any) => {
          if (data.length > 0) {
            this.allChapter = data;
          }
        });
    }
  }

  async edit(id: any) {
    this.isUpdateMode = true;  // Set to true when in update mode
    if (id) {
      try {
        // First, get the chapter details using the id and wait for the result
        const chapterData: any = await this.httpService.get('chapter/' + id).toPromise();
        
        // Once the chapter data is retrieved, call getByFilterSubjectDataPatch
        await this.getByFilterSubjectDataPatch(chapterData.boardId, chapterData.mediumId, chapterData.classId);
        
        // After getByFilterSubjectDataPatch completes, call getBookBySubjectIdPatch
        await this.getBookBySubjectIdPatch(chapterData.subjectId);
        
        // After getBookBySubjectIdPatch completes, call onEditChapter
        this.onEditChapter(chapterData.id);
        
      } catch (error) {
        console.error('Error fetching chapter data', error);
        this.alertServiceService.error();
      }
    }
  }
  

  onEditChapter(id: any) {
    this.httpService.get('chapter/' + id).subscribe((data: any) => {
      if (data) {
        this.ChapterForm.patchValue({
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          bookId: data.bookId,
          chapterName: data.chapterName,
          order: data.order,
          description: data.description,
          id: data.id
        });
  
        // Patch and preview base thumbnails
        this.thumbnailPreview = data.thumbnail || null;
        this.posterPreview = data.poster || null;
  
        // List of additional media sections
        const mediaSections = [
          'ebook',
          'quickRecap',
          'bookQuestionSolutions',
          'chapterEvaluation'
        ];
  
        mediaSections.forEach(section => {
          this.ChapterForm.patchValue({
            [`${section}Description`]: data?.[section]?.description || ''
          });
  
          this.mediaPreviews[`${section}Icon`] = data?.[section]?.icon || null;
          this.mediaPreviews[`${section}Poster`] = data?.[section]?.poster || null;
  
          if (data?.[section]?.icon) {
            this.previousMediaUrls[`${section}Icon`] = data[section].icon;
          }
  
          if (data?.[section]?.poster) {
            this.previousMediaUrls[`${section}Poster`] = data[section].poster;
          }
  
          // Remove any previous files
          delete this.mediaFileObjects[`${section}Icon`];
          delete this.mediaFileObjects[`${section}Poster`];
        });
  
        this.formType = 'Update';
      }
    }, () => {
      this.alertServiceService.error();
    });
  }
  

  cancelBtn() {
    this.submitted = false;
    this.formType = 'Save';
    this.isUpdateMode = false;
  
    // Reset the form completely
    this.ChapterForm.reset();
    this.ChapterForm.markAsPristine();
    this.ChapterForm.markAsUntouched();
  
    // Clear thumbnail & poster previews and file values
    this.thumbnailPreview = null;
    this.posterPreview = null;
    this.thumbnail = null;
    this.poster = null;
  
    if (this.thumbnailInput) this.thumbnailInput.nativeElement.value = '';
    if (this.posterInput) this.posterInput.nativeElement.value = '';
  
    // Clear other media inputs, previews, and raw files
    const mediaSections = [
      'ebook',
      'quickRecap',
      'bookQuestionSolutions',
      'chapterEvaluation'
    ];
  
    mediaSections.forEach(section => {
      this.mediaPreviews[`${section}Icon`] = null;
      this.mediaPreviews[`${section}Poster`] = null;
  
      this.mediaFileObjects[`${section}Icon`] = null;
      this.mediaFileObjects[`${section}Poster`] = null;
  
      delete this.previousMediaUrls[`${section}Icon`];
      delete this.previousMediaUrls[`${section}Poster`];
    });
  
    // ✅ Clear all file inputs (icon/poster selectors)
    if (this.fileInputs && this.fileInputs.forEach) {
      this.fileInputs.forEach((input: ElementRef) => {
        input.nativeElement.value = '';
      });
    }
  }
  
  

  deleteSubject(id: any) {
    this.httpService.delete('chapter', id).subscribe(
      (data: any) => {
        this.alertServiceService.delete();
        this.showAllChapter();
      },
      (error) => {
        this.alertServiceService.error();
      }
    );
  }

  getAllClasses() {
    this.httpService
      .get('classes')
      .subscribe((data: any) => {
        if (data.results.length > 0) {
          this.ClassList = data.results;
        }
      });
  }

  getAllMedium() {
    this.httpService
      .get('medium')
      .subscribe((data: any) => {
        if (data.results.length > 0) {
          this.MediumList = data.results;
        }
      });
  }

  getAllBoards() {
    this.httpService
      .get('boards')
      .subscribe((data: any) => {
        if (data.results.length > 0) {
          this.BoardsList = data.results;
        }
      });
  }

  // getAllSubject() {
  //   this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
  //     if (data.results.length > 0) {
  //       this.SubjectList = data.results;
  //     }
  //   })
  // }

  // getAllBooks() {
  //   this.httpService
  //     .get('books?limit=' + this.limit + '&page=' + this.page)
  //     .subscribe((data: any) => {
  //       if (data.results.length > 0) {
  //         this.BooksList = data.results;
  //       }
  //     });
  // }

  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe(
        (data: any) => {
          this.ChapterForm.controls['bookId'].reset()
          this.BooksListForm = data;
          if (showForUpdate) {
            // this.getByFilterSubjectData(event)
          }
        },
        (error) => {
          this.alertServiceService.error();
        }
      );
    }
  }

  getBookBySubjectIdSelect(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe(
        (data: any) => {
          this.ChapterForm.controls['bookId'].reset()
          this.BooksList = data;
          if (showForUpdate) {
            // this.getByFilterSubjectData(event)
          }
        },
        (error) => {
          this.alertServiceService.error();
        }
      );
    }
  }

  getByFilterSubjectData() {
    if (
      this.ChapterForm.value.boardId &&
      this.ChapterForm.value.mediumId &&
      this.ChapterForm.value.classId
    ) {
      this.httpService
        .get(
          `subjects/filter/${this.ChapterForm.value.boardId}/${this.ChapterForm.value.mediumId}/${this.ChapterForm.value.classId}`
        )
        .subscribe((data: any) => {
          this.ChapterForm.controls['subjectId'].reset()
          if (data.length > 0) {
            this.allSubjectsForm = data;
          } else {
            this.allSubjectsForm = [];
          }
        });
    }
  }

  getByFilterSubjectDataSelect() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        // this.ChapterForm.controls['subjectId'].reset()
        if (data.length > 0) {
          this.allSubjects = data;
        }
        else {
          this.allSubjects = [];
        }
      });
  }

  getAllChapters(){
    this.httpService
    .get(`chapter`)
    .subscribe((data:any) =>{
      if(data.results.length > 0 ){
        this.allChapter = data.results
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total,
        }
      }
      else{
        this.allChapter = [];
      }
    })
  }

  showAllChapter(){
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId ) {
      this.postByFilterChapterData();
    } else {
      this.postBySearchData();
    }
  }

  go(){
    this.page = 1;
    this.searchBox="";
    this.postByFilterChapterData();
    // this.ChapterForm.reset();
    this.cancelBtn();
  }

  postByFilterChapterData() {
    const filterData = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      subjectId: this.subjectId,
      bookId: this.bookId,  // Include the bookId as per your request body
      limit: this.limit,
      page: this.page
    };
  
    this.httpService.post('chapter/getchapters/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allChapter = data.results;  // Assign the results to the chapters variable
          this.total = data.totalResults;   // Update total results
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allChapter = [];  // If no results are found, clear the chapters array
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Chapters Not Found");
        this.allChapter = [];  // Clear the chapters array on error
      }
    );
  }
  
  getByFilterSubjectDataPatch(boardId: string, mediumId: string, classId: string) {
    this.httpService
      .get(`subjects/filter/${boardId}/${mediumId}/${classId}`)
      .subscribe((subjects: any) => {
        // this.bookForm.controls['subjectId'].reset();  // Clear the subject dropdown before updating it
  
        if (subjects.length > 0 ) {
          
          this.allSubjectsForm = subjects;
          
        } else {
          this.allSubjectsForm = [];
        }
      });
  }

  getBookBySubjectIdPatch(id: any) {
    if (id) {
      this.httpService.getById('books/subject', id).subscribe(
        (data: any) => {
          // this.BooksListForm.controls['bookId'].reset();
          // this.BooksListForm.controls['bookId'].patchValue(data);  // Assuming 'bookId' is the field to patch
          this.BooksListForm = data;
        },
        (error) => {
          this.alertServiceService.error();
        }
      );
    }
  }
  
  postBySearchData() {
    if (!this.searchBox.trim()) {
      this.allChapter = [];
      // this.showAllChapter();
      return ;
    }
    const searchData = {
      search: this.searchBox,  // search term entered by the user
      limit: this.limit,       // items per page
      page : this.page,        // current page number
    };
  
    this.httpService.post('chapter/getchapters/filter', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allChapter = data.results;  // update subjects list
          this.total = data.totalResults;   // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allChapter = [];  // No subjects found, clear the list
        }
      },
      (error) => {
        console.error('Error fetching filtered Chapter:', error);
        this.alertServiceService.customSearchError("Chapter Not Found, Try Different Search");  // Show an error alert
        this.allChapter = [];  // No subjects found, clear the list
      }
    );
  }

  onSearchChange(){
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.subjectId='';
    this.bookId='';
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchData();    // Perform the search
    this.cancelBtn();
  }
}
