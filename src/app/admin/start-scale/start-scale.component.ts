import {Component, OnInit} from '@angular/core';
import {MagicClasses} from '../../../shared/magic-methods/classes';

@Component({
  selector: 'app-start-scale',
  templateUrl: './start-scale.component.html',
  styleUrls: ['./start-scale.component.css']
})
export class StartScaleComponent extends MagicClasses implements OnInit {

  public allCompanies: any[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
