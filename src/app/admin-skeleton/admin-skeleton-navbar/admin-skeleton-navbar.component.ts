import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-skeleton-navbar',
  templateUrl: './admin-skeleton-navbar.component.html',
  styleUrls: ['./admin-skeleton-navbar.component.css']
})
export class AdminSkeletonNavbarComponent {

  toggleButton: boolean = false;
  searchOptions: any[] = [
    { name: "Board master", route: "/board" },
    { name: "Medium master", route: "/medium-master" },
    { name: "Class master", route: "/class-master" },
    { name: "Subject master", route: "/subject-master" },
    { name: "Book master", route: "/book-master" },
    { name: "Chapter master", route: "/chapter-master" },
    { name: "Videos", route: "/videos" },
    { name: "E-book", route: "/e-Book" },
    { name: "Quiz", route: "/quiz" },
    { name: "Quick recap", route: "/quick-recap" },
    { name: "Homework", route: "/homework" },
  ]
  searchValue!: any[];
  searchBox!: string;
  user: any;
  @Input() toggleSwitch: any;

  @Output()
  message: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, public translate: TranslateService) {
    this.user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
  }

  ngOnInit() {
    this.i18n()
  }

  toggleSwitchNavbar() {
    this.toggleButton = this.toggleButton ? false : true;
    this.message.emit(this.toggleButton);
  }

  ngAfterViewInit() {
    this.toggleButton;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.toggleSwitch?.currentValue) {
      this.toggleButton = changes.toggleSwitch.currentValue
    }
  }

  resetBox() {
    this.searchBox = ""
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/'])
  }

  i18n() {
    this.translate.addLangs(['English', 'Marathi']);
    this.translate.setDefaultLang('English');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/English|Marathi|/) ? browserLang : 'English');
  }

}
