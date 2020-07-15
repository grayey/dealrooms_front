import {Component, OnInit} from '@angular/core';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {Cache} from '../../../utils/cache';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent extends MagicClasses implements OnInit {

  public userType: any;
  public authUser: any;
  public slug: any;
  public user: any;
  public ownerDeals: any[] = [];

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
        if (this.user['user_type'] == 'financier') {
          this.listInvestorDeals(this.user['id']);
        }
        this.resetLoaderAndMessage();

      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));
      }
    )


  }

  private async listInvestorDeals(id) {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequsetService.listInvestorDeals(id).subscribe(
      (dealResponse) => {
        this.resetLoaderAndMessage();
        const allDeals = dealResponse.data;
        console.log('All deals Process', allDeals)
        const user = {...this.user};
        user['deals'] = this.filterDealActivites(allDeals).reverse();
        this.user = user;

        //console.log('Liste response', dealResponse);
      },
      (error) => {
        this.notification.error(this.processErrors(error));
        //console.log('An Error Occurred', error);
      }
    );
  }
}
