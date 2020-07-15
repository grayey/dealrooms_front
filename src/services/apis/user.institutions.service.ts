import { Injectable } from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class UsersInstitution {

  constructor(private apiHandler: ApiHandlerService) { }

  public USER_URL = environment.API_URL.base;

  /**
   * Get all institutions
   * @returns {Observable<any>}
   */
  public getAllInstitutions = (): Observable<any> => {
    return this.apiHandler.get(`${this.USER_URL}`);
  }

  /**
   * create new user function
   * @param institutionObject
   * @returns {Observable<any>}
   */
  public createInstitution = (institutionObject: any): Observable<any> => {
    return this.apiHandler.post(`${this.USER_URL}`, institutionObject);
  }

  /**
   * @Desc Update user institution
   * @param data
   * @returns {Observable<any>}
   */
  public updateInstitution = (data: any): Observable<any> => {
    return this.apiHandler.put(`${this.USER_URL}`, data);
  }
}
