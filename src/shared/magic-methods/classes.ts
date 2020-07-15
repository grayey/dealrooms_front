import {AbstractControl} from '@angular/forms';
import {Cache} from '../../utils/cache';
import {Entities} from './entities';
import {saveAs} from 'file-saver';
// import {st} from '@angular/core/src/render3';

declare const $: any;


export class MagicClasses {

  public percentageInFraction;
  public percentageUpload;
  public dropdownList = [];
  public selectedItems = [];
  public isCard = false;
  public dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public loaders = {
    processing: false
  };
  public messages = {
    create: 'Save',
    update: 'Update'
  };

  public staffActivities = {
    create: false,
    update: false,
    _delete: false,
    toggle: false
  };

  public today = new Date().toDateString();

  constructor() {
  }

  public resetLoaderAndMessage() {
    this.loaders.processing = !this.loaders.processing;
    this.messages.create = (this.loaders.processing) ? 'Saving...' : 'Save';
    this.messages.update = (this.loaders.processing) ? 'Updating' : 'Update';

  }

  public goBack() {
    window.history.back();
  }

  public setClass(status) {
    if (!status) {
      return 'badge badge-danger';
    }
    const statusName = status.toString();
    if (statusName) {
      switch (statusName.toLowerCase()) {
        case '1':
          return 'badge badge-info';
        case '2':
          return 'badge badge-success';
        case '0':
          return 'badge badge-danger';
      }
    }
  }

  public setClassByNumber(entity): string {
    let badgeLabel = (entity['status']) ? 'badge badge-success pull-right' : 'badge badge-danger pull-right';
    badgeLabel = entity['deleting'] ? 'badge badge-warning pull-right' : badgeLabel;
    return badgeLabel;

  }

  public dealLabel(status) {
    if (!status) {
      return 'Inactive';
    }
    const statusName = status.toString();
    switch (statusName.toLowerCase()) {
      case '1':
        return 'Open';
      case '2':
        return 'Closed';
      case '0':
        return 'Inactive';
    }
  }

  public setStatusLabel(enabled) {
    return (enabled) ? 'Activated' : 'Deactivated';

  }


