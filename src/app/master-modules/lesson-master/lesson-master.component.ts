import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LessonMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewChild, ElementRef } from '@angular/core';
import { ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-lesson-master',
  templateUrl: './lesson-master.component.html',
  styleUrls: ['./lesson-master.component.css']
})

export class LessonMasterComponent implements OnInit {

  lessonForm: any = FormGroup;
  lessonMasterModel!: LessonMasterClass;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  showTable: boolean = false;
  submitted = false;
  BoardsList!: any[];
  getAllData!: any[];
  allClasses!: any[];
  allMediums!: any[];
  allChapters!: any[];
  allBoards!: any[];
  allSubjects!: any[];
  allbooks!: any[];
  allLessons!: any[];
  MediumList!: any[];
  SubjectList!: any[];
  ClassList!: any[];
  BooksList!: any[];
  ChapterList!: any[];
  formType: string = "Save";

  boardId = '';
  mediumId = '';
  classId = '';
  subjectId = '';
  bookId = '';
  chapterId = '';
  allSubjectsForm: any;
  allbooksForm: any;
  allChaptersForm: any;
  isUpdateMode: boolean = false;  // Track if the form is in Update mode

  // File Upload Variables
  thumbnail: File | null = null;
  poster: File | null = null;
  thumbnailPreview: string | ArrayBuffer | null = null;
  posterPreview: string | ArrayBuffer | null = null;

  mediaFileObjects: { [key: string]: File | null } = {};  // store files by controlName
  mediaPreviews: { [key: string]: string | ArrayBuffer | null } = {};

  previousMediaUrls: { [key: string]: string } = {}; // on patch update

