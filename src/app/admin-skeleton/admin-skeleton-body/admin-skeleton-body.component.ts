import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-skeleton-body',
  templateUrl: './admin-skeleton-body.component.html',
  styleUrls: ['./admin-skeleton-body.component.css']
})
export class AdminSkeletonBodyComponent {

  @Input() body: any;

}
