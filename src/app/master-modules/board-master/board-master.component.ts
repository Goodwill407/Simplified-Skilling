import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { BoardMasterClass } from 'src/app/models/models';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-board-master',
  templateUrl: './board-master.component.html',
  styleUrls: ['./board-master.component.css']
})
export class BoardMasterComponent {

  boardForm!: FormGroup;
  boardMasterModel!: BoardMasterClass;
  boardArray!: FormArray;
  searchBox!: string;

  limit = 10;
  total: number = 0;
  page: number = 1
  paginationConfig: any;

  getAllData!: any[];
  formType: string = "Save";
  submitted: boolean = false;
  isUpdateMode: boolean = false;  // Track if the form is in Update mode

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) {
  }

  ngOnInit() {
    this.initializeSaveFormValidations();
    this.boardArray = this.boardForm.get('boardArray') as FormArray;
    this.getAllBoards();
    this.boardMasterModel = this.boardForm.value;
  }

  initializeSaveFormValidations() {
    this.boardForm = this.fb.group({
      name: ["", [Validators.required]],
      id: ['']
    });
  }


  pageChangeEvent(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllBoards();
  }

  selectPaginationSize(event: any) {
    if (event.target.value) {
      this.limit = event.target.value;
      this.page = 1;
      this.getAllBoards();
    }
  }

  get f() { return this.boardForm.controls; }

  submitForm() {
    this.submitted = true;
    if (this.boardForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveBoard();
    } else if (this.formType == "Update") {
      this.updateBoard();
    }
  }

  saveBoard() {
    this.boardMasterModel = this.boardForm.value;
    delete this.boardMasterModel.id; 
    this.httpService.post('boards', this.boardMasterModel).subscribe(allResult => {
        this.getAllBoards();
        this.alertServiceService.success();
        this.submitted = false;
        console.log(this.getAllData);
        this.cancelBoard();
      })
  }

  updateBoard() {
    this.boardMasterModel.name = this.boardForm.controls.name.value;
    this.httpService.patch('boards', this.boardMasterModel).subscribe((data: any) => {
      this.getAllBoards();
      this.alertServiceService.update();
      this.formType = "Save";
      this.submitted = false;
      this.cancelBoard();
    });
  }

  deleteBoard(data: any) {
    this.httpService.delete('boards', data.id).subscribe((data: any) => {
      this.getAllBoards();
      this.alertServiceService.delete();
    });
  }

  cancelBoard() {
    this.submitted = false;
    this.boardForm.reset();
    this.formType = "Save"
    this.isUpdateMode = false;  // Reset to false after cancel or update
  }

  getAllBoards() {
    this.httpService.get('boards?limit=' + this.limit + '&page=' + this.page).subscribe((data: any) => {
      if (data.results?.length > 0) {
        this.getAllData = data.results;
        this.total = data.totalResults;
        this.paginationConfig = {
          itemsPerPage: this.limit, currentPage: this.page, totalItems: this.total, directionLinks: false
        }
      }
    })
  }


  getBoardById(id: any) {
    this.httpService.get('boards/' + id).subscribe((data: any) => {
      if (data) {
        this.boardForm.patchValue({
          name:data.name
        })
        this.formType = "Update";
        this.boardMasterModel.id = id;
        this.isUpdateMode = true;  // Set to true when in update mode
      }
    })
  }

}