  @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
  @ViewChild('posterInput') posterInput!: ElementRef;
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.lessonForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    // this.getLessonsData();
    // this.getAllSubjects();
    this.lessonMasterModel = this.lessonForm.value;
  }

  initializeValidations() {
    this.lessonForm = new FormGroup({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, Validators.required),
      classId: new FormControl(null, Validators.required),
      subjectId: new FormControl(null, Validators.required),
      bookId: new FormControl(null, Validators.required),
      chapterId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      thumbnail: new FormControl(null),
      order: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/) // Regex to accept integers >= 1
      ]),
      poster: new FormControl(null),
      id: new FormControl(''),
      type: new FormControl('https://www.youtube.com/watch?v=D52_BL9sVMU'),
      description: new FormControl(''), // Add description field

      videoLecturesIcon: new FormControl(null),
      videoLecturesPoster: new FormControl(null),
      videoLecturesDescription: new FormControl(''),

      // multimediaVideosIcon: new FormControl(null),
      // multimediaVideosPoster: new FormControl(null),
      // multimediaVideosDescription: new FormControl(''),

      selfEvaluationIcon: new FormControl(null),
      selfEvaluationPoster: new FormControl(null),
      selfEvaluationDescription: new FormControl(''),

      practiceTestIcon: new FormControl(null),
      practiceTestPoster: new FormControl(null),
      practiceTestDescription: new FormControl(''),

      caseStudyIcon: new FormControl(null),
      caseStudyPoster: new FormControl(null),
      caseStudyDescription: new FormControl(''),

      quickRecapIcon: new FormControl(null),
      quickRecapPoster: new FormControl(null),
      quickRecapDescription: new FormControl(''),

      questionAndAnswersIcon: new FormControl(null),
      questionAndAnswersPoster: new FormControl(null),
      questionAndAnswersDescription: new FormControl('')

    });
  };

  mediaPreview: any = {
    videoLecturesIcon: null,
    videoLecturesPoster: null,
    // multimediaVideosIcon: null,
    // multimediaVideosPoster: null,
    selfEvaluationIcon: null,
    selfEvaluationPoster: null,
    practiceTestIcon: null,
    practiceTestPoster: null,
    caseStudyIcon: null,
    caseStudyPoster: null,
    quickRecapIcon: null,
    quickRecapPoster: null,
    questionAndAnswersIcon: null,
    questionAndAnswersPoster: null,
  };

  getAllBoards() {
    this.httpService.get('boards').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  getAllMedium() {
    this.httpService.get('medium').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  getAllClasses() {
    this.httpService.get('classes').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  onFileChange(event: any, controlName: string) {
    const file = event.target.files[0];
    if (!file) return;

    this.lessonForm.patchValue({ [controlName]: file });

    const reader = new FileReader();
    reader.onload = () => {
      if (controlName === 'thumbnail') {
        this.thumbnail = file;
        this.thumbnailPreview = reader.result;
      } else if (controlName === 'poster') {
        this.poster = file;
        this.posterPreview = reader.result;
      } else {
        this.mediaFileObjects[controlName] = file;
        this.mediaPreviews[controlName] = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }


  // getAllSubjects() {
  //   this.httpService.get('subjects?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
  //     if (data.results.length > 0) {
  //       this.allSubjects = data.results;
  //     }
  //   }, (error) => {
  //     this.alertServiceService.error();
  //   });
  // }

  cancel() {
    this.submitted = false;
    this.isUpdateMode = false;
    this.formType = "Save";
    this.lessonForm.reset();

    // Clear main preview and files
    this.thumbnailPreview = null;
    this.posterPreview = null;
    this.thumbnail = null;
    this.poster = null;

    // Reset input fields if ViewChilds are available
    if (this.thumbnailInput) this.thumbnailInput.nativeElement.value = '';
    if (this.posterInput) this.posterInput.nativeElement.value = '';

    this.fileInputs.forEach((input: ElementRef) => {
      const controlName = input.nativeElement.name;
      input.nativeElement.value = '';  // clear file input
      if (controlName) {
        this.lessonForm.patchValue({ [controlName]: null });
        this.mediaPreviews[controlName] = null;        // fix here
        this.mediaFileObjects[controlName] = null;
      }
    });


    // Clear all media previews and file objects
    const mediaFields = [
      'videoLectures',  'selfEvaluation',  //'multimediaVideos',
      'practiceTest', 'caseStudy', 'quickRecap', 'questionAndAnswers'
    ];

    mediaFields.forEach(section => {
      this.mediaPreview[`${section}Icon`] = null;
      this.mediaPreview[`${section}Poster`] = null;
      this.mediaFileObjects[`${section}Icon`] = null;
      this.mediaFileObjects[`${section}Poster`] = null;
    });
  }



  getByFilter() {
    this.httpService.get('lession/filter/' + this.boardId + '/' + this.mediumId + '/' + this.classId + '/' + this.subjectId + '/' + this.bookId + '/' + this.chapterId).subscribe((data: any) => {
      if (data.length > 0) {
        this.allLessons = data;
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }


  // onFileSelect1(event: any) {
  //   const reader = new FileReader();
  //   const [file] = event.target.files;
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     this.lessonForm.patchValue({
  //       thumbnail: reader.result
  //     });
  //   }
  //   this.lessonMasterModel.thumbnail = file;
  //   event.target.value = null;
  // }


  // onFileSelect2(event: any) {
  //   const reader = new FileReader();
  //   const [file] = event.target.files;
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     this.lessonForm.patchValue({
  //       poster: reader.result
  //     });
  //   }
  //   this.lessonMasterModel.poster = file;
  //   event.target.value = null;
  // }

  submitForm() {
    this.submitted = true;
    if (this.lessonForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('boardId', this.lessonForm.get('boardId')!.value);
    formData.append('mediumId', this.lessonForm.get('mediumId')!.value);
    formData.append('classId', this.lessonForm.get('classId')!.value);
    formData.append('subjectId', this.lessonForm.get('subjectId')!.value);
    formData.append('bookId', this.lessonForm.get('bookId')!.value);
    formData.append('chapterId', this.lessonForm.get('chapterId')!.value);
    formData.append('name', this.lessonForm.get('name')!.value);
    formData.append('description', this.lessonForm.get('description')!.value || '');
    formData.append('order', this.lessonForm.get('order')!.value);

    if (this.thumbnail) formData.append('thumbnail', this.thumbnail);
    if (this.poster) formData.append('poster', this.poster);
    if (this.formType === "Save") {
      this.saveLesson(formData);
    } else if (this.formType === "Update") {
      formData.append('id', this.lessonForm.get('id')!.value);
      this.updateLesson(formData);
    }

  }

  saveLesson(formData: FormData) {

    const mediaFields = [
      'videoLectures',  'selfEvaluation',  // 'multimediaVideos',
      'practiceTest', 'caseStudy', 'quickRecap', 'questionAndAnswers'
    ];

    mediaFields.forEach(section => {
      const icon = this.mediaFileObjects[`${section}Icon`];
      const poster = this.mediaFileObjects[`${section}Poster`];
      const desc = this.lessonForm.get(`${section}Description`)?.value;

      if (icon) formData.append(`${section}Icon`, icon);
      if (poster) formData.append(`${section}Poster`, poster);
      if (desc) formData.append(`${section}Description`, desc);
    });

    this.httpService.post('lession', formData).subscribe(() => {
      this.cancel();
      this.alertServiceService.success();
      this.showAllLessons();
    }, () => {
      this.alertServiceService.error();
    });
  }

  updateLesson(formData: FormData) {

    const mediaFields = [
      'videoLectures',  'selfEvaluation',   // 'multimediaVideos',
      'practiceTest', 'caseStudy', 'quickRecap', 'questionAndAnswers'
    ];

    mediaFields.forEach(section => {
      const icon = this.mediaFileObjects[`${section}Icon`];
      const poster = this.mediaFileObjects[`${section}Poster`];
      const desc = this.lessonForm.get(`${section}Description`)?.value;

      if (icon) {
        formData.append(`${section}Icon`, icon);
      } else if (this.previousMediaUrls[`${section}Icon`]) {
        formData.append(`${section}IconUrl`, this.previousMediaUrls[`${section}Icon`]);
      }

      if (poster) {
        formData.append(`${section}Poster`, poster);
      } else if (this.previousMediaUrls[`${section}Poster`]) {
        formData.append(`${section}PosterUrl`, this.previousMediaUrls[`${section}Poster`]);
      }

      if (desc) formData.append(`${section}Description`, desc);
    });

    this.httpService.patch('lession', formData).subscribe(() => {
      this.alertServiceService.update();
      this.showAllLessons();
      this.cancel();
    }, () => {
      this.alertServiceService.error();
    });
  }


  forAppendData() {
    const appendData = new FormData();
    appendData.append('name', this.lessonMasterModel.name);
    appendData.append('thumbnail', this.lessonMasterModel.thumbnail);
    appendData.append('poster', this.lessonMasterModel.poster);
    appendData.append('order', this.lessonMasterModel.order);
    appendData.append('boardId', this.lessonMasterModel.boardId);
    appendData.append('mediumId', this.lessonMasterModel.mediumId);
    appendData.append('classId', this.lessonMasterModel.classId);
    appendData.append('subjectId', this.lessonMasterModel.subjectId);
    appendData.append('bookId', this.lessonMasterModel.bookId);
    appendData.append('chapterId', this.lessonMasterModel.chapterId);
    appendData.append('type', this.lessonMasterModel.type);
    appendData.append('description', this.lessonMasterModel.description);
    if (this.formType == 'Update') {
      appendData.append('id', this.lessonMasterModel.id)
    }
    return appendData;
  }

  resetData() {
    this.lessonForm.reset();
    // this.lessonForm.patchValue({
    //   name: null,
    //   thumbnail: null,
    //   order: null,
    //   poster: null,
    // })
  }
  getBookBySubjectId(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.lessonForm.controls['bookId'].reset()
        this.allbooksForm = data;
        if (showForUpdate) {
          this.getChapterByBookId(event)
        }
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  };

  getBookBySubjectIdSelect(event: any, showForUpdate: boolean) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.lessonForm.controls['bookId'].reset()
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
        // this.lessonForm.controls['chapterId'].reset()
        this.allChaptersForm = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };

  getChapterByBookIdSelect(event: any) {
    if (event) {
      const id = event.target?.value ? event.target?.value : event.bookId;
      this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
        this.lessonForm.controls['chapterId'].reset()
        this.allChapters = data;
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };

  getLessonById(id: any) {
    this.httpService.get('lession/' + id).subscribe((data: any) => {
      if (data) {
        // Patch core lesson fields
        this.lessonForm.patchValue({
          name: data.name,
          thumbnail: data.thumbnail,
          poster: data.poster,
          order: data.order,
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          bookId: data.bookId,
          chapterId: data.chapterId,
          type: data.type,
          id: data.id,
          description: data.description,
        });

        // Patch dynamic media fields
        const mediaFields = [
          'videoLectures',  'selfEvaluation',   // 'multimediaVideos',
          'practiceTest', 'caseStudy', 'quickRecap', 'questionAndAnswers'
        ];

        mediaFields.forEach(section => {
          this.lessonForm.patchValue({
            [`${section}Icon`]: null,
            [`${section}Poster`]: null,
            [`${section}Description`]: data[section]?.description || ''
          });

          this.previousMediaUrls[`${section}Icon`] = data[section]?.icon || '';
          this.previousMediaUrls[`${section}Poster`] = data[section]?.poster || '';

          this.mediaPreviews[`${section}Icon`] = data[section]?.icon || null;
          this.mediaPreviews[`${section}Poster`] = data[section]?.poster || null;

          delete this.mediaFileObjects[`${section}Icon`];
          delete this.mediaFileObjects[`${section}Poster`];
        });

        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  deleteLesson(id: any) {
    this.httpService.delete('lession', id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.showAllLessons();
      this.lessonForm.reset();
      // this.getByFilter();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getByFilterSubjectData() {
    if (this.lessonForm.value.boardId && this.lessonForm.value.mediumId && this.lessonForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.lessonForm.value.boardId}/${this.lessonForm.value.mediumId}/${this.lessonForm.value.classId}`)
        .subscribe((data: any) => {
          this.lessonForm.controls['subjectId'].reset()
          if (data.length > 0) {
            this.allSubjectsForm = data;
            console.log(this.allSubjects)
          }
          else {
            this.allSubjectsForm = [];
          }
        });
    }
  }

  getByFilterSubjectDataPatch(boardId: string, mediumId: string, classId: string) {
    if (boardId && mediumId && classId) {
      this.httpService.get(`subjects/filter/${boardId}/${mediumId}/${classId}`)
        .subscribe((data: any) => {
          this.lessonForm.controls['subjectId'].reset();
          if (data.length > 0) {
            this.allSubjectsForm = data;
            console.log(this.allSubjectsForm);
          } else {
            this.allSubjectsForm = [];
          }
        }, (error) => {
          console.error('Error fetching subjects:', error);
          this.alertServiceService.error();
        });
    } else {
      console.error('Invalid parameters provided');
      this.alertServiceService.error();
    }
  }

  getByFilterSubjectDataSelect() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
        this.lessonForm.controls['subjectId'].reset()
        if (data.length > 0) {
          this.allSubjects = data;
        }
        else {
          this.allSubjects = [];
        }
      });
  }


  getLessonsData() {
    this.httpService.get('/lession').subscribe(
      (data: any) => {
        if (data.results && data.results.length > 0) {
          this.allLessons = data.results;
          this.total = data.totalResults;
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total
          };
        } else {
          this.allLessons = [];
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Lessons Not Found");
        this.allLessons = [];
      }
    );
  }


  postByFilterLessonsData() {
    const filterData = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      subjectId: this.subjectId,
      bookId: this.bookId,
      chapterId: this.chapterId,
      limit: this.limit,
      page: this.page
    };

    this.httpService.post('lession/getlessons/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allLessons = data.results;
          this.total = data.totalResults;
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total
          };
        } else {
          this.allLessons = [];
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Lessons Not Found");
        this.allLessons = [];
      }
    );
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1;
      this.showAllLessons();
      // this.lessonForm.reset();
    }
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.showAllLessons();
    // this.lessonForm.reset();
  }

  postBySearchData() {
    if (!this.searchBox.trim()) {
      this.allLessons = [];
      // this.showAllLessons();
      return;
    }
    const searchData = {
      search: this.searchBox,  // search term entered by the user
      limit: this.limit,       // items per page
      page: this.page,          // current page number
    };

    this.httpService.post('lession/getlessons/filter', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allLessons = data.results;  // update subjects list
          this.total = data.totalResults;   // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allLessons = [];  // No subjects found, clear the list
        }
      },
      (error) => {
        console.error('Error fetching filtered Lessons:', error);
        this.alertServiceService.customSearchError("Lesson Not Found, Try Different Search");  // Show an error alert
        this.allLessons = [];  // No subjects found, clear the list
      }
    );
  }

  go() {
    this.page = 1;
    this.searchBox = "";
    this.postByFilterLessonsData();
    // this.lessonForm.reset();
    this.cancel();
  }

  showAllLessons() {
    if (this.boardId && this.mediumId && this.classId && this.subjectId && this.bookId && this.chapterId) {
      this.postByFilterLessonsData();
    } else {
      this.postBySearchData();
    }
  }


  async editLesson(id: any) {
    this.isUpdateMode = true;  // Set to true when in update mode
    if (id) {
      try {
        // First, get the lesson details using the id
        const lessonData: any = await this.httpService.get('lession/' + id).toPromise();

        // Call getByFilterSubjectData (fetching subjects based on the form's boardId, mediumId, and classId)
        await this.getByFilterSubjectDataPatch(lessonData.boardId, lessonData.mediumId, lessonData.classId);

        // Call getBookBySubjectId with the event data and showForUpdate as false
        await this.getBookBySubjectId({ subjectId: lessonData.subjectId }, false);

        // Call getChapterByBookId with the lessonData (fetching chapters by bookId)
        await this.getChapterByBookId({ bookId: lessonData.bookId });

        // Finally, call getLessonById to patch the lesson data
        this.getLessonById(lessonData.id);

      } catch (error) {
        console.error('Error fetching lesson data', error);
        this.alertServiceService.error();
      }
    }
  }

  onSearchChange() {
    this.boardId = '';
    this.classId = '';
    this.mediumId = '';
    this.subjectId = '';
    this.bookId = '';
    this.chapterId = '';
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchData();    // Perform the search
    this.cancel();
  }
}
