import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'admin-skeleton',
  templateUrl: './admin-skeleton.component.html',
  styleUrls: ['./admin-skeleton.component.css']
})
export class AdminSkeletonComponent {

  status: boolean = true;
  statusLink: boolean = true;
  user!: any;

  constructor(private router: Router) {
    const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    this.user = user.role ? user : undefined;
  }


  ngOnInit() {
    const session = sessionStorage.getItem('userProfile');
    if (!session) {
      this.router.navigate(['']);
    }
  }

  clickEventTwice() {
    if (this.status) {
      this.clickEvent();
    }
  }

  clickEvent() {

    const allCollapseList: any = document.getElementsByClassName('multi-collapse');
    if (allCollapseList && allCollapseList.length > 0) {
      for (let i = 0; i < allCollapseList.length; i++) {
        allCollapseList[i].classList.remove('show');
      }
    }

    this.status = !this.status;
    if (this.statusLink) {
      setTimeout(() => {
        this.statusLink = false;
      }, 230);
    } else {
      this.statusLink = true;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}