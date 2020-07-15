import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormGroup, FormBuilder, Validators, Form} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import Swal from 'sweetalert2';
import {NotificationService} from '../../../services/notification.service';
import {UserHasTask} from '../../../shared/magic-methods/resolveUserTasks';


declare const $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent extends MagicClasses implements OnInit {


  private static createRoleForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  };
  private static updateRoleForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  };
  public createRoleForm: FormGroup;
  public updateRoleForm: FormGroup;
  public allRoles: any[] = [];
  public roleToEdit: any;
  private tableName = 'Roles';
  public userActivities = {...this.staffActivities};



  constructor(private fb: FormBuilder, private chiRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'role';
    this.createRoleForm = this.fb.group(RolesComponent.createRoleForm());
    this.updateRoleForm = this.fb.group(RolesComponent.updateRoleForm());
    const userTasks = new UserHasTask('list_roles');
    const screenActivities = userTasks.userScreenActivities(['list_roles', 'create_role', 'delete_role', 'toggle_role', 'update_role']);
    this.userActivities = {
      create: screenActivities.includes('create'),
      _delete: screenActivities.includes('delete'),
      toggle: screenActivities.includes('toggle'),
      update: screenActivities.includes('update')
    };
  }

  ngOnInit() {
    this.listRole();


  }


  public async listRole() {
    this.resetLoaderAndMessage();
    await  this.chiRequestService.list().subscribe(
      (roleResponse) => {
        this.resetLoaderAndMessage();
        this.allRoles = roleResponse.data;
        if (this.allRoles.length > 0) {
          UI.run(this.allRoles, 'roles_table', this.tableName);
        }
        //console.log('Liste response', roleResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async createRole() {
    this.resetLoaderAndMessage();
    await  this.chiRequestService.create(this.createRoleForm.value).subscribe(
      (roleResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'create_role_modal');
        this.createRoleForm.reset();
        roleResponse.data['enabled'] = 1;
        this.allRoles.unshift(roleResponse.data);
        setTimeout(() => {
          // this.reassignRow(roleResponse.data, roleResponse.data);
          // UI.rerender(this.tableName, this.allRoles);

        }, 500);
        this.notification.success(`${roleResponse.data.name} successfully created!`);

        //console.log('Create response', roleResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async updateRole() {
    this.resetLoaderAndMessage();
    await  this.chiRequestService.update(this.roleToEdit['id'], this.updateRoleForm.value).subscribe(
      (roleResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'update_role_modal');
        this.reassignRow(this.roleToEdit, roleResponse.data);
        this.notification.success(`${this.roleToEdit.name}  updated!`);

      },
      (error) => {

        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }


  public async toggleRole(role) {

    const roleData = {...role};
    let toggleMsg = `activated!`;
    roleData['enabled'] = +role['enabled'] === 1 ? 0 : 1;
    setTimeout(() => {
      toggleMsg = (roleData['enabled']) ? toggleMsg : `de${toggleMsg}`;
    }, 10);
    await  this.chiRequestService.toggleEntity(roleData).subscribe(
      (roleResponse) => {
        this.reassignRow(role, roleResponse.data);
        this.notification.success(`${role.name} successfully ${toggleMsg}`);

      },
      (error) => {
        // $(`#${event.target.id}`)[0].click();
        this.notification.error(`${role.name} could not be ${toggleMsg}`, error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async deleteRole(role) {
    Swal.fire({
      title: `You are about to delete ${role.name}!`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        role['deleting'] = true;
        this.chiRequestService.deleteEntity(role['id']).subscribe(
          (roleDeletedResponse) => {
            this.reassignRow(role, roleDeletedResponse, false);
            this.notification.success(`${role.name} successfully deleted!`);

          },
          (error) => {
            role['deleting'] = false;
            // $(`#${event.target.id}`)[0].click();
            //console.log('An Error Occurred', error);
            this.notification.error(`${role.name} could not be deleted`, error);

          }
        );
      }
    });


  }

  public openEditModal(role) {
    this.updateRoleForm.patchValue(role);
    this.roleToEdit = {...role};
    this.triggerModal('open', 'update_role_modal');
  }

  public reassignRow(role, data, update = true) {
    if (!update) {
      const roles = this.allRoles.filter((r, index) => {
        return r['id'] !== role['id'];
      });
      setTimeout(() => {
        this.allRoles = this.deepCopy(roles);
      }, 100);
    }
    //console.log('logging role and data ', role, data);
    this.allRoles.forEach((rl, index) => {
      if (rl['id'] === role['id']) {
        this.allRoles[index] = data;
      }
    });
  }

}
