import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lms';
  toggleButton: boolean | undefined;
  authentication: boolean = false;

  constructor(private router: Router) {
    // const user: any = JSON.parse(sessionStorage.getItem('userProfile')!);
    // this.authentication = user ? true : false;
    // if (!this.authentication) {
    //   this.router.navigate([''])
    // }
  }

  collideToggleSwitchEmit(message: boolean) {
    this.toggleButton = message
  }

  onMessageFromChild(message: boolean) {
    this.toggleButton = message
  }

  loginEventHander(event: any) {
    if (event) {
      this.authentication = true;
      // this.router.navigate(['/board'])
    }
  }
}
