import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Cache} from '../../../../utils/cache';
import {MagicClasses} from '../../../../shared/magic-methods/classes';
import * as UI from '../../../../shared/magic-methods/ui';
import Swal from "sweetalert2";


@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent extends MagicClasses implements OnInit, OnChanges {

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
    if (this.inputData && this.inputData.dealowner_profile) {
      try {

        console.log('Input data', this.inputData)
        this.imageFileUrl = this.inputData['business_logo'] || this.imageFileUrl;
        this.blankLogo = !!this.inputData['business_logo'];

        this.user = this.inputData;
        this.ownerDeals = this.filterDealActivites(this.user['deals'] || []).reverse();
        UI.run(this.ownerDeals, 'deal_owner_deals', `${this.user.full_name}'s Deals`)
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
