import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {Observable} from 'rxjs';
import {TokenService} from '../token.service';

// import {AngularFireStorage} from '@angular/fire/storage';

@Injectable()
export class DealroomsRequestService {

  public static entity: string;
  public static REGENERATE_CERTIFICATE_MODE = 0;

  private entityEndpoints = {
    role: {
      create: 'roles',
      list: 'roles',
      toggle: 'roles/toggle',
      update: 'roles',
      delete: 'roles',
      assign: 'roles/assign-tasks'
    },
    sector: {
      create: 'sectors',
      list: 'sectors',
      toggle: 'sectors/toggle',
      update: 'sectors',
      delete: 'sectors',
    },
    deal: {
      create: 'deals',
      list: 'deals',
      toggle: 'deals/toggle',
      update: 'deals',
      delete: 'deals',
    },
    user: {
      create: 'users',
      list: 'users',
      toggle: 'users/toggle',
      update: 'users',
      delete: 'users/travel',
      view: 'users/travel',
      assign: '',
      tasksById: 'users'
    },
    dealowner: {
      list: 'dealowners',
      update: 'dealowner',
      view: 'dealowner/travel',
    },
    dealrunner: {
      list: 'dealrunners',
      update: 'dealrunner',
      view: 'dealrunner/travel',
    },
    investor: {
      list: 'investors',
      update: 'investor',
      view: 'investor/travel',
    },
    company: {
      list: 'companies',
      update: 'companies',
      view: 'companies/travel',
    },

    fundtype: {
      list: 'fundtypes',
      update: 'fundtypes',
      view: 'fundtypes/travel',
    },

    auth: {
      create: 'login',
      logout: 'logout',
      refund: 'refund'
    },
    userprofile: {
      create: 'users/profile',
      list: 'users/profile',
      toggle: 'users/profile/toggle',
      update: 'users/profile',
      delete: 'users/profile',
      upload: 'users/profile/upload',
      assign: ''
    },
    travel: {
      create: 'users/travel',
      list: 'users/travel',
      toggle: 'users/profile/toggle',
      update: 'users/travel',
      delete: 'users/travel',
      upload: 'users/travel/upload',
      assign: ''
    },
    travel_payment: {
      create: 'users/travel/payment',
      list: 'users/travel',
      toggle: 'users/profile/toggle',
      update: 'users/travel/payment',
      delete: 'users/travel',
      upload: 'users/travel/upload',
      assign: ''
    },

    transaction: {
      create: 'users/travel/payment',
      list: 'users/travel/payment',
      toggle: 'users/profile/toggle',
      update: 'users/travel/payment',
      delete: 'users/travel',
      upload: 'users/travel/upload',
      assign: ''
    },
    task: {
      list: 'tasks',
      generate: 'tasks/generate',
      assign: ''
    }
  };

  constructor(private apiHandler: ApiHandlerService,
              private token: TokenService,
              // private storage: AngularFireStorage
  ) {

  }

  public getActiveDeals() {
    return this.apiHandler.get('active-deals');
  }

  public getActiveDealsByUserCategory(userRef) {
    return this.apiHandler.get(`active-deals-by-user/${userRef}`);
  }

  public getDealById(slug) {
    return this.apiHandler.get(`deal-details/${slug}`);
  }

  public watchDeal(deal) {
    const path = `watch-deal/${deal.id}`;
    return this.apiHandler.put(path, deal);
  }

  public investDeal(deal) {
    const path = `invest-deal/${deal.id}`;
    return this.apiHandler.put(path, deal);
  }

  public viewDealInterests(deal) {
    const path = `deal-investors/${deal.id}`;
    return this.apiHandler.get(path);
  }

  public grantUserAccess(accessData) {
    const path = `toggle-access/${accessData.id}`;
    return this.apiHandler.put(path, accessData);
  }

  public closeDeal(closureData) {
    const path = `close-deal/${closureData.id}`;
    return this.apiHandler.put(path, closureData);
  }

  public saveFinancierProfile(profileData) {
    const path = `update-financier/${profileData.id}`;
    return this.apiHandler.put(path, profileData);
  }

  public saveDealOwnerProfile(profileData) {
    const path = `update-dealowner/${profileData.id}`;
    return this.apiHandler.put(path, profileData);
  }


  public getAllRecipients(dealSlug) {
    const path = `recipients/${dealSlug}`;
    return this.apiHandler.get(path);
  }

  public createMessage(message) {
    const path = `create-message`;
    return this.apiHandler.post(path, message);
  }

  public createAppMessage(messageData) {
    const path = `app-message`;
    return this.apiHandler.post(path, messageData);
  }



  /***
   * This section is the Portal Service
   */

  public create(data) {
    return this.apiHandler.post(this.entityEndpoints[DealroomsRequestService.entity].create, data);
  }


