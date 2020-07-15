import {Component, OnInit} from '@angular/core';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {NotificationService} from '../../../../services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MagicClasses} from '../../../../shared/magic-methods/classes';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Cache} from '../../../../utils/cache';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent extends MagicClasses implements OnInit {

  static personDetailsForm = () => {
    return {
      email: ['', Validators.compose([Validators.required, Validators.email])],
      last_name: ['', Validators.compose([Validators.required])],
      other_names: ['', Validators.compose([Validators.required])],
      passport_no: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      date_of_birth: ['', Validators.compose([Validators.required])],
      medical_cond: ['', Validators.compose([Validators.required])],
      cond_description: ['', Validators.compose([])],
      nok_name: ['', Validators.compose([Validators.required])],
      nok_relationship: ['', Validators.compose([Validators.required])],
      nok_address: ['', Validators.compose([Validators.required])],
      nok_email: ['', Validators.compose([Validators.required])],
      nok_phone: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([])],
    };
  };

  static uploadForm = () => {
    return {
      passport_image: ['', Validators.compose([Validators.required])]
    };
  };
  public viewedUser: any;
  public transactionReceipt: any;
  public viewedCertificate: any;
  public viewedTravel: any;
  public printing: boolean;
  public insuranceFormData: any;
  public inputData = {master: 'userview', userId: null};
  public allTasks: any[] = [];
  public editProfile: boolean = false;
  public assignedTaskIds: any[] = [];
  public allTravels: any[] = [];
  public allTravelsWithTransactions: any[] = [];
  public personDetailsForm: FormGroup;
  public uploadForm: FormGroup;
  public imageUrl;
  public imageFile: any;
  public selectedFile: any;
  public percentageUpload = '0%';
  public fileName = 'Int. Passport';
  public isProfile = false;
  public uploadInProgress = false;
  public medicalCondition = false;
  public percentageInFraction: string;
  private uploadFileUrl: any;
  private userId: number;
  public authUser: any;
  /**
   *  getUserById
   * @returns Void
   */
  private getUserById = async () => {

    this.resetLoaderAndMessage();
    await this._activeRoute.params.subscribe((param) => {
      this.userId = param['id'];
    });
    this.userId = this.isProfile ? this.authUser.id : this.userId;  // change 1 to userId from loggedInUser.id
    this.requestService.list(this.userId).subscribe((userResponse) => {
        this.viewedUser = userResponse.data;
        this.imageUrl = (this.viewedUser.profile && this.viewedUser.profile.passport_image) ? this.viewedUser.profile.passport_image : this.imageUrl;
        this.insuranceFormData = this.viewedUser;
        this.inputData.userId = this.viewedUser.id;
        this.resetLoaderAndMessage();
      },
      (error) => {
        this.notification.error(error.message);
        this.resetLoaderAndMessage();

      }
    );


  };

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private requestService: DealroomsRequestService,
    private notification: NotificationService,
    private  fb: FormBuilder,
    // private storage: AngularFireStorage
  ) {
    super();
    DealroomsRequestService.entity = 'user';
    this.personDetailsForm = this.fb.group(UserViewComponent.personDetailsForm());
    this.uploadForm = this.fb.group(UserViewComponent.uploadForm());
    this.authUser = Cache.get('AUTH_USER');
    this.isProfile = window.location.href.includes('user-profile');
this.imageUrl = 'assets/admin/images/blank_photo.png'
  }

  ngOnInit() {
    this.getUserById();
  }

  public reRoute(page: string) {
    this._router.navigateByUrl(page);
  }

  public editTravel(travel, edit = true) {
    let url = `portal/users/${this.viewedUser['id']}/travel/${travel['id']}`;
    url = edit ? url : `${url}?xref_mode=0`;
    return this.reRoute(url);
  }

  public updateProfilex() {
  }

  public async uploadPassport() {
    // this.uploadInProgress = true;
    // this.resetLoaderAndMessage();
    // this.messages.update = 'Uploading';
    // DealroomsRequestService.entity = 'userprofile';
    // const path = `passport/${this.userId}/${new Date().getTime()}`;
    // const fileRef = this.storage.ref(path);
    // await  this.storage.upload(path, this.selectedFile).snapshotChanges().pipe(
    //   finalize(() => {
    //     fileRef.getDownloadURL().subscribe((url) => {
    //       this.uploadInProgress = false;
    //       this.uploadFileUrl = url;
    //       this.updateProfile();
    //     });
    //   })
    // ).subscribe((urlData) => {
    //   this.setPercentageUpload(urlData);
    //   //console.log('URL Data ', urlData);
    // }, (error) => {
    //   this.uploadInProgress = false;
    //   this.notification.error('An upload error occurred', error);
    //   this.resetLoaderAndMessage();
    // });
    //

  }

  public updateProfile() {
    this.messages.update = 'Updating';
    let profileData = this.deepCopy({...this.personDetailsForm.value});
    profileData['user_id'] = this.inputData.userId;
    profileData['next_of_kin'] = {
      nok_name: profileData.nok_name,
      nok_relationship: profileData.nok_relationship,
      nok_email: profileData.nok_email,
      nok_phone: profileData.nok_phone,
      nok_address: profileData.nok_address
    };
    profileData['passport_image'] = this.uploadFileUrl;
    profileData = this.unsetObjectKeys(profileData, ['nok_name', 'nok_relationship', 'nok_address', 'nok_email', 'nok_phone', 'cond_description']);
    this.requestService.update(this.userId, profileData).subscribe(
      (profileResponse) => {
        this.resetLoaderAndMessage();
        this.insuranceFormData = this.viewedUser['profile'] = profileResponse.data;
        //console.log('Profile response', profileResponse, this.viewedUser);

        this.viewedUser = Object.assign(this.viewedUser, profileResponse.data);
        this.notification.success('Profile successfully updated');
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
      }
    );
  }

  public saveUploadForm() {
  }

  public getAllUserTravels() {
    this.resetLoaderAndMessage();
    DealroomsRequestService.entity = 'travel_payment';
    this.requestService.list(this.userId).subscribe((travelResponse) => {
      this.resetLoaderAndMessage();
      const allTravels = travelResponse.data['travels'];
      this.allTravels = this.setTravelStatus(allTravels);
    }, (error) => {
      this.resetLoaderAndMessage();
      this.notification.error('An error occurred: Could not get user travels', error);
    });
  }

  public getAllUserTransactions() {
    DealroomsRequestService.entity = 'transaction';
    this.resetLoaderAndMessage();
    this.requestService.list(this.userId).subscribe((transactionResponse) => {
      this.resetLoaderAndMessage();
      const allTravelsWithTransactions = transactionResponse.data['travels'];
      allTravelsWithTransactions.forEach((travelWithTransaction) => {
        travelWithTransaction['payments'] = travelWithTransaction['payments'] ? this.firstOrLast(travelWithTransaction['payments']).last : null;
      });
      this.allTravelsWithTransactions = allTravelsWithTransactions;

    }, (error) => {
      this.resetLoaderAndMessage();

      this.notification.error('An error occurred: Could not get user transactions', error);
    });
  }

  public toggleEditView() {
    this.editProfile = !this.editProfile;
    if (this.editProfile) {
      this.personDetailsForm.patchValue(this.viewedUser);
    }
  }

  public uploadFile(event) {
    const reader = new FileReader(); // HTML5 FileReader API

    this.imageFile = event.target;
    const file = this.imageFile.files[0];
    this.selectedFile = file;
    this.fileName = file['name'];
    if (event.target.files && event.target.files[0]) {
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public setDescription(medConditon: string) {
    this.medicalCondition = medConditon.toLowerCase() === 'yes';
  }


  public viewAttaches(travel) {
    if (travel['payments']) {
      travel['payments'] = this.firstOrLast(travel['payments'], 'last').last;
    }
    this.viewedTravel = travel;

    this.triggerModal('open', 'view_attache_modal');
    //console.log('Attaches', this.viewedTravel);
  }

  public openReceiptModal(transaction) {
    this.transactionReceipt = transaction;

    this.triggerModal('open', 'receipt_modal');
  }

  public openCertificateModal(transaction) {
    transaction['loading_certificate'] = true;
    if ($('#certificate_iframe')[0]) { //it already exists
      $('#certificate_iframe').remove();// clear
    }
    this.viewedCertificate = transaction;
    const certificateUrl = this.viewedCertificate['payments']['certificate_url'];
    const iframe = $(`<iframe src="${certificateUrl}"  allowfullscreen="true" seamless height="650" width="750" id="certificate_iframe"></iframe>`);
    iframe.appendTo('#display_certificate');
    setTimeout(() => {
      this.triggerModal('open', 'certificate_modal');
      transaction['loading_certificate'] = false;
    }, 2000);


  }

  public downloadCertificate(certificateUrl) {
    const certificate = $('#certificate_url');
    certificate.attr('href', certificateUrl);
    certificate.attr('download', 'download.pdf');
    certificate[0].click();
  }


  public printReceipt(containerId) {
    this.printing = true;
    if ($('#print_frame')[0]) {
      $('#print_frame').remove();
    }
    const title = document.getElementById('receipt_title').innerText;
    const contents = $('#' + containerId).html();
    const body = $('body');
    const frame1 = $('<iframe id="print_frame" />'); //create an iframe
    frame1[0]['name'] = 'frame1';
    frame1.css({'position': 'absolute', 'top': '-1000000px', 'pointer-events': 'none'});// take it out of the screen
    body.append(frame1); // append the iframe to the body (DOM) so that window.frames is available
    const frameDoc = window.frames['frame1'];
    frameDoc.document.open();
    frameDoc.document.write('<html><head><title>' + title + '</title>');
    frameDoc.document.write('<base href="/">'); // so that you can link files normally;
    frameDoc.document.write('<link href="src/printmedia.css" rel="stylesheet"></head><body>');
    frameDoc.document.write('<style>.watermark {-webkit-filter: grayscale(100%);filter: grayscale(100%);opacity: .095;position: absolute;margin-top: 150px ;z-index:1035;transform: rotateY(0deg) rotate(-45deg);}</style>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body>');
    frameDoc.document.write('</html>');
    frameDoc.document.close();
    setTimeout(() => {
      frameDoc.print();
      this.printing = false;
      this.triggerModal('close', 'receipt_modal');
    }, 3000);

  }

  public requestRefund(credit) {
    Swal.fire({
      title: `You are requesting a refund of ₦${credit}`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        const data = {
          'credit': credit,
          'user_id': this.viewedUser['id']
        };

        this.resetLoaderAndMessage();
        this.requestService.requestRefund(data).subscribe(
          (refundResponse) => {
            this.resetLoaderAndMessage();

            this.notification.success('An email has been sent. Your refund request will be processed.');
          },
          (error) => {
            this.resetLoaderAndMessage();
            this.notification.warning('A mail could not be sent. Please contact us @ customer@chi.com');
          });
      }
    });
  }

  private setTravelStatus(allTravels) {
    allTravels.forEach((travel) => {
      travel['status'] = this.getDateDifference(travel['from_date'], travel['to_date'], true);
    });

    return allTravels;
  }

  // public setProgressBar(percentageUpload) {
  //   return {
  //     width: percentageUpload
  //   };
  // }
  //
  // public setProgressStatus(percentageUpload) {
  //   return percentageUpload !== '100%' ? 'progress-bar bg-info' : 'progress-bar bg-success';
  // }
  //
  // private unsetObjectKeys(dataObject, keys) {
  //   keys.forEach((key) => {
  //     if (key in dataObject) {
  //       delete dataObject[key];
  //     }
  //   });
  //   return dataObject;
  // }
  //
  // private setPercentageUpload(uploadRatio) {
  //   const {bytesTransferred, totalBytes} = uploadRatio;
  //   const percentage = Math.round(bytesTransferred / totalBytes * 100);
  //   this.percentageInFraction = `${Math.round(bytesTransferred / 1000)}KB / ${Math.round(totalBytes / 1000)}KB`;
  //   this.percentageUpload = `${percentage}%`;
  // }
}
