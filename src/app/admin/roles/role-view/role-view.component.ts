import {Component, OnInit} from '@angular/core';
import {DealroomsRequestService} from '../../../../services/apis/report.service';
import {MagicClasses} from '../../../../shared/magic-methods/classes';
import {NotificationService} from '../../../../services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.css']
})
export class RoleViewComponent extends MagicClasses implements OnInit {


  public viewedRole: any;
  public allTasks: any[] = [];
  public allTaskIds: number[] = [];
  public assignedTaskIds: number[] = [];
  public allChecked = false;
  private roleId = null;
  /**
   *  getRoleById
   * @returns Void
   */
  private getRoleById = async () => {

    this.resetLoaderAndMessage();
    await this._activeRoute.params.subscribe((param) => {
      this.roleId = param['id'];
    });
    this.requestService.list(this.roleId).subscribe((roleResponse) => {
        this.viewedRole = roleResponse.data;
        this.resetLoaderAndMessage();

      },
      (error) => {
        this.notification.error(error.message);
        this.resetLoaderAndMessage();

      }
    );


  };


  private getAllTasks = async () => {

    DealroomsRequestService.entity = 'task';
    this.requestService.list().subscribe((taskResponse) => {
        this.allTasks = taskResponse.data.filter((task) => {

          return task.name && !task.name.toLowerCase().startsWith('public');

        });
      },
      () => {

      },
      () => {
        DealroomsRequestService.entity = 'role';
        this.assignedTaskIds = this.pluckTaskIds(this.viewedRole.tasks);
        this.setAllCheckedStatus();
      });
  };

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private requestService: DealroomsRequestService,
    private notification: NotificationService
  ) {
    super();
    DealroomsRequestService.entity = 'role';
  }

  async ngOnInit() {
    await this.getRoleById();
    this.getAllTasks();
  }

  public setSelection(taskId) {
    if (this.assignedTaskIds.includes(taskId)) {
      this.assignedTaskIds = this.assignedTaskIds.filter((id) => {
        return +id !== +taskId;
      });
    } else {
      this.assignedTaskIds.push(taskId);
    }
    this.setAllCheckedStatus();
  }

  public saveAssigment() {
    DealroomsRequestService.entity = 'role';
    this.resetLoaderAndMessage();
    this.requestService.assignRolePermissions(this.viewedRole['id'], {tasks: this.assignedTaskIds}).subscribe(
      (assignmentResponse) => {
        this.resetLoaderAndMessage();
        console.log('tasks assigned', assignmentResponse);
        this.notification.success(`Tasks successfully assigned to ${this.viewedRole.name}`);
      }, (error) => {
        this.resetLoaderAndMessage();

        this.notification.error('An error occurred', error);
      },
      () => {
        DealroomsRequestService.entity = 'role';
        setTimeout(() => {
          this.scrollIntoView('top_assignment');

        }, 1000);
      });
  }

  public toggleAll() {
    this.assignedTaskIds = [];
    this.allChecked = !this.allChecked;
    if (!this.allChecked) {
      return;
    }
    const allTaskIds = this.pluckTaskIds(this.allTasks);
    this.assignedTaskIds = this.assignedTaskIds.concat(allTaskIds);
    setTimeout(() => {
      this.scrollIntoView('save_assignment');

    }, 1000);


  }

  private setAllCheckedStatus() {
    this.allChecked = this.assignedTaskIds.length === this.allTasks.length;

  }

  private pluckTaskIds(tasks) {
    return tasks.map((task) => {
      return task.id;
    });
  }
}






