import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import {TokenService} from '../token.service';

@Injectable()
export class UsersService {

  constructor(private apiHandler: ApiHandlerService,
              private token: TokenService) {
  }

  public USER_URL = environment.API_URL.base;
  public replayProfileImage = new ReplaySubject<any>(1);
  public BULK_TEMPLATE_LINK = `${environment.API_URL.base}${this.USER_URL}/template?vim=${this.token.getAuthUserToken()}`;
  public BULK_UPLOAD_LINK = `${environment.API_URL.base}${this.USER_URL}/bulk?vim=${this.token.getAuthUserToken()}`;
  /**
   * @Desc Get all users function
   * @returns {Observable<any>}
   */
  public getAllUsers = (): Observable<any> => {
    return this.apiHandler.get(`${this.USER_URL}`);
  }

  /**
   * @Desc create new user function
   * @param userObject
   * @returns {Observable<any>}
   */
  public createUsers = (userObject: any): Observable<any> => {
    delete userObject['telephone'];
    return this.apiHandler.post(`${this.USER_URL}`, userObject);
  }

  /**
   * @Desc Toggle user status
   * @param {number} userId
   * @returns {Observable<any>}
   */
  public toggleUser = (userId: number): Observable<any> => {
    const body = {id: userId};
    return this.apiHandler.put(`${this.USER_URL}/toggle`, body);
  }

  /**
   * @Desc Get userById
   * @param {number} userId
   * @returns {Observable<any>}
   */
  public getUserById = (userId: number): Observable<any> => {
    return this.apiHandler.get(`${this.USER_URL}/${userId}`);
  }

  /**
   * @Desc reset selected user's password
   * @param userId
   * @returns {Observable<any>}
   */
  public resetUserPassword(userId) {
    const resetObject = {id: userId};
    return this.apiHandler.put('password/reset', resetObject);
  }

  /**
   * @Desc Update selected user
   * @param userObject
   * @returns {Observable<any>}
   */
  public updateUsers = (userObject: any): Observable<any> => {
    delete userObject['userType'];
    return this.apiHandler.put(`${this.USER_URL}`, userObject);
  }


  /**
   * @Desc set profile photo image
   * @param {string} user
   */
  public setProfilePic = (src: string): void => {
      this.replayProfileImage.next(src);
  }

  /**
   * get profile image
   * @returns {Observable<any>}
   */
  public getProfilePic =  (): Observable<any>  => {
    return this.apiHandler.get(`${this.USER_URL}/image`);
  }

  /**
   *
   * @param {sting} base64
   * @returns {any}
   */
  public updateProfilePic = (base64: string): any => {
    const data = {value: base64};
    return this.apiHandler.put(`${this.USER_URL}/image`, data);
  }

  /**
   *
   * @param format
   * @returns {string}
   */
  public downloadUserFormat(format): string {
    const EXPORT_LINK = `${environment.API_URL.base}${this.USER_URL}/download?downloadType=${format}?&vim=${this.token.getAuthUserToken()}`;
    return EXPORT_LINK;
  }

  public uploadBulkUser(file): any {
    // return this.apiHandler.postBulkReportFile(file, this.BULK_UPLOAD_LINK);
  }
}

