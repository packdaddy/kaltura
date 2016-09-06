import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import {AppConfig} from "../config/app-config.service";
import {InMemoryAppStorage} from "../app-storage.service";

@Injectable()
export class KMCLanguage {

    // private _initialized$ : ReplaySubject<boolean>;
    private dic: any;
    private currentLanguage: any = {};

    constructor(private http: Http, private appConfig: AppConfig, private appStorage: InMemoryAppStorage) {
    }

    getDefaultLanguage() : any{
      let defaultLanguage = 'en_US';
      // try getting last selected language from local storage
      if (this.appStorage.getFromLocalStorage('kmc_lang') !== null) {
        let storedLanguage: string = this.appStorage.getFromLocalStorage('kmc_lang');
        if (this.getLanguageById(storedLanguage) !== undefined) {
          this.currentLanguage = this.getLanguageById(storedLanguage);
        }
      }

      // if wasn't found in local storage, try getting from browser language settings
      if (R.isEmpty(this.currentLanguage)) {
        let browserLanguage: string = navigator.language.split('-').join('_');
        if (this.getLanguageById(browserLanguage) !== undefined) {
          this.currentLanguage = this.getLanguageById(browserLanguage);
        }
      }

      // if browser language is not supported, use the defaulr en_US key
      if (R.isEmpty(this.currentLanguage)) {
        this.currentLanguage = this.getLanguageById(defaultLanguage);
      }

      if (this.currentLanguage && this.currentLanguage.id) {
        this.setLanguage(this.currentLanguage.id);
      } else {
        this.currentLanguage = {};
        console.log('Error getting default language');
      }
      return this.currentLanguage;
    }

    setLanguage(languageId : any) : any {
      this.appStorage.setInLocalStorage('kmc_lang', languageId);
      this.currentLanguage = this.getLanguageById(languageId);
      this.loadDictionary(this.currentLanguage.source).subscribe((dictionary : any) =>
        this.dic = dictionary
      , (err : any) => console.log(err));
      return this.currentLanguage;
    }

    getLanguageById(langId : any) : any {
      return R.find(R.propEq('id', langId))(this.appConfig.get('core.locales'));
    }

    loadDictionary(path : any) : any {
      return this.http.get(path)
        .map(function(data){
          return data.json();
        });
    }

    get(key : any) : any {
      return this.dic && this.dic[key] ? this.dic[key] : key;
    }

};
