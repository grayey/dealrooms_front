import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormGroup, FormBuilder, Validators, Form} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import Swal from 'sweetalert2';
import {NotificationService} from '../../../services/notification.service';


declare const $: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends MagicClasses implements OnInit {




  public allTasks: any[] = [];
  public generating = false;
  private tableName = 'Tasks';

  constructor(private chiRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'task';

  }

  ngOnInit() {
    this.listTask();


  }


  public async listTask() {
    this.resetLoaderAndMessage();
    await  this.chiRequestService.list().subscribe(
      (taskResponse) => {
        this.resetLoaderAndMessage();
        this.allTasks = taskResponse.data;
        if (this.allTasks.length > 0) {
          UI.run(this.allTasks, 'tasks_table', this.tableName);
        }
        console.log('Liste response', taskResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
  }

  public async generateTasks() {
    this.generating = true;
    this.resetLoaderAndMessage();
    DealroomsRequestService.entity = 'task';

    await  this.chiRequestService.generateTasks().subscribe(
      (taskResponse) => {
        this.generating = false;
        this.resetLoaderAndMessage();
        this.allTasks = taskResponse.data;
        UI.rerender(this.allTasks, 'tasks_table', this.tableName);
        this.notification.success(`System tasks successfully generated!`);

        console.log('Create response', taskResponse);
      },
      (error) => {
        this.generating = false;
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
      }
    );
  }


}
