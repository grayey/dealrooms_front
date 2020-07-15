import {Component, OnInit} from '@angular/core';
import {MagicClasses} from '../../shared/magic-methods/classes';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealroomsRequestService} from '../../services/apis/report.service';
import {NotificationService} from '../../services/notification.service';
import {Router} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent extends MagicClasses implements OnInit {


  private static createUserForm = () => {
    return {
      full_name: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      user_type: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required])]
    };
  }

  public createUserForm: FormGroup;
  public success = false;
  public email: string;
  public userMessage = 'Create a dealrooms account and have access to funds & funding.';
  public showCity: boolean = true;
  public allCountries = [];
  private countryName: any;
  private telInputInsatnce: any;
  private instanceGlobals: any;

  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService,
              private notification: NotificationService, private router: Router) {
    super();
    DealroomsRequestService.entity = 'user';
    this.createUserForm = this.fb.group(RegisterComponent.createUserForm());

  }

  ngOnInit() {
    this.initializeView();
  }

  public async createUser() {
    this.resetLoaderAndMessage();
    const userData = {...this.createUserForm.value};
    userData['country'] = `${this.countryName}, ${userData['country']}`;
    await  this.dealRoomsRequestService.create(userData).subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.createUserForm.reset();
        this.notification.success(`Account created! An email has been sent to ${userData['email']}`);
        this.userMessage = `Login credentials have been sent to`;
        this.success = true;
        this.email = userData['email'];
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
        console.log('Create response', userResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));
        console.log('An Error Occurred', error);
      }
    );
  }

  public setCountry(name) {
    this.countryName = name;
    this.showCity = !!this.countryName;
  }

  public patchCountryValue() {
    let dialCode: string = Array.from($('.iti__selected-dial-code'))[0]['innerText'];
    dialCode = dialCode.replace('+', '');
    const countryObject = this.getCountryByDialCode(dialCode);
    $('#country_list').val(countryObject['name']);

  }

  private initializeView() {
    const telInputInsatnce = $('#phone_number').intlTelInput({
      preferredCountries: ['ng'],
      separateDialCode: true,
    });
    const instanceGlobals = telInputInsatnce.context.defaultView.intlTelInputGlobals;
    this.allCountries = instanceGlobals.getCountryData();
    this.telInputInsatnce = telInputInsatnce;
    this.instanceGlobals = instanceGlobals;

  }

  private getCountryByDialCode(dialCode) {
    const countryObject = this.allCountries.filter((country) => {
      return country.dialCode === dialCode;
    })[0];
    return countryObject;
  }


}
