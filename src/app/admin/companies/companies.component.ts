import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent extends MagicClasses implements OnInit {

  private static createCompanyForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
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

  private static updateCompanyForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  }
  public allCompanies: any[] = [];
  public createCompanyForm: FormGroup;
  public updateCompanyForm: FormGroup;
  private tableName = 'Companies';

  public companyToEdit;
  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'company';
    this.createCompanyForm = this.fb.group(CompaniesComponent.createCompanyForm());
    this.updateCompanyForm = this.fb.group(CompaniesComponent.updateCompanyForm());
  }

  async ngOnInit() {
    await this.listUser();


  }


  public async listUser() {
    DealroomsRequestService.entity = 'company';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allCompanies = userResponse.data;
        if (this.allCompanies.length > 0) {
          UI.run(this.allCompanies, 'company_table', this.tableName);
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
