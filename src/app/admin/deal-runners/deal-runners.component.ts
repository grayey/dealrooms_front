import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';


@Component({
  selector: 'app-deal-runners',
  templateUrl: './deal-runners.component.html',
  styleUrls: ['./deal-runners.component.css']
})
export class DealRunnersComponent extends MagicClasses implements OnInit {

  public allDealRunners: any[] = [];
  private tableName = 'Deal Runners';

  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'dealrunner';
  }

  async ngOnInit() {
    await this.listUser();


  }


  public async listUser() {
    DealroomsRequestService.entity = 'dealrunner';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allDealRunners = userResponse.data;
        if (this.allDealRunners.length > 0) {
          UI.run(this.allDealRunners, 'deal_runner_table', this.tableName);
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
