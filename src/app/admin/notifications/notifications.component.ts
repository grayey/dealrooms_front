import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {NotificationService} from '../../../services/notification.service';
import {Cache} from '../../../utils/cache';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent extends MagicClasses implements OnInit {

  public allNotifications: any[] = [];
  private tableName = 'all_notifications';

  constructor(
    private requestService: DealroomsRequestService,
    private notification: NotificationService
  ) {
    super();

  }

  ngOnInit() {
    this.getAllNotifications();
  }


  public async getAllNotifications() {
    const userId = Cache.get('AUTH_USER')['id'];
    this.resetLoaderAndMessage();
    await  this.requestService.getUserNotifications(userId, true).subscribe(
      (allNotificationsResponse) => {
        this.resetLoaderAndMessage();
        const allNotifications = [];
        allNotificationsResponse.data.forEach((notification) => {
          notification['head'] = this.notificationHeadline(notification);
          allNotifications.push(notification);
        });
        this.allNotifications = allNotifications;
        if (this.allNotifications.length > 0) {
          UI.run(this.allNotifications, this.tableName);
        }
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
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
        icon: 'dripicons-moneu',
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

}
