import {Component, OnInit} from '@angular/core';
import {Cache} from '../../../utils/cache';
import {ActivatedRoute} from '@angular/router';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent extends MagicClasses implements OnInit {

  public authUser: any;
  public userType: any;
  public userId: any;
  public user: any;
  private slug: string;

  constructor(private activeRoute: ActivatedRoute, private dealroomsRequsetService: DealroomsRequestService,
              private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'user';
    this.authUser = Cache.get('AUTH_USER');
    this.userType = this.authUser['user_type'];
    this.activeRoute.params.subscribe((param) => {
      this.slug = param['slug'];
    });
  }


  ngOnInit() {
    this.getUserProfileBySlug(this.slug);

  }


  private async getUserProfileBySlug(slug: string) {
    this.resetLoaderAndMessage();
    await this.dealroomsRequsetService.list(slug).subscribe(
      (profileResponse) => {
        this.user = profileResponse.data;
        this.resetLoaderAndMessage();

      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));
      }
    )


  }

}
