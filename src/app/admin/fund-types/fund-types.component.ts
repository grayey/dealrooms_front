import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {NotificationService} from '../../../services/notification.service';


@Component({
  selector: 'app-fund-types',
  templateUrl: './fund-types.component.html',
  styleUrls: ['./fund-types.component.css']
})
export class FundTypesComponent extends MagicClasses implements OnInit {

  public allFundTypes: any[] = [];


  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();

  }

  ngOnInit() {
    this.listFundTypes();
  }

  private listFundTypes() {
    this.dealRoomsRequestService.listFundTypes().subscribe((fundTypesResponse) => {
        this.allFundTypes = fundTypesResponse.data;
      },
      (error) => {
        this.notification.error(this.processErrors(error));
      }
    )
  }


}
