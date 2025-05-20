import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BookMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-book-master',
  templateUrl: './book-master.component.html',
  styleUrls: ['./book-master.component.css']
})
export class BookMasterComponent implements OnInit {

  bookForm: any = FormGroup;
  BookMasterModule!: BookMasterClass;
  bookArray!: FormArray;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;
  searchBox : any;

  allClasses!: any[];
  allMediums!: any[];
  allBoards!: any[];
  allBooks!: any[];
  formType: string = "Save";
  submitted: boolean = false;
  allSubjects: any[] = [];
  checkSubjectId: any;

  boardId = '';
  mediumId = '';
  classId = '';
  subjectId = '';
  allSubjects1: any[] = [];
  isUpdateMode: boolean = false;  // Track if the form is in Update mode
  thumbnail: File | null = null;
   poster: File | null = null;
 
   @ViewChild('thumbnailInput') thumbnailInput!: ElementRef;
   @ViewChild('posterInput') posterInput!: ElementRef;
 
   thumbnailPreview: string | ArrayBuffer | null = null;
   posterPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.initializeValidations();
    this.getAllClasses();
    this.getAllMedium();
    this.getAllBoards();
    // this.getAllBooks();
    this.BookMasterModule = this.bookForm.value;
  }
  initializeValidations() {
    this.bookForm = this.fb.group({
      boardId: new FormControl(null, [Validators.required]),
      mediumId: new FormControl(null, [Validators.required]),
      classId: new FormControl(null, [Validators.required]),
      subjectId: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      thumbnail: new FormControl(null, []),  // Changed to accept File
      poster: new FormControl(null, []),     // Changed to accept File
      id: new FormControl(null),
      description: new FormControl(''), // Add description field
    })
  }
  get f() { return this.bookForm.controls; }


  onFileChange(event: any, fileType: 'thumbnail' | 'poster') {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            if (fileType === 'thumbnail') {
                this.thumbnailPreview = reader.result;
                this.thumbnail = file;
            } else if (fileType === 'poster') {
                this.posterPreview = reader.result;
                this.poster = file;
            }
        };
        reader.readAsDataURL(file);
    }
}


cancelBtn() {
  this.submitted = false;
  this.formType = 'Save';
  this.isUpdateMode = false;
  this.bookForm.reset();
  this.thumbnailPreview = null;
  this.posterPreview = null;
  this.thumbnail = null;
  this.poster = null;

  if (this.thumbnailInput) this.thumbnailInput.nativeElement.value = '';
  if (this.posterInput) this.posterInput.nativeElement.value = '';
}

  saveFormReset() {
    this.submitted = false
    this.bookForm.controls.name.reset();
    this.bookForm.controls.thumbnail.reset()
  }

  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.showAllBooks();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1;
      this.showAllBooks();
    }
  }

  onFileSelect(event: any) {
    const reader = new FileReader();
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.bookForm.patchValue({
        thumbnail: reader.result
      });
    }
    this.BookMasterModule.thumbnail = file;
    event.target.value = null;
  }

  // Api calls
  onSave() {
    this.submitted = true;
    if (this.bookForm.invalid) return;

    const formData = new FormData();
    formData.append('boardId', this.bookForm.get('boardId')!.value);
    formData.append('mediumId', this.bookForm.get('mediumId')!.value);
    formData.append('classId', this.bookForm.get('classId')!.value);
    formData.append('subjectId', this.bookForm.get('subjectId')!.value);
    formData.append('name', this.bookForm.get('name')!.value);
    formData.append('description', this.bookForm.get('description')!.value || '');

    if (this.thumbnail) formData.append('thumbnail', this.thumbnail);
    if (this.poster) formData.append('poster', this.poster);

    if (this.formType === "Save") {
        this.saveBooks(formData);
    } else if (this.formType === "Update") {
        formData.append('id', this.bookForm.get('id')!.value);
        this.updateBooks(formData);
    }
}


saveBooks(formData: FormData) {
  this.httpService.post('books/upload', formData).subscribe(
      () => {
        this.cancelBtn();
          this.alertServiceService.success();
          this.showAllBooks();
      },
      (error) => {
          this.alertServiceService.error();
          console.error("Error saving book:", error);
      }
  );
}