  public triggerModal(action: string, modalId: string, modalIsStatic?: string) {
    if (modalIsStatic) {
      $(`#${modalId}`).modal({
        backdrop: 'static',
        keyboard: false
      });
    }
    (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
    // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
    // });
  }

  public triggerOverlay(action: string, overlayId: string) {
    (action === 'open') ? this.openOverlay(overlayId) : this.closeOverlay(overlayId);
  }

  public selectWhereId(data: any[], key, id) {
    const dataItem: any[] = [];
    data.forEach(item => {
      const itemKey = parseInt(item[key], 10);
      const itemId = parseInt(id, 10);
      if (itemKey === itemId) {
        dataItem.push(item);
      }
    });
    return dataItem[0];
  }

  public filterDealActivites(deals: any[]): any[] {
    const authUser = Cache.get('AUTH_USER');
    const userId = authUser ? authUser['id'] : 0;
    deals.forEach((deal) => {
      deal['investors'] = [];
      deal ['watchers'] = [];
      deal ['accessors'] = [];
      deal['assigned'] = [];
      deal['closed'] = [];


      deal.activities.forEach((activity) => {
        if (activity.investing) {
          deal['investors'].push(activity.interested_user_id);
        }
        if (activity.watching) {
          deal ['watchers'].push(activity.interested_user_id);
        }

        if (activity.accessing === 1) {
          deal ['accessors'].push(activity.interested_user_id);
        }


        if (activity.assigned === 1) {
          deal ['assigned'].push(activity.interested_user_id);
        }

        if (activity.closed) {
          deal['closed'].push(activity.interested_user_id);
        }
      })
      if (deal['watchers'].includes(userId)) {
        deal['user_is_watching'] = true;
      }
      if (deal['investors'].includes(userId)) {
        deal['user_is_investing'] = true;
      }
      if (deal['accessors'].includes(userId)) {
        deal['user_is_accessing'] = true;
      }
      if (deal['assigned'].includes(userId)) {
        deal['user_is_assigned'] = true;
      }
      deal['progress_info'] = this.financierProgressBar(
        deal['watchers'].includes(userId),
        deal['accessors'].includes(userId),
        deal['investors'].includes(userId),
        deal['assigned'].includes(userId),
        deal['closed'].includes(userId),
      );


    })

    return deals;
  }

  public cleanMultiSelect(id) {
    const ids = $(`#${id}`).val() || [];
    const values = ids['map']((r) => {
      return +r.split(':')[1].trim();
    });

    return JSON.stringify(values);

  }


  public processErrors(error): string {
    let errorBody = '';
    const errors = error['error']['errors'];
    if (errors) {
      for (const key in errors) {
        errorBody += errors[key].toString() + '<br>';
      }
    } else if (error['error']['message']) {
      errorBody = error['error']['message'];
    } else if (error['message']) {
      errorBody = error['message'];
    }
    return errorBody;
  }

  public hasRequiredField(abstractControl: AbstractControl): boolean {
    if (abstractControl.validator) {
      const validator = abstractControl.validator({}as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
        if (abstractControl['controls'][controlName]) {
          if (this.hasRequiredField(abstractControl['controls'][controlName])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public setValidationClass(formIsValid, isProfile = false): string {
    const invalidClass = isProfile ? 'btn btn-light text-dark btn-lg waves-effect waves-light' : 'btn btn-info waves-effect waves-light'
    return (formIsValid) ? 'btn btn-success waves-effect waves-light' : 'btn btn-info waves-effect waves-light';
  }

  public setUserPermissions(userPermissions: any[], routeName: string): string[] {
    return userPermissions.filter((userPermission) => {
      return userPermission.route.endsWith(routeName);
    }).map(listPermissions => {
      return listPermissions.route.split('.').join('_');
    });
  }

  // public renderTable(tag, id = ''): void {
  //   this._scriptService.loadScripts(tag, ['src/assets/vendor/datatables/media/js/jquery.dataTables.min.js',
  //     'src/assets/vendor/datatables/media/js/dataTables.bootstrap4.min.js', 'src/assets/js/table-data.min.js']);
  //   setTimeout(() => {
  //     UI.run(id);
  //   }, 100);
  // }

  public deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
  }

  public setProgressBar(percentageUpload) {
    return {
      width: percentageUpload
    };
  }

  public setProgressStatus(percentageUpload) {
    return percentageUpload !== '100%' ? 'progress-bar bg-info' : 'progress-bar bg-success';
  }

  public setDealProgressBar(percentage) {

    return {
      width: `${percentage}%`,
      color: 'white'
    };

  }

  public setDealProgressStatus(step): string {
    let label = 'progress-bar progress-bar-striped progress-bar-animated ';
    const percentageValue = step ? step.toString() : '0';
    switch (percentageValue) {
      case '0':
        label += 'bg-danger';
        break;
      case '1':
        label += 'bg-warning';
        break;
      case '2':
        label += 'bg-primary';
        break;
      case '3':
        label += 'bg-info';
        break;
      case '4':
        label += 'bg-dark';
        break;
      case '5':
        label += 'bg-success';
        break;
      default:
        label += 'bg-secondary'
        break;
    }

    return label;
  }

  public unsetObjectKeys(dataObject, keys) {
    keys.forEach((key) => {
      if (key in dataObject) {
        delete dataObject[key];
      }
    });
    return dataObject;
  }

  public setPercentageUpload(uploadRatio) {
    const {bytesTransferred, totalBytes} = uploadRatio;
    const percentage = Math.round(bytesTransferred / totalBytes * 100);
    this.percentageInFraction = `${Math.round(bytesTransferred / 1000)}KB / ${Math.round(totalBytes / 1000)}KB`;
    this.percentageUpload = `${percentage}%`;
  }

  public getDateDifference(fromDate: string, toDate: string, todayDate = false): string {
    if (!fromDate || !toDate) {
      return '';
    }
    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);
    const Difference_In_Time = date2.getTime() - date1.getTime();
    if (todayDate) {
      let status = '';
      const date3 = new Date();
      const beforeFrom = date1.getTime() > date3.getTime();
      const beforeTo = date2.getTime() > date3.getTime();
      if (beforeFrom) {
        status = 'pending';
      } else if (!beforeFrom && beforeTo) {
        status = 'ongoing';
      } else if (!beforeFrom && !beforeTo) {
        status = 'past';
      }
      return status;
    }
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
    return Difference_In_Days.toString();
  }

  public setUserTasks() {
    const userTasks = Cache.get('USER_TASKS') || [];
    if (userTasks[0] === '*') {//means user is super admin
      return; //then don't check his activities list
    }
    const flattenTasks = userTasks.map(task => {
      return task.name;
    });
    const taskElements = Array.from(document.getElementsByClassName('task')).reverse(); //reversing so that child nodes are seen before parents;
    taskElements.forEach(el => {
      const id = el.id;
      if (!flattenTasks.includes(id)) {
        document.getElementById(id).remove();
      }
    });
  }

  public getAvatar(name: string): string {
    return name ? name.toLowerCase().trim()[0] : 'blank';
  }

  public openOverlay(id) {
    // $(`#${id}`).removeClass('slideOutDown');
    // $(`#${id}`).addClass('slideInUp');
    document.getElementById(id).style.display = 'block';
    document.getElementById(id).style.width = '100%';
    document.getElementById(id).style.height = '100%';
  }

  public closeOverlay(id) {

    // $(`#${id}`).removeClass('slideInUp');
    // $(`#${id}`).addClass('slideOutDown');
    document.getElementById(id).style.width = '0%';
    document.getElementById(id).style.display = 'none';
  }

  public firstOrLast(haystack: any[], position = 'last'): { first: any, last: any, others: any[] } {
    const needleIndex = position.toLowerCase() === 'last' ? haystack.length - 1 : 0;
    const result = {first: {}, last: {}, others: []};
    result[position] = haystack[needleIndex]; // the requested item;
    haystack.splice(needleIndex, 1);
    result.others = haystack;
    return result;
  }

  public scrollIntoView(id) {
    $(`#${id}`)[0].scrollIntoView({behavior: 'smooth',});
  }

  public getAllCountries(): any[] {

    const entity = new Entities();
    const countries = entity.all_countries();
    const allCountries = [];
    for (const key in countries) {
      allCountries.push(countries[key]);
    }

    return allCountries;
  }

  public reRenderTable(UI, data, tableId, tableTitle) {
    UI.rerender(data, tableId, tableTitle);
  }

  public downloadFirebaseFile(doc) {
    const fileName = `${doc['name']}.${doc['type']}`;
    // const file = new File(doc['url'], fileName, {type: "application/octet-stream"});
    saveAs(doc['url'], fileName);
  }


  public financierProgressBar(...args): { progress_bar: any; progress_label: any; progress_class: any; percentage: any; } {
    let progress = 0;
    args.forEach((activity) => {
      if (activity) {
        progress += 1;
      }
    });

    const percentage = progress * 20;
    return {
      progress_bar: this.setFinancierBar(percentage),
      progress_label: this.setFinancierProgressLabel(progress),
      progress_class: this.financierProgress(progress),
      percentage
    }


  }

  public financierProgress(progress) {
    let progresClass = 'progress-bar progress-bar-striped progress-bar-animated ';
    // args.forEach((activity) => {
    //   if (activity) {
    //     progress += 1;
    //   }
    // });
    switch (progress.toString()) {
      case '0':
        progresClass += 'bg-default';
        break;
      case '1':
        progresClass += 'bg-warning';
        break;
      case '2':
        progresClass += 'bg-info';

        break;
      case '3':
        progresClass += 'bg-secondary';

        break;
      case '4':
        progresClass += 'bg-dark';
        break;
      case '5':
        progresClass += 'bg-success';

        break;
    }
    return progresClass;

  }

  public setFinancierBar(percentage) {

    return {
      width: `${percentage}%`,
      color: 'white'
    };

  }

  public setFinancierProgressLabel(stage) {


    const val = stage || '';
    let dealStage = `<small>Stage: `
    switch (val.toString()) {
      case '0':
      case '':
        dealStage += 'No Interest'
        break;
      case '1':
        dealStage += `Watching <i class="mdi mdi-heart"></i>`

        break;
      case '2':
        dealStage += 'Accessing <i class="mdi mdi-key"></i>`'

        break;
      case '3':
        dealStage += 'Investing <i class="fa fa-thumbs-up"></i>`'

        break;
      case '4':
        dealStage += 'Handshake <i class="fa fa-handshake"></i>`'
        break;

      case '5':
        dealStage += 'Complete <i class="fa fa-angle-double-down"></i>`'
        break;
      default:
        dealStage += 'No Interest'
        break;

    }

    return dealStage + `</small>`;


  }


  public getActivityTracker(deal, userId) {
    const activities = deal.activities;
    let activity;
    if (activities) {
      activity = activities.filter((ac) => {
        return ac.interested_user_id == userId;
      })[0];
    }

    return activity ? activity.tracker : '';

  }

  public formatInterestedDealers(interestedDealers: any[]): any[] {
    interestedDealers.forEach((dealer) => {
      dealer['progress_info'] = this.financierProgressBar(
        dealer['watching'], dealer['accessing'], dealer['investing'], dealer['assigned'], dealer['closed']);
    });

    return interestedDealers;
  }
}
