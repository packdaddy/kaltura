import { Injectable } from '@angular/core';

import {KalturaRequest} from "../kaltura-request";

export class PartnerService {

    constructor(){
        throw new Error('This class should not be initialized (you should use its static functions to create new requests)');
    }

    static get(id : string, options? : { ks? : string }) :  KalturaRequest<string>
    {
      const parameters : any = {
        id : id
      };

      if (options && options.ks) {
        parameters.ks = options.ks;
      }

      return new KalturaRequest<string>('partner','get',parameters);
    }
}
