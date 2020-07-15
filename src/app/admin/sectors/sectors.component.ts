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
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent extends MagicClasses implements OnInit {


  private static createSectorForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  };
  private static updateSectorForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  };
  public createSectorForm: FormGroup;
  public updateSectorForm: FormGroup;
  public allSectors: any[] = [];
  public sectorToEdit: any;
  private tableName = 'Sectors';
  public userActivities = {...this.staffActivities};



  constructor(private fb: FormBuilder, private dealroomsRequestService: DealroomsRequestService, private notification: NotificationService) {
    super();
    DealroomsRequestService.entity = 'sector';
    this.createSectorForm = this.fb.group(SectorsComponent.createSectorForm());
    this.updateSectorForm = this.fb.group(SectorsComponent.updateSectorForm());
    const userTasks = new UserHasTask('list_sectors');
    const screenActivities = userTasks.userScreenActivities(['list_sectors', 'create_sector', 'delete_sector', 'toggle_sector', 'update_sector']);
    this.userActivities = {
      create: screenActivities.includes('create'),
      _delete: screenActivities.includes('delete'),
      toggle: screenActivities.includes('toggle'),
      update: screenActivities.includes('update')
    };
  }

  ngOnInit() {
    this.listSector();


  }


  public async listSector() {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequestService.list().subscribe(
      (sectorResponse) => {
        this.resetLoaderAndMessage();
        this.allSectors = sectorResponse.data;
        if (this.allSectors.length > 0) {
          UI.run(this.allSectors, 'sectors_table', this.tableName);
        }
        //console.log('Liste response', sectorResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async createSector() {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequestService.create(this.createSectorForm.value).subscribe(
      (sectorResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'create_sector_modal');
        this.createSectorForm.reset();
        sectorResponse.data['enabled'] = 1;
        this.allSectors.unshift(sectorResponse.data);
        setTimeout(() => {
          // this.reassignRow(sectorResponse.data, sectorResponse.data);
          // UI.rerender(this.tableName, this.allSectors);

        }, 500);
        this.notification.success(`${sectorResponse.data.name} successfully created!`);

        //console.log('Create response', sectorResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async updateSector() {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequestService.update(this.sectorToEdit['id'], this.updateSectorForm.value).subscribe(
      (sectorResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'update_sector_modal');
        this.reassignRow(this.sectorToEdit, sectorResponse.data);
        this.notification.success(`${this.sectorToEdit.name}  updated!`);

      },
      (error) => {

        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }


  public async toggleSector(sector) {

    const sectorData = {...sector};
    let toggleMsg = `activated!`;
    sectorData['enabled'] = +sector['enabled'] === 1 ? 0 : 1;
    setTimeout(() => {
      toggleMsg = (sectorData['enabled']) ? toggleMsg : `de${toggleMsg}`;
    }, 10);
    await  this.dealroomsRequestService.toggleEntity(sectorData).subscribe(
      (sectorResponse) => {
        this.reassignRow(sector, sectorResponse.data);
        this.notification.success(`${sector.name} successfully ${toggleMsg}`);

      },
      (error) => {
        // $(`#${event.target.id}`)[0].click();
        this.notification.error(`${sector.name} could not be ${toggleMsg}`, error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async deleteSector(sector) {
    Swal.fire({
      title: `You are about to delete ${sector.name}!`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        sector['deleting'] = true;
        this.dealroomsRequestService.deleteEntity(sector['id']).subscribe(
          (sectorDeletedResponse) => {
            this.reassignRow(sector, sectorDeletedResponse, false);
            this.notification.success(`${sector.name} successfully deleted!`);

          },
          (error) => {
            sector['deleting'] = false;
            // $(`#${event.target.id}`)[0].click();
            //console.log('An Error Occurred', error);
            this.notification.error(`${sector.name} could not be deleted`, error);

          }
        );
      }
    });


  }

  public openEditModal(sector) {
    this.updateSectorForm.patchValue(sector);
    this.sectorToEdit = {...sector};
    this.triggerModal('open', 'update_sector_modal');
  }

  public reassignRow(sector, data, update = true) {
    if (!update) {
      const sectors = this.allSectors.filter((r, index) => {
        return r['id'] !== sector['id'];
      });
      setTimeout(() => {
        this.allSectors = this.deepCopy(sectors);
      }, 100);
    }
    //console.log('logging sector and data ', sector, data);
    this.allSectors.forEach((rl, index) => {
      if (rl['id'] === sector['id']) {
        this.allSectors[index] = data;
      }
    });
  }

}
