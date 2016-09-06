import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as R from 'ramda';

import { KalturaAPIConfig, KalturaMultiRequest,  KalturaAPIClient,  } from '@kaltura/kapi';
import { UserService } from '@kaltura/kapi/dist/user';
import { PermissionService, KalturaPermissionFilterTypes, IKalturaPermissionFilter } from '@kaltura/kapi/dist/permission';

import {InMemoryAppStorage} from "../app-storage.service";
import {AppConfig} from "../config/app-config.service";
import {AppUser} from "./app-user";

@Injectable()
export class UserAuthentication {

    private _appUser : AppUser;

    constructor(private kalturaAPIClient : KalturaAPIClient,
                private appConfig : AppConfig,
                private appStorage : InMemoryAppStorage,
                private kalturaAPIConfig : KalturaAPIConfig) {
        this._appUser = new AppUser();
    }

    get appUser() : AppUser{
        return this._appUser;
    }

    login(username : string, password : string, rememberMe = false) : Observable<boolean> {

        const { expiry, privileges }  = this.appConfig.get('core.kaltura');

        const multiRequest = new KalturaMultiRequest();

        // TODO [kmc] remove
        this.appStorage.removeFromSessionStorage('auth.login.avoid');  // since we currently store actual login/password, we only allow session storage

        multiRequest.addRequest(UserService.loginByLoginId(username, password, { expiry, privileges}));
        multiRequest.addRequest(UserService.getByLoginId(username));
        multiRequest.addRequest(PermissionService.list( {
            filter :  {
                type : KalturaPermissionFilterTypes.KalturaPermissionFilter,
                values : <IKalturaPermissionFilter> {
                    nameEqual: 'FEATURE_DISABLE_REMEMBER_ME'
                }
            }}
        ));
        multiRequest.addRequest(UserService.getPartnerById('{2:result:partnerId}'));

        this.clearBrowserCache();


            return <any>multiRequest.execute(this.kalturaAPIClient,false)
            .do(
                (results) => {
                    const ks  = results[0];
                    const generalProperties = R.pick(['id', 'partnerId', 'fullName', 'firstName', 'lastName', 'roleIds', 'roleNames', 'isAccountOwner'])(results[1]);
                    const permissions = R.map(R.pick(['id','type','name','status']))(results[2].objects);
                    const partnerProperties = R.pick(['name', 'partnerPackage'])(results[3]);

                    this.appUser.ks = ks;
                    this.appUser.permissions = permissions;
                    this.appUser.partnerInfo = partnerProperties;
                    Object.assign(this.appUser, generalProperties);

                    this.updateBrowserCache(rememberMe);

                    // TODO [kmc] temporary solution
                    this.kalturaAPIConfig.ks = ks;

                    // TODO [kmc] should remove this logic - for demonstration purposes only
                    const value = `${username};${password}`;
                    console.warn('The login form currently store the loginId and password in session memory (!!!) this is temporary behavior that will be removed during Sep 2016');
                    this.appStorage.setInSessionStorage('auth.login.avoid',value);  // since we currently store actual login/password, we only allow session storage

                }).map((results) => {
                return true;
            });
    }

    logout() {
        this.appUser.ks = null;
        this.kalturaAPIConfig.ks = null;
        this.clearBrowserCache();
        this.appStorage.removeFromSessionStorage('auth.login.avoid');
        // TODO [kmcng] emit event instead and move logic to kmc shell
        //this.router.navigateByUrl('/');
    }

    private clearBrowserCache() {
        this.appStorage.removeFromSessionStorage('auth.ks');
        this.appStorage.removeFromLocalStorage('auth.ks');
    }

    private updateBrowserCache(rememberMe:Boolean):void {
        this.clearBrowserCache();
        if (rememberMe) {
            this.appStorage.setInLocalStorage('auth.ks',this.appUser.ks);
        } else {
            this.appStorage.setInSessionStorage('auth.ks',this.appUser.ks);
        }
    }

    public loginAutomatically() : Observable<any>
    {
        if (this.appUser.ks) {
            return Observable.of(true);
        }

        // TODO [kmc] should remove this logic - for demonstration purposes only
        const loginToken = this.appStorage.getFromSessionStorage('auth.login.avoid');  // since we currently store actual login/password, we only allow session storage
        if (loginToken) {
            console.warn('The login form currently extract the loginId and password in session memory (!!!) this is temporary behavior that will be removed during Sep 2016');
            const loginTokens = loginToken.split(';');
            return this.login(loginTokens[0],loginTokens[1],false);
        }

        return Observable.throw({code : 'no_session_found'});
    }
}
