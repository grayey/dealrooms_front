import {Component, Input, OnInit} from '@angular/core';
import {Cache} from '../../../../utils/cache';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {TokenService} from '../../../../services/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-front-header',
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.css']
})
export class FrontHeaderComponent implements OnInit {


  @Input('headerClass') headerClass: string;

  public authUser: any;

  constructor(private route: Router,
              private requestService: DealroomsRequestService,
              private tokenService: TokenService) {
    this.authUser = Cache.get('AUTH_USER');
  }


  ngOnInit() {
  }

  public reRoute(url) {
    this.route.navigateByUrl(url);
  }

  public logUserOut(home) {
    DealroomsRequestService.entity = 'auth';
    this.requestService.logUserOut(this.tokenService.getAuthUser()).subscribe((logOutResponse) => {
      this.tokenService.logout(home);
      console.log('log out respinse', logOutResponse);
    }, (error) => {
      this.tokenService.logout();
      this.authUser = null;
      // this.notification.error('An error could not log out'); TRY this later
    });
  }


}
