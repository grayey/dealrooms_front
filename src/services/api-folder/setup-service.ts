import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
// import {ResolveApiUrls} from '../../shared/magic-methods/resolveApiUrls';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SetupService {

  constructor(private apiService: ApiHandlerService) {

  }

  /*
  * Categories Section
  * */

  /**
   * This method retrieves all categories
   * and returns an observable stream
   */
  public getAllCategories(): Observable<any> {
    return this.apiService.get('categories');
  }


  public createCategory(data) {
    return this.apiService.post('categories', data);
  }

  public updateCategory(data) {
    const path = `categories/${data['id']}`;
    return this.apiService.put(path, data);
  }


  /*
  * Availabilities Section
  * */

  /**
   * This method retrieves all categories
   * and returns an observable stream
   */
  public getAllAvailabilities(): Observable<any> {
    return this.apiService.get('availabilities');
  }


  public createAvailability(data) {
    return this.apiService.post('availabilities', data);
  }


  public updateAvailability(data) {
    const path = `availabilities/${data['id']}`;
    return this.apiService.put(path, data);
  }


  /**
   * Mentors Section
   */


  /**
   * This method retrieves all Mentors
   * and returns an observable stream
   */

  public getAllMentors(): Observable<any> {
    return this.apiService.get('mentors');
  }


  public createMentor(data): Observable<any> {
    return this.apiService.post('mentors', data);

  }

  public assignMentee(data, mentorId): Observable<any> {
    const path = `mentors/${mentorId}/assign-mentees`;
    return this.apiService.post(path, data);

  }

  /**
   * This method retrieves all Mentees
   * and returns an observable stream
   */

  public getAllMentees(): Observable<any> {
    return this.apiService.get('mentees');
  }

  public getMyMentees(): Observable<any> {
    const path = `mentors/my-mentees`;
    return this.apiService.get(path);
  }


  public createMentee(data): Observable<any> {
    return this.apiService.post('mentees', data);

  }

  /**
   * This method retrieves all Materials
   * and returns an observable stream
   */

  public getAllMaterials(): Observable<any> {
    return this.apiService.get('materials');
  }


  public createMaterial(data, isFile = false): Observable<any> {
    if (isFile) {
      const fileData = data['file_obj'];
      delete  data['file_obj'];
      return this.apiService.postBulkFile(data, fileData, 'materials');
    }
    return this.apiService.post('materials', data);

  }
}


