import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.css']
})
export class InvestorsComponent extends MagicClasses implements OnInit {

  public allInvestors: any[] = [];
  private tableName = 'Investors';

  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'investor';
  }

  async ngOnInit() {
    await this.listUser();


  }


  public async listUser() {
    DealroomsRequestService.entity = 'investor';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allInvestors = userResponse.data;
        if (this.allInvestors.length > 0) {
          UI.run(this.allInvestors, 'investor_table', this.tableName);
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
