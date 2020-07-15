import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public year;

  constructor() {
    const year = new Date().toDateString()
    this.year = year.split(' ')[3];
  }

  ngOnInit() {
  }

}
