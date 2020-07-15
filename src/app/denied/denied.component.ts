import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-denied',
  templateUrl: './denied.component.html',
  styleUrls: ['./denied.component.css']
})
export class DeniedComponent implements OnInit {

  constructor(
    private tokenService: TokenService
  ) {
  }

  ngOnInit() {
  }


  public relogin() {
    this.tokenService.logout();
  }
}
