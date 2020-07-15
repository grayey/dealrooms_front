import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';
import Swal from 'sweetalert2';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {UserHasTask} from '../../../shared/magic-methods/resolveUserTasks';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends MagicClasses implements OnInit {

  private static createUserForm = () => {
    return {
      full_name: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      role_id: ['', Validators.required],
      user_type: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required])]
    };
  }
  private static updateUserForm = () => {
    return {
      full_name: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      role_id: ['', Validators.required],
      user_type: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required])]

    };
  };
  private static createPaymentForm = () => {
    return {
      amount: ['', Validators.compose([Validators.required])],
      scanned_evidence: ['', Validators.compose([Validators.required])]
    };
  };
  public createUserForm: FormGroup;
  public updateUserForm: FormGroup;
  public createPaymentForm: FormGroup;
  public allUsers: any[] = [];
  public allRoles: any[] = [];
  public allCountries = [];
  public userToEdit: any;
  public userToCredit: any;
  public userType = '';
  public manualPaymentFileName = '';
  public manualPaymentFileUrl;
  public uploadInProgress = false;
  public percentageUpload = '0%';
  public userActivities = {...this.staffActivities};
  private tableName = 'Users';

  constructor(private fb: FormBuilder, private dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'user';
    this.createUserForm = this.fb.group(UsersComponent.createUserForm());
    this.updateUserForm = this.fb.group(UsersComponent.updateUserForm());
    this.createPaymentForm = this.fb.group(UsersComponent.createPaymentForm());
    const userTasks = new UserHasTask('list_users');
    const screenActivities = userTasks.userScreenActivities(['list_users', 'create_user', 'delete_user', 'toggle_user', 'update_user']);
    this.userActivities = {
      create: screenActivities.includes('create'),
      _delete: screenActivities.includes('delete'),
      toggle: screenActivities.includes('toggle'),
      update: screenActivities.includes('update')
    };
    this.allCountries = this.getAllCountries();

  }

  async ngOnInit() {
    await this.listUser();
    this.listRole();

  }


  public async listUser() {
    DealroomsRequestService.entity = 'user';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allUsers = userResponse.data;
        if (this.allUsers.length > 0) {
          UI.run(this.allUsers, 'users_table', this.tableName);
        }
        console.log('Liste response', userResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
  }

  public async listRole() {
    DealroomsRequestService.entity = 'role';
    await  this.dealRoomsRequestService.list().subscribe(
      (roleResponse) => {
        this.allRoles = roleResponse.data;
        console.log('roles response', roleResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
      },

      () => {
        DealroomsRequestService.entity = 'user';
      }
    );
  }

  public async createUser() {
    this.resetLoaderAndMessage();
    const userData = this.softFormat({...this.createUserForm.value});
    await  this.dealRoomsRequestService.create(userData).subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.triggerModal('close', 'create_user_modal');
        this.createUserForm.reset();
        userResponse.data['enabled'] = 1;
        this.allUsers.unshift(userResponse.data);
        UI.rerender(this.allUsers, 'users_table', this.tableName);

        this.notification.success(`${userResponse.data.full_name} successfully created!`);

        console.log('Create response', userResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        console.log('An Error Occurred', error);
      }
    );
  }

  public async updateUser() {
    this.resetLoaderAndMessage();
    const userData = this.softFormat({...this.updateUserForm.value});
    await  this.dealRoomsRequestService.update(this.userToEdit['id'], userData).subscribe(
      (userResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'update_user_modal');
        this.reassignRow(this.userToEdit, userResponse.data);
        this.notification.success(`${this.userToEdit.name}  updated!`);

      },
      (error) => {

        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        console.log('An Error Occurred', error);
      }
    );
  }


  public async toggleUser(user) {

    const userData = {...user};
    let toggleMsg = `activated!`;
    userData['enabled'] = +user['enabled'] === 1 ? 0 : 1;
    setTimeout(() => {
      toggleMsg = (userData['enabled']) ? toggleMsg : `de${toggleMsg}`;
    }, 10);
    await  this.dealRoomsRequestService.toggleEntity(userData).subscribe(
      (userResponse) => {
        this.reassignRow(user, userResponse.data);
        this.notification.success(`${user.name} successfully ${toggleMsg}`);

      },
      (error) => {
        // $(`#${event.target.id}`)[0].click();
        this.notification.error(`${user.name} could not be ${toggleMsg}`, error);
        console.log('An Error Occurred', error);
      }
    );
  }

  public async deleteUser(user) {
    Swal.fire({
      title: `You are about to delete ${user.full_name}!`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        user['deleting'] = true;
        this.dealRoomsRequestService.deleteEntity(user['id']).subscribe(
          (userDeletedResponse) => {
            this.reassignRow(user, userDeletedResponse, false);
            this.notification.success(`${user.full_name} successfully deleted!`);

          },
          (error) => {
            user['deleting'] = false;
            // $(`#${event.target.id}`)[0].click();
            console.log('An Error Occurred', error);
            this.notification.error(`${user.full_name} could not be deleted`, error);

          }
        );
      }
    });


  }

  public openEditModal(user) {
    const userData = {...user};
    const name = userData['name'].split(' ');
    userData['last_name'] = (userData.profile) ? userData.profile.last_name : name[0];
    userData['other_names'] = (userData.profile) ? userData.profile.other_names : name[1];
    this.updateUserForm.patchValue(userData);
    this.userToEdit = {...userData};
    this.setUserType(this.userToEdit.user_type);
    this.triggerModal('open', 'update_user_modal');
  }

  public openRefundModal(user) {
    const userData = {...user};
    const name = userData['name'].split(' ');
    userData['last_name'] = (userData.profile) ? userData.profile.last_name : name[0];
    userData['other_names'] = (userData.profile) ? userData.profile.other_names : name[1];
    this.userToCredit = {...userData};
    this.triggerModal('open', 'credit_user_modal');
  }


  public reassignRow(user, data, update = true) {
    if (!update) {
      const users = this.allUsers.filter((r, index) => {
        return r['id'] !== user['id'];
      });
      setTimeout(() => {
        this.allUsers = this.deepCopy(users);
        UI.rerender(this.allUsers, 'users_table', this.tableName);
      }, 100);
    }
    console.log('logging user and data ', user, data);
    this.allUsers.forEach((rl, index) => {
      if (rl['id'] === user['id']) {
        this.allUsers[index] = data;
      }
    });
  }

  public async setUserType(userType) {
    this.userType = userType;
    if (this.userType === 'staff') {
      this.createUserForm.controls['role_id'].setValidators([Validators.required]);
      this.updateUserForm.controls['role_id'].setValidators([Validators.required]);
    } else {
      this.createUserForm.controls['role_id'].setValidators([]);
      this.updateUserForm.controls['role_id'].setValidators([]);
    }
    /**
     * the following ensures an update of the controls
     */
    this.createUserForm.controls['role_id'].updateValueAndValidity();
    this.updateUserForm.controls['role_id'].updateValueAndValidity();

  }

  public uploadFile(event, payment = false) {
    const reader = new FileReader(); // HTML5 FileReader API
    const file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.onload = () => {
        if (!payment) {
          // this.imageUrl = reader.result;
          // this.fileName = file['name'];
          // this.selectedPassportFile = file;
          // this.isBlankPhoto = true;
        } else {
          this.manualPaymentFileUrl = reader.result;
          this.manualPaymentFileName = file['name'];
          // this.selectedPaymentFile = file;
        }

        // this.uploadForm.patchValue({
        //   passport_image: reader.result
        // });
        // this.editFile = false;
        // this.removeUpload = true;
      };
      reader.readAsDataURL(file);
      // ChangeDetectorRef since file is loading outside the zone
      // this.cd.markForCheck();
    }
  }

  public refundUser() {
    // this.paymentType = 'manual';
    // this.uploadImageFile(true);
    this.triggerModal('close', 'credit_user_modal');

  }

  public setOptionStyle(role) {
    return !role['enabled'] ? {
      'color': 'red'
    } : {};
  }

  private softFormat(userData) {

    userData['role_id'] = userData['user_type'] === 'customer' ? null : userData['role_id'];
    return userData;
  }


}