updateBooks(formData: FormData) {
    this.httpService.patch('books', formData).subscribe(() => {
      this.showAllBooks();
      this.cancelBtn();
      this.alertServiceService.update();
    }, () => {
        this.alertServiceService.error();
    });
}


  getAllBooks(){
    this.httpService.get('/books/upload?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBooks = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit,
          currentPage: this.page,
          totalItems: this.total
        };
      }else{
        this.allBooks = [];
      }
    }, error => {
      console.error('Error fetching Books:', error);
    });
  }

  // getting all data fro Board, Medium, Classes, Subject And Books :-
  getAllClasses() {
    this.httpService.get('classes').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allClasses = data.results;
      }
    })
  }

  getAllMedium() {
    this.httpService.get('medium').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allMediums = data.results;
      }
    })
  }

  getAllBoards() {
    this.httpService.get('boards').subscribe((data: any) => {
      if (data.results.length > 0) {
        this.allBoards = data.results;
      }
    })
  }

  deleteBookData(data: any) {
    this.httpService.delete('books', data.id).subscribe((data: any) => {
      this.alertServiceService.delete();
      this.showAllBooks()
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  // editBookData(data: any) {
  //   // this.bookForm.patchValue({
  //   //   boardId: data.boardId,
  //   //   mediumId: data.mediumId,
  //   //   classId: data.classId,
  //   //   subjectId: data.subjectId,
  //   //   name: data.name,
  //   //   poster: data.poster,
  //   //   thumbnail: data.thumbnail,      
  //   //   id: data.id,
  //   // });

  //   this.httpService.getById()
  //   this.formType = "Update";

  // }


  async edit(data: any) {
    this.isUpdateMode = true;  // Set to true when in update mode
    if (data) {
      try {
        // First, get the book details and wait for the result
        const bookData: any = await this.httpService.get('books/' + data.id).toPromise();
        
        // Once the book data is retrieved, call getByFilterSubjectDataPatch
        await this.getByFilterSubjectDataPatch(bookData.boardId, bookData.mediumId, bookData.classId);
        
        // After getByFilterSubjectDataPatch completes, call getLessonById
        this.getLessonById(bookData);
        
      } catch (error) {
        console.error('Error fetching book data', error);
        this.alertServiceService.error();
      }
    }
  }
  

  getLessonById(data: any) {
    this.httpService.get('books/' + data.id).subscribe((data: any) => {
      if (data) {
        //this.getByFilterSubjectData();
        // above method helps for patching data of subjects
        this.bookForm.patchValue({
          boardId: data.boardId,
          mediumId: data.mediumId,
          classId: data.classId,
          subjectId: data.subjectId,
          name: data.name,
          poster: data.poster,
          thumbnail: data.thumbnail,      
          id: data.id,
          description: data.description,
        })
        
        // this.getByFilterSubjectDataPatch(data.boardId, data.mediumId, data.classId);
        //   this.checkSubjectId = data.subjectId; // this will Check the subject from Table Dropdown
        //   console.log(this.subjectId, "subject id" );
        //   console.log(this.checkSubjectId, "checksubjectid" );
        
          // this.bookForm.patchValue({subjectId: data.subjectId,})
        this.formType = "Update";
      }
    }, (error) => {
      this.alertServiceService.error();
    });
  }

  getByFilterBookData() {
    this.httpService.get('books/filter/' + this.boardId + '/' + this.mediumId + '/' + this.classId + '/' + this.subjectId).subscribe((data: any) => {
      if (data.length > 0) {
        this.allBooks = data;
      }
      console.log(this.allBooks);

    })
  }

  getByFilterSubjectData() {
    if (this.bookForm.value.boardId && this.bookForm.value.mediumId && this.bookForm.value.classId) {
      this.httpService.get(`subjects/filter/${this.bookForm.value.boardId}/${this.bookForm.value.mediumId}/${this.bookForm.value.classId}`)
        .subscribe((data: any) => {
          this.bookForm.controls['subjectId'].reset()
          if (data.length > 0) {
            this.allSubjects1 = data;
          }
          else {
            this.allSubjects1 = [];
          }
        });
    }
  }

  getByFilterSubjectDataPatch(boardId: string, mediumId: string, classId: string) {
    this.httpService
      .get(`subjects/filter/${boardId}/${mediumId}/${classId}`)
      .subscribe((subjects: any) => {
        // this.bookForm.controls['subjectId'].reset();  // Clear the subject dropdown before updating it
  
        if (subjects.length > 0 ) {
          
          this.allSubjects1 = subjects;
          
        } else {
          this.allSubjects1 = [];
        }
      });
  }
  
  getByFilterSubjectDataSelect() {
    this.httpService
      .get(`subjects/filter/${this.boardId}/${this.mediumId}/${this.classId}`)
      .subscribe((data: any) => {
       // this.bookForm.controls['subjectId'].reset()
        if (data.length > 0) {
          this.allSubjects = data;
        }
        else {
          this.allSubjects = [];
        }
      });
  }

  showAllBooks(){
    if (this.boardId && this.mediumId && this.classId && this.subjectId) {
      this.postByFilterBooksData();
    } else {
      this.postBySearchData();
    }
  }

  go(){
    this.page = 1;
    this.searchBox = "";
    this.postByFilterBooksData();
    // this.bookForm.reset();
    // this.bookArray.clear();
    this.cancelBtn();
  }

  postByFilterBooksData() {
    const filterData = {
      boardId: this.boardId,
      mediumId: this.mediumId,
      classId: this.classId,
      subjectId: this.subjectId,
      limit: this.limit,  
      page: this.page     
    };
  
    this.httpService.post('books/getbooks/filter', filterData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allBooks = data.results;
          this.total = data.totalResults;
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          }
        } else {
          this.allBooks = [];
        }
      },
      (error) => {
        // Handle error
        this.alertServiceService.customSearchError("Books Not Found");
        this.allBooks = [];
      }
    );
  }

  postBySearchData() {
    if (!this.searchBox.trim()) {
      this.allBooks = [];
      // this.showAllBooks();
      return ;
    }
    const searchData = {
      search: this.searchBox,  // search term entered by the user
      limit: this.limit,       // items per page
      page : this.page,          // current page number
    };
  
    this.httpService.post('books/getbooks/filter', searchData).subscribe(
      (data: any) => {
        if (data.results.length > 0) {
          this.allBooks = data.results;  // update subjects list
          this.total = data.totalResults;   // update total count for pagination
          this.paginationConfig = {
            itemsPerPage: this.limit,
            currentPage: this.page,
            totalItems: this.total,
          };
        } else {
          this.allBooks = [];  // No subjects found, clear the list
        }
      },
      (error) => {
        console.error('Error fetching filtered Book:', error);
        this.alertServiceService.customSearchError("Book Not Found, Try Different Search");  // Show an error alert
        this.allBooks = [];  // No subjects found, clear the list
      }
    );
  }

  onSearchChange() {
    this.boardId='';
    this.classId='';
    this.mediumId='';
    this.subjectId='';
    this.page = 1;              // Reset to page 1 whenever search changes
    this.postBySearchData();    // Perform the search
    this.cancelBtn();
  }
}
