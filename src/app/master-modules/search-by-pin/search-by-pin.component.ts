import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-by-pin',
  templateUrl: './search-by-pin.component.html',
  styleUrls: ['./search-by-pin.component.css']
})
export class SearchByPinComponent {
  pincode:any=FormGroup;

  constructor(private http:HttpClient,private fb:FormBuilder){
    this.pincode = this.fb.group({
      Pin:['']
    });
  }

  SubmitForm(){
    console.log(this.pincode);
    this.GetbyPin(this.pincode.value.Pin);
  }
  PinCode:any;
  allData:any=[];
  GetbyPin(data:any){
    this.http.get('https://api.postalpincode.in/pincode/'+data).subscribe((res:any)=>{
      this.allData=res[0].PostOffice;
      console.log(this.allData);
      
    })
  }
}
