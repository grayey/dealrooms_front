import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../services/notification.service';
import {TokenService} from '../../../../services/token.service';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {Cache} from '../../../../utils/cache';
import {MagicClasses} from '../../../../shared/magic-methods/classes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends MagicClasses implements OnInit {

  public userTasks: any[] = [];
  public allNotifications: any[] = [];
  public authUser: any;
  public userType:any;

  constructor(
    private _route: Router,
    private notification: NotificationService,
    private tokenService: TokenService,
    private requestService: DealroomsRequestService
  ) {
    super();
    if (!this.tokenService.getAuthUser()) {
      this.notification.error('Unauthenticated User. Please log in!');
      this._route.navigateByUrl('');
    }
    this.authUser = Cache.get('AUTH_USER');
    this.userType = this.authUser['user_type'];
  }

  ngOnInit() {
    this.setUserTasks();
    this.getUserNotifications();
    Cache.set('JUST_LOGGED_ON', null);
  }

  /**
   *
   * @param page
   * This method reroutes to the specified page
   */
  public reRoute(page) {
    const url = `dashboard${page}`;
    this._route.navigateByUrl(url);

  }


  public logUserOut() {
    DealroomsRequestService.entity = 'auth';
    this.requestService.logUserOut(this.tokenService.getAuthUser()).subscribe((logOutResponse) => {
      this.tokenService.logout();
      console.log('log out respinse', logOutResponse);
    }, (error) => {
      this.tokenService.logout();
      // this.notification.error('An error could not log out'); TRY this later
    });
  }

  private notificationHeadline(notification) {

    const headlines = {
      'create_user': {
        line: 'New User Profile',
        icon: 'dripicons-user',
        bg: 'bg-success'
      },
      'refund_user': {
        line: 'Credit Info',
        icon: 'dripicons-money',
        bg: 'bg-info'
      },
      'view_transaction': {
        line: 'New Transaction',
        icon: 'fa fa-money',
        bg: 'bg-secondary'
      }
    };
    return headlines[notification['type']];

  }

  private getUserNotifications() {
    const user = Cache.get('AUTH_USER');
    const userId = user ? user['id'] : 1;
    this.requestService.getUserNotifications(userId).subscribe(
      (allNotificationsResponse) => {
        const allNotifications = [];
        allNotificationsResponse.data.forEach((notification) => {
          notification['head'] = this.notificationHeadline(notification);
          allNotifications.push(notification);
        });
        this.allNotifications = allNotifications;
      },
      (error) => {
        console.log('Notification response error', error);
      }
    );
  }


}
