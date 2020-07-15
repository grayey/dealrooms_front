import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MagicClasses} from '../../shared/magic-methods/classes';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenService} from '../../services/token.service';
import {DealroomsRequestService} from '../../services/apis/report.service';
import {NotificationService} from '../../services/notification.service';
import {Location} from '@angular/common';
import {Cache} from '../../utils/cache';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends MagicClasses implements OnInit {


  public passwordForm: FormGroup;
  public resetInfo: string = 'Enter your Email and instructions will be sent to you';
  public linkIsValid: boolean = false;
  public year;
  private passwordRequestParam;

  constructor(
    private requestService: DealroomsRequestService,
    private tokenService: TokenService,
    private notification: NotificationService,
    private _router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _location: Location
  ) {
    super();

    this.passwordForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this.activeRoute.queryParams.subscribe((param) => {
      if (param.amneshref) {
        this.passwordRequestParam = param;
        this.checkValidLink(param.amneshref);
      }
      else {
        if (this.tokenService.getAuthUser()) {//user has to be logged in
          this.linkIsValid = true;
        } else {
          this._router.navigateByUrl('403-denied');
        }
      }
    });
  }

  ngOnInit() {
  }


  public changePassword() {
    this.resetLoaderAndMessage();
    const data = this.passwordForm.value;
    data['type'] = this.passwordRequestParam || {defaultref: true};
    if (!this.passwordRequestParam) { // user is logged so get user id

      data['user_id'] = Cache.get('AUTH_USER')['id'];
    }
    this.requestService.changeUserPassword(data).subscribe(
      (changePasswordResponse) => {
        // this.resetLoaderAndMessage();
        this.resetInfo = changePasswordResponse.message;
        this.notification.success(changePasswordResponse.message);
        setTimeout(() => {
          this.goBack();
        }, 1000);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));

      }
    );
  }


  public checkValidLink(link) {
    const data = {
      resetLink: link
    };
    this.resetLoaderAndMessage();
    this.requestService.checkValidLink(data).subscribe(
      (validLinkResponse) => {
        this.resetLoaderAndMessage();
        this.resetInfo = validLinkResponse.message;
        this.linkIsValid = true;
        console.log('Valid link response ', validLinkResponse);
      },
      (error) => {
        this.linkIsValid = false;
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));

      }
    );
  }

  public passwordsAreSame() {
    return this.passwordForm.value.confirm_password === this.passwordForm.value.password;
  }

  public goBack() {
    const user = Cache.get('AUTH_USER');
    const first = Cache.get('JUST_LOGGED_ON');
    const login_url = first ? `panel/profile-update/${user['user_ref']}` : 'login';
    if(first){
      this.notification.info('Please complete your profile Information');
    }

    return (this.passwordRequestParam && this.passwordRequestParam.amneshref) || (first) ? this._router.navigateByUrl(login_url) : this._location.back();
  }

}
