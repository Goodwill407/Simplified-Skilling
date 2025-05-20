import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-presentor-management',
  templateUrl: './presentor-management.component.html',
  styleUrls: ['./presentor-management.component.css']
})
export class PresentorManagementComponent {

  liveStreamingForm!: FormGroup;
  searchBox!: string;

  submitForm() {
  }

}