  public update(entityId, entity) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].update;
    const path = `${url}/${entityId}`;
    return this.apiHandler.put(path, entity);
  }

  public list(id = null) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].list;
    const path = id ? `${url}/${id}` : url;
    return this.apiHandler.get(path);
  }

  public listInvestorDeals(id) {
    const url = 'investments';
    const path = id ? `${url}/${id}` : url;
    return this.apiHandler.get(path);
  }

  public getAllDocuments() {
    const url = 'documents';
    return this.apiHandler.get(url);
  }

  public getAllMessages(id = null) {
    let url = 'app-message';
    url = id ? `${url}/${id}` : url;
    return this.apiHandler.get(url);
  }


  public getUserNotifications(id, all = false) {
    const prefix = all ? 'all-notifications' : 'unviewed';
    const path = `${prefix}/${id}`;
    return this.apiHandler.get(path);
  }

  public view(compareId, id) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].view;
    const path = `${url}/${compareId}/view/${id}`;
    return this.apiHandler.get(path);
  }

  public upload(id = null, file, data) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].upload;
    const path = id ? `${url}/${id}` : url;
    return this.apiHandler.postBulkFile(data, file, path);
  }

  public toggleEntity(entity) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].toggle;
    const path = `${url}/${entity['id']}`;
    return this.apiHandler.put(path, entity);

  }

  public deleteEntity(entityId) {
    const url = this.entityEndpoints[DealroomsRequestService.entity].delete;
    const path = `${url}/${entityId}`;
    return this.apiHandler.delete(path);

  }

  public generateTasks() {
    const url = this.entityEndpoints[DealroomsRequestService.entity].generate;
    return this.apiHandler.get(url);
  }

  public assignRolePermissions(roleId, data) {
    const url = `${this.entityEndpoints[DealroomsRequestService.entity].assign}/${roleId}`;
    return this.apiHandler.post(url, data);
  }

  public updateUserLogo(data) {
    const url = `profile/upload/${data.id}`;
    return this.apiHandler.put(url, data);
  }

  public saveInsurance(id, data, dataType: string, create = false) {
    let userId = id;
    switch (dataType.toLowerCase()) {
      case 'personal':
        if (create) {
          DealroomsRequestService.entity = 'user';
          return this.create(this.formatPublicUserData(data));
        }
        return this.update(userId, data);
      case 'travel':
        if (DealroomsRequestService.REGENERATE_CERTIFICATE_MODE.toString() !== '0') {
          data['user_id'] = userId;
          // alert('updating travel');
          //  DealroomsRequestService.REGENERATE_CERTIFICATE_MODE is actually the travel id. Abeg i don't have strength!
          return this.updateTravel(DealroomsRequestService.REGENERATE_CERTIFICATE_MODE, data);
        }
        return this.createTravel(userId, data);
      default:
        return Observable.from('Unknown action!');
    }

  }

  public createTravel(id, data) {
    const travelData = {...data};
    travelData['user_id'] = id;
    return this.create(travelData);
  }

  public updateTravel(id, data) {
    const travelData = {...data};
    return this.update(id, travelData);
  }

  public updateUserCredit(data) {
    return this.apiHandler.post('users/credit', data);
  }

  public logUserOut(data) {
    return this.apiHandler.post(this.entityEndpoints[DealroomsRequestService.entity].logout, data);
  }

  public getUserTasksById(id) {
    const url = `${this.entityEndpoints[DealroomsRequestService.entity].tasksById}/${id}`;
    return this.apiHandler.get(url);
  }

  public async cloudUpload(path, file) {
    // const fileRef = this.storage.ref(path);
    // return await this.storage.upload(path, file).snapshotChanges();
  }

  /**
   * This method is called when the transaction is complete
   * @param data
   */
  public completeGibsTransaction(data) {
    return this.apiHandler.post('complete-transaction', data);
  }


  /**
   * This method is called when the transaction is complete
   * @param data
   */
  public updateGibsTransaction(data, travelId) {
    const url = `${this.entityEndpoints[DealroomsRequestService.entity].update}/${travelId}`;
    return this.apiHandler.put(url, data);
  }

  /**
   *
   */

  public requestRefund(data) {

    const url = this.entityEndpoints.auth.refund;
    return this.apiHandler.post(url, data);
  }

  public resetForgotPasswordByEmail(data) {
    const url = 'forgot-password';
    return this.apiHandler.post(url, data);
  }

  public changeUserPassword(data) {
    const url = 'change-password';
    return this.apiHandler.post(url, data);
  }

  public checkValidLink(data) {
    const url = 'valid-link';
    return this.apiHandler.post(url, data);
  }

  public getOverallDashboard() {
    return this.apiHandler.get('dashboard');
  }

  public getDashboardByUer(id) {
    const url = `dashboard/${id}`;
    return this.apiHandler.get(url);
  }

  public listFundTypes() {
    const url = this.entityEndpoints.fundtype.list;
    return this.apiHandler.get(url);
  }

  public listSectors() {
    const url = this.entityEndpoints.sector.list;
    return this.apiHandler.get(url);
  }

  private formatPublicUserData(data) {
    const userData = {
      'name': `${data['last_name']} ${data['other_names']}`,
      'user_type': 'customer',
      'email': data['email'],
      'phone': data['phone'],
      'last_name': data['last_name'],
      'other_names': data['other_names'],
    };
    //console.log('Public user Data', data);
    return userData;
  }
}
