import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChapterMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent {
  mappingForm: any = FormGroup;
  chapterMasterModel!: ChapterMasterClass;

  limit = 0;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox!: string;

  submitted: boolean = false;
  allChapter!: any[];
  ClassList!: any[];
  MediumList!: any[];
  BoardsList!: any[];
  SubjectList: any[] = [];
  BooksList!: any[];
  allMappingList!: any[];
  formType: string = "Save";

  boardId: string = "board";
  mediumId: string = "medium";
  classId: string = "class";
  subjectId: string = "subject";
  bookId: string = "book";

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    // this.getAllBooks();
    // this.getAllSubject();
    this.getAllMapping();
    this.mappingForm.reset();
  }

  initializeValidations() {
    this.mappingForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, Validators.required),
      classId: new FormControl(null, Validators.required),
      subjectId: new FormControl(null, Validators.required),
      bookId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      id: [null]
    });
  }

  get f() { return this.mappingForm.controls; }

  // pageChangeEvent(pageNumber: number): void {
  //   this.page = pageNumber;
  //   this.getAllChapters();
  // }

  // selectPaginationSize(event: any) {
  //   if (event.target.value) {
  //     this.limit = event.target.value;
  //     this.getAllChapters();
  //   }
  // }

  onSave() {
    this.submitted = true;
    if (this.mappingForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveMapping();
    }
    else if (this.formType == "Update") {
      this.updateMapping();
    }
  }

  saveMapping() {
    this.chapterMasterModel = this.mappingForm.value;
    delete this.chapterMasterModel.id;
    this.httpService.post('mapping', this.chapterMasterModel).subscribe((data: any) => {
      this.alertServiceService.success();
      this.formType = "Save";
      this.submitted = false;
      this.mappingForm.reset();
      this.getAllMapping();
    })
  }

  updateMapping() {
    this.chapterMasterModel = this.mappingForm.value;
    this.httpService.patch('mapping', this.chapterMasterModel).subscribe((data: any) => {
      this.alertServiceService.success();
      this.formType = "Save";
      this.submitted = false;
      this.mappingForm.reset();
      this.getAllMapping();
    })
  }

  editMapping(data: any) {
    this.httpService.getById('mapping', data.id).subscribe((data: any) => {
      this.mappingForm.patchValue(data);
      this.formType = "Update";
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  deleteMapping(id: any) {
    this.httpService.delete('mapping', id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.getAllMapping();
    }, (error) => {
      this.alertServiceService.error();
    })
  }

  cancelBtn() {
    this.submitted = false;
    this.mappingForm.reset();
    this.formType = "Save"
  }

  getAllMapping() {
    this.httpService.get('mapping/getAllMaping').subscribe((data: any) => {
      if (data && data.results.length > 0) {
        this.allMappingList = data.results;
      }
    })
  }

  getAllClasses() {
    this.httpService.get('classes?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.ClassList = data.results;
      }
    })
  }

  getAllMedium() {
    this.httpService.get('medium?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.MediumList = data.results;
      }
    })
  }

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.BoardsList = data.results;
      }
    })
  }
 
  getByFilterSubjectData() {
    if (
      this.mappingForm.value.boardId &&
      this.mappingForm.value.mediumId &&
      this.mappingForm.value.classId
    ) {
      this.httpService
        .get(
          `subjects/filter/${this.mappingForm.value.boardId}/${this.mappingForm.value.mediumId}/${this.mappingForm.value.classId}`
        )
        .subscribe((data: any) => {
          this.mappingForm.controls['subjectId'].reset()
          if (data.length > 0) {
            this.SubjectList = data;
          }
          else {
            this.SubjectList = [];
          }
        });
    }
  }

  

  getBookBySubjectId(event: any) {
    if (event) {
      const id = event.target?.value ? event.target.value : event.subjectId;
      this.httpService.getById('books/subject', id).subscribe((data: any) => {
        this.mappingForm.controls['bookId'].reset()
        this.BooksList = data;
      }, (error) => {
        this.alertServiceService.error();
      })
    }
  };
}
