import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class ConfigService {

    constructor(private apiHandler: ApiHandlerService) {
    }

    public CONFIG_URL = environment.API_URL.base;

    /**
     * Get all fraudChannels function
     * @returns {Observable<any>}
     */
    public getAllFraudChannels(): Observable<any> {
        const path = `${this.CONFIG_URL}/fraud-channel`;
        return this.apiHandler.get(path);
    }

    /**
     * gets all fraud techniques
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllFraudtechniques(channel=null): Observable<any> {
        const path = (channel) ? `${this.CONFIG_URL}/fraud-technique?param=${channel}` : `${this.CONFIG_URL}/fraud-technique`;
        return this.apiHandler.get(path);

    }

    /**
     *
     * @param fraudTechniqueData
     * @returns {Observable<any>}
     * Creates a new fraud technique
     */

    public createFraudtechnique(fraudTechniqueData): Observable<any> {
        return this.apiHandler.post(`${this.CONFIG_URL}/fraud-technique`, fraudTechniqueData);
    }

    /**
     *
     * @param fraudTechniqueData
     * @returns {Observable<any>}
     * updates a specific fraud technique
     */

    public updateFraudtechnique(fraudTechniqueData): Observable<any> {
        return this.apiHandler.put(`${this.CONFIG_URL}/fraud-technique`, fraudTechniqueData);
    }

    /**
     * gets all fraud types
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllFraudtypes(channel=null): Observable<any> {
        const path = (channel) ? `${this.CONFIG_URL}/fraud-type?param=${channel}` : `${this.CONFIG_URL}/fraud-type`;
        return this.apiHandler.get(path);

    }

    /**
     *
     * @param fraudTypeData
     * @returns {Observable<any>}
     * Creates a new fraud type
     */

    public createFraudtype(fraudTypeData): Observable<any> {
        return this.apiHandler.post(`${this.CONFIG_URL}/fraud-type`, fraudTypeData);
    }

    /**
     *
     * @param fraudTypeData
     * @returns {Observable<any>}
     * updates a specific fraud type
     */

    public updateFraudtype(fraudTypeData): Observable<any> {
        return this.apiHandler.put(`${this.CONFIG_URL}/fraud-type`, fraudTypeData);
    }

    /**
     * gets all Lookups
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllLookups(): Observable<any> {
        return this.apiHandler.get(`${this.CONFIG_URL}/lookup`);

    }

    /**
     * gets all Lookups
     * @param userObject
     * @returns {Observable<any>}
     */
    public getLookUpByName(lookUpName): Observable<any> {
        return this.apiHandler.get(`${this.CONFIG_URL}/lookup/${lookUpName}`);

    }

    /**
     *
     * @param LookupData
     * @returns {Observable<any>}
     * Creates a new fraud type
     */

    public createLookup(LookupData): Observable<any> {
        return this.apiHandler.post(`${this.CONFIG_URL}/lookup`, LookupData);
    }

    /**
     *
     * @param LookupData
     * @returns {Observable<any>}
     * updates a specific fraud type
     */

    public updateLookup(LookupData): Observable<any> {
        return this.apiHandler.put(`${this.CONFIG_URL}/lookup`, LookupData);
    }

    /**
     * gets all Countries
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllCountries(): Observable<any> {
        return this.apiHandler.get(`country`);

    }

    /**
     * gets all States
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllStates(): Observable<any> {
        return this.apiHandler.get(`state`);

    }
    /**
     * gets states based on country
     * @param userObject
     * @returns {Observable<any>}
     */
    public getStateByCountyrId(countryId): Observable<any> {
        return this.apiHandler.get(`${this.CONFIG_URL}/state/${countryId}`);

    }

    /**
     * gets all Lgas
     * @param userObject
     * @returns {Observable<any>}
     */
    public getAllLgas(stateId): Observable<any> {
        return this.apiHandler.get(`/state/${stateId}/lga`);

    }
    /**
     * gets Lga based on state
     * @param userObject
     * @returns {Observable<any>}
     */
    public getLgaByStateId(stateId): Observable<any> {
        return this.apiHandler.get(`${this.CONFIG_URL}/state/${stateId}`);

    }



}
