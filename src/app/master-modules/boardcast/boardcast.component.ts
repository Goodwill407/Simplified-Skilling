import { Component , OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boardcast',
  templateUrl: './boardcast.component.html',
  styleUrls: ['./boardcast.component.css']
})
export class BoardcastComponent implements OnInit{
  videoTitle!: string;
  videoPath!: string;
  videoPlaying: boolean = false;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.fetchVideoDetails();
  }

  fetchVideoDetails() {
    const backendApiUrl = 'http://143.244.136.201:3001/v1/broadcast?limit=10&page=1';

    this.http.get<any>(backendApiUrl).subscribe((data) => {
      this.videoTitle = data.title;
      this.videoPath = data.path;
    });
  }
  playVideo() {
    this.videoPlaying = true;
  }
}
