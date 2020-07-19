import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Cache} from '../../../../utils/cache';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MagicClasses} from '../../../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {NotificationService} from '../../../../services/notification.service';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-runner-financier',
  templateUrl: './runner-financier.component.html',
  styleUrls: ['./runner-financier.component.css']
})
export class RunnerFinancierComponent extends MagicClasses implements OnInit, OnChanges {
  static updateProfileForm = () => {
    return {
      company_name: ['', Validators.compose([Validators.required])],
      company_address: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      company_website: ['', Validators.compose([Validators.required])],
      contact_name: ['', Validators.compose([Validators.required])],
      contact_email: ['', Validators.compose([Validators.required, Validators.email])],
      contact_phone: ['', Validators.compose([Validators.required])],
      contact_address: ['', Validators.compose([Validators.required])],
      accomplishments: ['', Validators.compose([Validators.required])],
      history: ['', Validators.compose([Validators.required])],
      financier_type: ['', Validators.compose([Validators.required])],
      deal_size: ['', Validators.compose([Validators.required])],
      funding_type: ['', Validators.compose([
        // Validators.required
      ])],
      sector: ['', Validators.compose([
        // Validators.required
      ])],
      african_focus: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],

    };
  }
  public authUser: any;
  public userType: any;
  public userId: any;
  public user: any;
  public updateProfileForm: FormGroup;
  public submitted = false;

  public allFundTypes: any[];
  public allSectors: any[];


  public uploadMessage = 'Insert Business Logo';
  public uploadError: any;
  public selectedImageFile: any;
  public imageFileUrl: any;
  public manualPaymentFileName = 'Upload';
  public uploadInProgress: boolean = false;
  public blankLogo: boolean = true;


  public countryName: string;
  public showCity: boolean = true;
  public telInputInsatnce: any;
  public instanceGlobals: any;
  @Input('inputData') inputData: any;
  public allCountries: any[] = [];
  private dialCode: string;
  private prefered = ['us'];
  private countryIso;

  constructor(private fb: FormBuilder, private dealroomsRequestService: DealroomsRequestService,
              private notification: NotificationService, private storage: AngularFireStorage,
              private router:Router) {
    super();
    this.authUser = Cache.get('AUTH_USER');
    this.user = this.authUser; // in case user profile is not auth user's
    this.userType = this.authUser['user_type'];
    this.userId = this.user['id'];
    this.updateProfileForm = this.fb.group(RunnerFinancierComponent.updateProfileForm());
    this.imageFileUrl = 'assets/images/small/img-3.jpg';

  }

  ngOnInit() {
    this.listFundTypes();
    this.listSectors();
  }


  ngOnChanges(changes: any) {
    if (this.inputData) {


      try {

        const profileData = this.inputData.financier_runner_profile;
        this.imageFileUrl = this.inputData['business_logo'] || this.imageFileUrl;


        if (profileData) {
          const location = profileData['contact_address'].split('|');
          const phone = profileData['contact_phone'].split('___');
          profileData['contact_phone'] = phone[1];
          profileData['country'] = location[1];
          profileData['location'] = location[0]
          const countryName = location[1];
          this.countryIso = phone[0];
          this.prefered = [this.countryIso];
          // $('#country_list').val(countryName);
          this.setCountry(countryName);

          $('#company_history_value')['summernote']('code', profileData.history);
          $('#accomplishments_value')['summernote']('code', profileData.accomplishments);
          this.updateProfileForm.patchValue(profileData);
        } else {

          $('.summernote')['summernote']({
            height: 350, // set editor height
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: true // set focus to editable area after initializing summernote
          });

        }

        this.initializeView();


      } catch (e) {
        throw e;
      }
    }


  }

  public async saveFinancierProfile() {

    this.uploadBusinessLogo();
    this.submitted = true;
    this.appendFormValues();
    this.patchCountryValue(false);
    const profileData = this.updateProfileForm.value;

    this.resetLoaderAndMessage();
    profileData['id'] = this.userId;
    profileData['contact_address'] = `${profileData['location']}|${profileData['country'] }`;
    profileData['contact_phone'] = `${this.countryIso}___${profileData['contact_phone']}`;
    profileData['sector'] = this.cleanMultiSelect('sector_list');
    delete profileData['location'];
    delete profileData['country'];

    console.log('proor daya', profileData);
    await this.dealroomsRequestService.saveFinancierProfile(profileData).subscribe(
      (profileUpdateResponse) => {

        this.authUser['has_profile'] = true;
        Cache.set('AUTH_USER', this.authUser);
        if (Cache.get('WANTED_TO_CREATE')) {
          this.router.navigateByUrl('/panel/deals/create');
          this.notification.info(`You can now proceed to create your first deal <i class="fa fa-smile-beam"></i>`);
          Cache.set('WANTED_TO_CREATE', null);
        }else{
          this.router.navigateByUrl('/dashboard');

        }
        this.resetLoaderAndMessage();
        this.notification.success(`${this.user.full_name}'s profile successfully saved!`);

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
    if (!this.selectedImageFile && this.blankLogo) {
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
      this.updateProfileForm.patchValue(country);
    }

  }

  private appendFormValues() {
    const history = $(`#company_history_value`)['summernote']('code');
    const accomplishments = $(`#accomplishments_value`)['summernote']('code');
    this.updateProfileForm.patchValue({history, accomplishments});

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

  private getCountryByDialCode(dialCode) {
    const countryObject = this.allCountries.filter((country) => {
      return country.dialCode === dialCode;
    })[0];
    return countryObject;
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

}
