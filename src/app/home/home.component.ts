import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Cache} from '../../utils/cache';
import {DealroomsRequestService} from '../../services/apis/report.service';
import {TokenService} from '../../services/token.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public allDeals = [
    {
      name: 'Aiko Roth',
      sector: 'Agriculture',
      amount: 200000
    },
    {
      name: 'Avante Trade Expansion',
      sector: 'Advertising',
      amount: 345000
    },
    {
      name: 'LIT-Code',
      sector: 'Software & IT',
      amount: 5000000
    },
    {
      name: 'Kennis Records',
      sector: 'Music & Enter.',
      amount: 450000
    },
  ];
  public authUser;

  constructor(
    private route: Router,
    private requestService: DealroomsRequestService,
    private tokenService: TokenService,
  ) {

    this.authUser = Cache.get('AUTH_USER');

  }

  ngOnInit() {

  }



  public reRoute(url) {
    this.route.navigateByUrl(url);
  }

  public logUserOut() {
    DealroomsRequestService.entity = 'auth';
    this.requestService.logUserOut(this.tokenService.getAuthUser()).subscribe((logOutResponse) => {
      this.tokenService.logout();
      console.log('log out respinse', logOutResponse);
    }, (error) => {
      this.tokenService.logout();
      this.authUser = null;
      // this.notification.error('An error could not log out'); TRY this later
    });
  }

}
