import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Cache} from '../../../../utils/cache';
import * as UI from '../../../../shared/magic-methods/ui';
import {MagicClasses} from '../../../../shared/magic-methods/classes';

@Component({
  selector: 'app-run-finance',
  templateUrl: './run-finance.component.html',
  styleUrls: ['./run-finance.component.css']
})
export class RunFinanceComponent extends MagicClasses implements OnInit, OnChanges {

  @Input('inputData') inputData: any;
  public ownerDeals: any = [];
  public imageFileUrl: any;
  public blankLogo: boolean;
  public businessLogo: string;
  public user;
  public isOwner;
  public userType;
  public authUser: any;
  public userIsDealRunnerOrOwner: boolean;

  constructor() {
    super();

    this.authUser = Cache.get('AUTH_USER');
    this.user = this.authUser; // in case user profile is not auth user's
    this.userType = this.authUser['user_type'];
    this.userIsDealRunnerOrOwner = this.userType.includes('deal_');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (this.inputData && this.inputData.financier_runner_profile) {
      try {

        console.log('Input data', this.inputData)
        this.imageFileUrl = this.inputData['business_logo'] || this.imageFileUrl;
        this.blankLogo = !!this.inputData['business_logo'];

        this.user = this.inputData;
        this.ownerDeals = this.filterDealActivites(this.user['deals'] || []).reverse();
        if(this.ownerDeals.length > 0){
          UI.run(this.ownerDeals, 'runner_finance_deals', `${this.user.full_name}'s Deals`)

        }
        // deal_owner_deals


        console.log('Inner financier profile', this.user);
      } catch (e) {
        throw e;
      }
    }


  }

  public async toggleDeal(event, deal) {




  }
}
