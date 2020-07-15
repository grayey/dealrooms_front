import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MagicClasses} from '../../shared/magic-methods/classes';
import {Router} from '@angular/router';
import {TokenService} from '../../services/token.service';
import {DealroomsRequestService} from '../../services/apis/report.service';
import {NotificationService} from '../../services/notification.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends MagicClasses implements OnInit {

  static resetEmailForm = () => {
    return {
      email: ['', Validators.compose([Validators.required, Validators.email])]
    };
  };
  public resetEmailForm: FormGroup;
  public recovery = false;
  public username = false;
  public resetInfo: string = 'Enter your Email and instructions will be sent to you';
  public infoClass = 'bg-info';
  public year;
  constructor(
    private requestService: DealroomsRequestService,
    private tokenService: TokenService,
    private notification: NotificationService,
    private _router: Router,
    private fb: FormBuilder,
    private _location: Location
  ) {
    super();
    this.resetEmailForm = this.fb.group(ChangePasswordComponent.resetEmailForm());
  }

  ngOnInit() {
  }

  public resetMail() {
    this.resetLoaderAndMessage();
    this.requestService.resetForgotPasswordByEmail(this.resetEmailForm.value).subscribe(
      (emailResetResponse) => {
        this.resetLoaderAndMessage();
        this.resetInfo = emailResetResponse.message;
        this.notification.success(emailResetResponse.message);
        console.log('Email response ', emailResetResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error(this.processErrors(error));

      }
    );
  }

  public goBack() {
    this._location.back();
  }

}
