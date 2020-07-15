import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MagicClasses} from '../../../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {NotificationService} from '../../../../services/notification.service';
import {AngularFireStorage} from '@angular/fire/storage';

import {Cache} from '../../../../utils/cache';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-deal-owner-profile',
  templateUrl: './deal-owner.component.html',
  styleUrls: ['./deal-owner.component.css']
})
export class DealOwnerComponent extends MagicClasses implements OnInit, OnChanges {

  private static createCompanyForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      // description: ['', Validators.compose([Validators.required])],
      launch_date: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      no_employees: ['', Validators.compose([Validators.required])],
      sectors: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      valuation: ['', Validators.compose([Validators.required])],
      client_focus: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    };


  }
  public createCompanyForm: FormGroup;
  public allFundTypes: any[];
  public allSectors: any[];
  public allCountries = [];
  public authUser: any;
  public userType: any;
  public userId: any;
  public user: any;
  public uploadMessage = 'Business Logo';
  public uploadError: any;
  public selectedImageFile: any;
  public imageFileUrl: any;
  public manualPaymentFileName = 'Upload';
  public uploadInProgress: boolean = false;
  public blankLogo: boolean = true;
  public countryName: string;
  public showCity: boolean;
  public telInputInsatnce: any;
  public instanceGlobals: any;
  @Input('inputData') inputData: any;
  private dialCode: string;
  private prefered = ['ng'];
  private countryIso;

  constructor(private fb: FormBuilder, private dealroomsRequestService: DealroomsRequestService,
              private notification: NotificationService, private storage: AngularFireStorage,
              private router: Router) {
    super();
    this.createCompanyForm = this.fb.group(DealOwnerComponent.createCompanyForm());
    this.authUser = Cache.get('AUTH_USER');
    this.user = this.authUser; // in case user profile is not auth user's
    this.userType = this.authUser['user_type'];
    this.userId = this.user['id'];

    this.imageFileUrl = 'assets/images/small/img-3.jpg';
  }

  ngOnInit() {
    this.listFundTypes();
    this.listSectors();

    // this.allCountries = this.getAllCountries();
  }

  ngOnChanges(changes: any) {
    if (this.inputData && this.inputData.dealowner_profile) {
      try {

        console.log('Input data', this.inputData)
        this.imageFileUrl = this.inputData['business_logo'] || this.imageFileUrl;
        this.blankLogo = !!this.inputData['business_logo'];

        const profileData = this.inputData.dealowner_profile;

        if (profileData) {
          const location = profileData['location'].split('|');
          const phone = profileData['telephone'].split('___');
          profileData['telephone'] = phone[1];
          profileData['location'] = location[0];
          profileData['country'] = location[1]
          const countryName = location[1];
          this.countryIso = phone[0];
          this.prefered = [this.countryIso];
          // $('#country_list').val(countryName);
          this.setCountry(countryName);
        }
        this.initializeView();
        this.createCompanyForm.patchValue(profileData);
      } catch (e) {
        throw e;
      }
    }
    else {
      this.initializeView();
    }

  }


  public async createCompany() {
    const profileData = this.createCompanyForm.value;
    this.patchCountryValue(false)
    this.resetLoaderAndMessage();
    profileData['id'] = this.userId;
    profileData['business_type'] = 'anything';
    profileData['sectors'] = this.cleanMultiSelect('sector_list');
    profileData['location'] = `${profileData['location']}|${profileData['country'] }`;
    profileData['telephone'] = `${this.countryIso}___${profileData['telephone']}`;
    delete profileData['country'];
    this.uploadBusinessLogo();
    await this.dealroomsRequestService.saveDealOwnerProfile(profileData).subscribe(
      (profileUpdateResponse) => {

        this.resetLoaderAndMessage();
        this.notification.success(`${this.user.full_name}'s profile successfully saved!`);
        this.authUser['has_profile'] = true;
        Cache.set('AUTH_USER', this.authUser);

        if (Cache.get('WANTED_TO_CREATE')) {
          this.router.navigateByUrl('/panel/deals/create');
          this.notification.info('You can now proceed to create your first deal <i class="fa fa-smile-beam"></i>');
          Cache.set('WANTED_TO_CREATE', null);
        }
        else{
          this.router.navigateByUrl('/dashboard');

        }
        //console.log('Create response', dealResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', this.processErrors(error));
      }
    );
  }

  public selectFile(event, isPayment = false) {
    this.uploadError = '';
    this.uploadMessage = 'Business Logo';
    const reader = new FileReader(); // HTML5 FileReader API
    const file = event.target.files[0];

    this.selectedImageFile = file;
    this.blankLogo = false;

    if (event.target.files && event.target.files[0]) {
      reader.onload = () => {
        let fileName = file['name']
        const fileNameString = fileName.split('.');
        const extension = fileNameString[fileNameString.length - 1];
        if (fileName.length > 12) {
          fileName = `${fileName.slice(0, 8)}...${extension}`;
        }

        this.manualPaymentFileName = fileName;
        this.imageFileUrl = reader.result;
      };
      reader.readAsDataURL(file);


    }
  }

  public async uploadBusinessLogo(): Promise<any> {
    this.uploadInProgress = true;
    if (!this.selectedImageFile && !this.blankLogo) {
      this.uploadMessage = 'Attach a logo';
      this.uploadError = true;
      this.uploadInProgress = false;
      return;
    }

    this.messages.update = 'Uploading';
    const date = new Date();
    const name = this.selectedImageFile['name'];
    const path = `logos/${name.split(' ').join('')}-${date.getTime()}`;
    const fileRef = this.storage.ref(path);
    // console.log('File ref',fileRef)
    return await  this.storage.upload(path, this.selectedImageFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.uploadInProgress = false;
          this.uploadMessage = null;
          this.updateUserLogo(url);
          this.uploadMessage = 'Logo Updated';
          this.uploadError = 'na';


        });
      })
    ).subscribe((urlData) => {
        this.setPercentageUpload(urlData);
        console.log('URL Data ', urlData);
      }, (error) => {
        this.uploadInProgress = false;
        this.uploadMessage = 'Logo Update Failed';
        this.uploadError = true;
        // this.notification.error('Your business log failed to upload. Please try again', error);
        this.loaders.processing = false;
      },
      () => {
        // console.log('Completd')
      }
    );
  }

  public setCountry(name) {
    this.countryName = name;
    this.showCity = !!this.countryName;
  }

  public patchCountryValue(patch = true) {
    let dialCode: string = Array.from($('.iti__selected-dial-code'))[0]['innerText'];
    dialCode = dialCode.replace('+', '');
    this.dialCode = `(${dialCode})`;
    const countryObject = this.getCountryByDialCode(dialCode);
    this.countryIso = `${countryObject['iso2']}`;
    if (patch) {
      $('#country_list').val(countryObject['name']);
    } else {
      const country = $('#country_list').val();
      this.createCompanyForm.patchValue(country);
    }

  }


  private getCountryByDialCode(dialCode) {
    const countryObject = this.allCountries.filter((country) => {
      return country.dialCode === dialCode;
    })[0];
    return countryObject;
  }

  private initializeView() {
    const telInputInsatnce = $('#contact_phone').intlTelInput({
      preferredCountries: this.prefered,
      separateDialCode: true,
    });
    const instanceGlobals = telInputInsatnce.context.defaultView.intlTelInputGlobals;
    this.allCountries = instanceGlobals.getCountryData();
    this.telInputInsatnce = telInputInsatnce;
    this.instanceGlobals = instanceGlobals;

  }


  private listFundTypes() {
    this.dealroomsRequestService.listFundTypes().subscribe((fundTypesResponse) => {
        this.allFundTypes = fundTypesResponse.data;
        $('.fundtype_list').select2();
      },
      (error) => {
        this.notification.error(this.processErrors(error));
      });
  }

  private listSectors() {
    this.dealroomsRequestService.listSectors().subscribe((sectorsResponse) => {
        this.allSectors = sectorsResponse.data;
        $('.sector_list').select2();

      },
      (error) => {
        this.notification.error(this.processErrors(error));
      });
  }

  private updateUserLogo(url) {
    const data = {
      id: this.userId,
      business_logo: url
    };

    this.dealroomsRequestService.updateUserLogo(data).subscribe(
      (logoResponse) => {
        this.uploadMessage = 'Logo Updated';
      },
      (error) => {
        this.uploadMessage = 'Logo failed to update';
        // this.notification.error(this.processErrors(error));
      });

  }
}
