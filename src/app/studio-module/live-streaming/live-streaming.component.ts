import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.css']
})
export class LiveStreamingComponent {

  searchBox!: string;
  liveStreamingForm!: FormGroup;

  formType: string = "Save";
  submitted = false;

  allLiveStreaming: any[] = [];

  constructor(private fb: FormBuilder, private alertServiceService: AlertServiceService, private httpService: HttpServiceService) { }
  get f() { return this.liveStreamingForm.controls; }

  ngOnInit() {
    this.initializeValidations();
    this.getAllLiveStreaming();
  }

  initializeValidations() {
    this.liveStreamingForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      banner: new FormControl(null, [Validators.required])
    })
  }

  submitForm() {
    this.submitted = true;
    if (this.liveStreamingForm.invalid) {
      return;
    }
    if (this.formType == "Save") {
      this.saveLiveStreaming();
    } else if (this.formType == "Update") {
      this.updateLiveStreaming();
    }
  }

  saveLiveStreaming() { }

  updateLiveStreaming() { }

  getAllLiveStreaming() {
    this.allLiveStreaming = [];
  }

  onFileSelect(event: any, fromEdit?: any) {
    const reader = new FileReader();
    let [file]: any = '';
    if (fromEdit) {
      [file] = event
    } else {
      [file] = event.target.files;
    }
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.liveStreamingForm.patchValue({
        banner: reader.result
      });
    }
  }
}
