import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-todays-lesson',
  templateUrl: './todays-lesson.component.html',
  styleUrls: ['./todays-lesson.component.css']
})
export class TodaysLessonComponent {

  todaysLessonForm!: FormGroup;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

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
  allTypes!: any[];
  formType: string = "Save";
  videoPath: any = "";
  curriculumPath: any = "";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.todaysLessonForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllBoards();
    this.getAllMedium();
    this.getAllClasses();
    this.getAllStudios();
    this.getAllPlanVideos();
    this.getTypeofLesson();
  }

  initializeValidations() {
    this.todaysLessonForm = this.fb.group({
      board: new FormControl(null, [Validators.required]),
      medium: new FormControl(null, [Validators.required]),
      class: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      book: new FormControl(null, [Validators.required]),
      chapter: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      studioName: new FormControl(null, [Validators.required]),
      order: new FormControl(null, [Validators.required]),
      // liveStreamingPath: new FormControl(''),
      presenterName: new FormControl(null, [Validators.required]),
      id: [''],
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.todaysLessonForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.savePlanVideo();
    } else if (this.formType == "Update") {
      this.updatePlanVideo();
    }
  }

  savePlanVideo() {
    this.todaysLessonForm.removeControl('id');
    // this.todaysLessonForm.addControl('liveStreamingPath', new FormControl(this.videoPath ? this.videoPath : this.curriculumPath, Validators.required));
    this.httpService.post('todayplan', this.todaysLessonForm.value).subscribe((data: any) => {
      this.alertServiceService.success();
      this.cancel();
      this.getAllPlanVideos();
    })
  }

  updatePlanVideo() {
    this.httpService.patch('todayplan', this.todaysLessonForm.value).subscribe((data: any) => {
      this.alertServiceService.success();
      this.todaysLessonForm.reset();
      this.formType = "Save";
      this.getAllPlanVideos();
    })
  }

  checkRadio(path: any) {
    path == 'video' ? this.curriculumPath = '' : this.videoPath = '';
    this.todaysLessonForm.addControl('liveStreamingPath', new FormControl(this.videoPath ? this.videoPath : this.curriculumPath, Validators.required));
    // this.todaysLessonForm.controls.liveStreamingPath = this.videoPath ? this.videoPath : this.curriculumPath;
  }

  cancel() {
    this.todaysLessonForm.reset();
    this.curriculumPath = '';
    this.videoPath = '';
    this.submitted = false;
    this.formType = "Save";
  }

  getPlanVideoById(data: any) {
    this.httpService.getById('todayplan', data.id).subscribe((data: any) => {
      this.todaysLessonForm.addControl('id', new FormControl(''));
      this.todaysLessonForm.addControl('liveStreamingPath', new FormControl(''));
      this.todaysLessonForm.patchValue(data);
      this.formType = "Update";
      this.getByFilterSubjectData(true);
    })
  }

  deletePlanVideo(data: any) {
    this.httpService.delete('todayplan', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
    })
  }

  getAllPlanVideos() {
    this.httpService.get('todayplan?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data && data.results && data.results.length > 0) {
        this.allPlanVideos = data.results;
      }
    })
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

  getTypeofLesson(type: any = 'Multimedia') {
    this.httpService.get('multimedia/getByType/' + type).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allTypes = data;
      }
    })
  }

  getSubjetCommon() {
    let boardId = '';
    let mediumId = '';
    let classId = '';

    for (let i = 0; i < this.allBoards.length; i++) {
      if (this.todaysLessonForm.controls.board.value === this.allBoards[i].name) {
        boardId = this.allBoards[i].id;
      }
    }
    for (let i = 0; i < this.allMediums.length; i++) {
      if (this.todaysLessonForm.controls.medium.value === this.allMediums[i].name) {
        mediumId = this.allMediums[i].id;
      }
    }
    for (let i = 0; i < this.allClasses.length; i++) {
      if (this.todaysLessonForm.controls.class.value === this.allClasses[i].className) {
        classId = this.allClasses[i].id;
      }
    }
    return { boardId: boardId, mediumId: mediumId, classId: classId }
  }

  getByFilterSubjectData(forEdit: boolean) {
    const obj = this.getSubjetCommon()
    if (this.todaysLessonForm.value.medium && this.todaysLessonForm.value.class) {
      this.httpService.get(`subjects/filter/${obj.boardId}/${obj.mediumId}/${obj.classId}`)
        .subscribe((data: any) => {
          // this.todaysLessonForm.controls['subject'].reset()
          if (data.length > 0) {
            this.allSubjects = data;
            if (forEdit) {
              this.getBookBySubjectId({ target: { value: this.todaysLessonForm.value.subject } }, true);
            }
          }
          else {
            this.allSubjects = [];
          }
        });
    }
  }

  getBookBySubjectId(event: any, forEdit: boolean) {
    // const id = event.target ? event.target.value : event.subjectId
    let id = '';
    for (let i = 0; i < this.allSubjects.length; i++) {
      if (event.target.value == this.allSubjects[i].name) {
        id = this.allSubjects[i].id;
      }
    }
    this.httpService.getById('books/subject', id).subscribe((data: any) => {
      // this.todaysLessonForm.controls['book'].reset()
      this.allBooks = data;
      if (forEdit) {
        this.getChapterByBookId({ target: { value: this.todaysLessonForm.value.book } }, true);
      }
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  getChapterByBookId(event: any, forEdit: boolean) {
    if (event) {
      let id = '';
      for (let i = 0; i < this.allBooks.length; i++) {
        if (event.target.value == this.allBooks[i].name) {
          id = this.allBooks[i].id;
        }
      }
      this.httpService.getById('chapter/getChaptersByBookid', id).subscribe((data: any) => {
        // this.todaysLessonForm.controls['chapter'].reset()

        this.allChapters = data;
        if (forEdit) {
        }
      }, (error) => {
        this.alertServiceService.error();
      }
      )
    }
  };



  getAllStudios() {
    this.httpService.get('studio').subscribe((data: any) => {
      if (data && data.results && data.results.length > 0) {
        this.allStudios = data.results;
      }
    })
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllPlanVideos();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.getAllPlanVideos();
    }
  }

}
