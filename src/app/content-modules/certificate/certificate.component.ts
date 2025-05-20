import { Component, VERSION } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {

  name = "Angular " + VERSION.major;

  // Certificate holder
  Student_Name:string='Amol Rajput'
  School_Name:string='New High School'
  Today_Date= new Date
  Percentage:number=99

  public captureScreen() {
    var data:any = document.getElementById("contentToConvert");
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 190;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      var position = 25;
      pdf.addImage(contentDataURL, "PNG", 10, position, imgWidth, imgHeight);
      pdf.save("MYPdf.pdf"); // Generated PDF
    });
  }
}
