import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';


@Injectable()
export class UserPermissionsService {

  constructor(private userPermissionsService: ApiHandlerService,
              private apiHandler: ApiHandlerService) {
  }

  public ROLE_URL = environment.API_URL.base;
  public TASK_URL = environment.API_URL.base;

  /**
   * This Section is for Role APIS
   */


  /**
   *
   * @returns {Observable<any>}
   * This method returns all roles
   */
  public getAllRoles() {
    return this.apiHandler.get(`${this.ROLE_URL}?pageNumber=1&pageSize=5`);
  }


  /**
   *
   * @param roleData
   * @returns {Observable<any>}
   * This method creates a new role
   */
  public createRole(roleData) {
    return this.apiHandler.post(this.ROLE_URL, roleData);
  }

  public updateRole(roleData) {
    return this.apiHandler.put(this.ROLE_URL, roleData);
  }

  public toggleRole(roleId): Observable<any> {
    const data = {id: roleId};
    return this.apiHandler.put(`${this.ROLE_URL}/toggle`, data);
  }


  /**
   * This section pertains to audit per role
   */


  /**
   *
   * @param roleId
   * @returns {Observable<any>}
   * This method gets audit that belong to a certain role
   */

  public getTasksByRoleId(roleId): Observable<any> {
    return this.apiHandler.get(`${this.ROLE_URL}/${roleId}/task`);
  }

  /**
   *
   * @param roleId
   * @returns {Observable<any>}
   * This method gets a role by it's ID
   */

  public getRoleById(roleId): Observable<any> {
    return this.apiHandler.get(`${this.ROLE_URL}/${roleId}`);
  }


  public getActivatedRole(type: string): Observable<any> {
    return this.apiHandler.get(`${this.ROLE_URL}/activated/${type}`);
  }

  /********** This section handles audit ***************/

  /**
   *
   * @returns {Observable<any>}
   * This method gets all audit
   */

  public getAllTasks(): Observable<any> {
    return this.apiHandler.get(`${this.TASK_URL}`);
  }


  /**
   *
   * @returns {Observable<any>}
   * This method assigns audit to a role
   */
  public assignTasksToRole(taskData): Observable<any> {
    return this.apiHandler.put(`role/${this.TASK_URL}`, taskData);

  }

  /**
   * Get all audits function
   * @returns {Observable<any>}
   */
  public getAllAudits(): Observable<any> {
    return this.apiHandler.get(`audit`);
  }

}
