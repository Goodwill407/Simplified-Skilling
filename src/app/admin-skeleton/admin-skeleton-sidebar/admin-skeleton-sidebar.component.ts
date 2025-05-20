import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-skeleton-sidebar',
  templateUrl: './admin-skeleton-sidebar.component.html',
  styleUrls: ['./admin-skeleton-sidebar.component.css']
})
export class AdminSkeletonSidebarComponent {
  @Input() toggleSwitch: any;
  @ViewChild('flushCollapseOne') flushCollapseOne: ElementRef | undefined;
  @ViewChild('flushCollapseTwo') flushCollapseTwo: ElementRef | undefined;
  @ViewChild('flushCollapseThree') flushCollapseThree: ElementRef | undefined;
  @ViewChild('flushCollapseFour') flushCollapseFour: ElementRef | undefined;
  @ViewChild('flushCollapseFive') flushCollapseFive: ElementRef | undefined;
  @ViewChild('flushCollapseSix') flushCollapseSix: ElementRef | undefined;

  @Output()
  collideToggleSwitch: EventEmitter<boolean> = new EventEmitter();

  role!: string;

  constructor() {
    const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
    this.role = user.role ? user.role : undefined;
  }

  collideToggleSwitchFnc() {
    this.collideToggleSwitch.emit(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.toggleSwitch.currentValue == false) {
      if (this.flushCollapseOne?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseOne?.nativeElement.click();
      }
      if (this.flushCollapseTwo?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseTwo?.nativeElement.click();
      }
      if (this.flushCollapseThree?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseThree?.nativeElement.click();
      }
      if (this.flushCollapseFour?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseFour?.nativeElement.click();
      }
      if (this.flushCollapseFive?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseFive?.nativeElement.click();
      }
      if (this.flushCollapseSix?.nativeElement.ariaExpanded == "true") {
        this.flushCollapseSix?.nativeElement.click();
      }
    }
  }
}
