import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';


@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css']
})
export class CreateCompanyComponent extends MagicClasses implements OnInit {

  public allCompanies: any[] = [];
  public createCompanyForm: FormGroup;



  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'company';
    this.createCompanyForm = this.fb.group(CreateCompanyComponent.createCompanyForm());

  }

  private static createCompanyForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      // description: ['', Validators.compose([Validators.required])],
      launch_date: ['', Validators.compose([Validators.required])],
      funding_amount: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      no_employees: ['', Validators.compose([Validators.required])],
      sectors: ['', Validators.compose([Validators.required])],
      business_type: ['', Validators.compose([Validators.required])],
      // client_focus: ['', Validators.compose([Validators.required])],
      funding_type_id: ['', Validators.compose([Validators.required])],

    };
  }

  ngOnInit() {
  }

  public createCompany(){

  }
}
