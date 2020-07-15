import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class FeaturedService {

  constructor(private apiHandler: ApiHandlerService) {
  }

  public DEFAULT_URL = environment.API_URL;

  /**
   * Get all contacts function
   * @returns {Observable<any>}
   */
  public getAllContacts(): Observable<any> {
    return this.apiHandler.get(`contact-detail`);
  }

  /**
   * Gets User's dashboard information
   * @returns {Observable<any>}
   */
  public getUserDashboard(institutionName, loadOther = false): Observable<any> {
    const path = (institutionName && loadOther) ? `dashboard/${institutionName}` : 'dashboard';
    return this.apiHandler.get(path);
  }

  /**
   * gets all fraud techniques
   * @param userObject
   * @returns {Observable<any>}
   */
  public getContactById(contactId): Observable<any> {
    return this.apiHandler.get(`contact-detail/${contactId}`);

  }

  /**
   *
   * @param contactData
   * @returns {Observable<any>}
   * Creates a new fraud technique
   */

  public createContact(contactData): Observable<any> {
    return this.apiHandler.post(`contact-detail`, contactData);
  }

  /**
   *
   * @param contactData
   * @returns {Observable<any>}
   * updates a specific fraud technique
   */

  public updateContact(contactData): Observable<any> {
    return this.apiHandler.put(`contact-detail`, contactData);
  }

  /**
   *
   * @param contactData
   * @returns {Observable<any>}
   *updates a specific contact detail
   */

  public toggleContact(contactId): Observable<any> {
    const data = {id: contactId};
    return this.apiHandler.put(`contact-detail/toggle`, data);
  }

  /**
   * gets all fraud types
   * @param userObject
   * @returns {Observable<any>}
   */
  public getAllFraudtypes(): Observable<any> {
    return this.apiHandler.get(`${this.DEFAULT_URL}/fraud-type`);

  }

  /**
   *
   * @param fraudTypeData
   * @returns {Observable<any>}
   * Creates a new fraud type
   */

  public createFraudtype(fraudTypeData): Observable<any> {
    return this.apiHandler.post(`${this.DEFAULT_URL}/fraud-type`, fraudTypeData);
  }

  /**
   *
   * @param fraudTypeData
   * @returns {Observable<any>}
   * updates a specific fraud type
   */

  public updateFraudtype(fraudTypeData): Observable<any> {
    return this.apiHandler.put(`${this.DEFAULT_URL}/fraud-type`, fraudTypeData);
  }


}
