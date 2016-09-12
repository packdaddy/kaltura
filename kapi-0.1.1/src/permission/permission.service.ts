import { URLSearchParams } from '@angular/http';

import {KalturaRequest} from "../kaltura-request";
import {KalturaPermissionFilterTypes} from "./kaltura-permission-filter-types";
import {KalturaPermissionFilter} from "./kaltura-permission-filter";

export class PermissionService {

    constructor(){
        throw new Error('This class should not be initialized (you should use its static functions to create new requests)');
    }

    static list(options? : { filter? : {type : KalturaPermissionFilterTypes, values : KalturaPermissionFilter} , pager? : any }) : KalturaRequest<any>
    {
        const parameters :any = {};

        if (options.filter)
        {
            parameters.filter = options.filter.values;
            parameters.filter.objectType = options.filter.type;
        }

        return new KalturaRequest<string>('permission','list',parameters);

    }

}