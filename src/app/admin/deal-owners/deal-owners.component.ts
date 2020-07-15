import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';


@Component({
  selector: 'app-deal-owners',
  templateUrl: './deal-owners.component.html',
  styleUrls: ['./deal-owners.component.css']
})
export class DealOwnersComponent extends MagicClasses implements OnInit {

  public allDealOwners: any[] = [];
  private tableName = 'Deal Owners';

  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'dealowner';
  }

  async ngOnInit() {
    await this.listUser();


  }


  public async listUser() {
    DealroomsRequestService.entity = 'dealowner';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allDealOwners = userResponse.data;
        if (this.allDealOwners.length > 0) {
          UI.run(this.allDealOwners, 'deal_owner_table', this.tableName);
        }

      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
  }

}
