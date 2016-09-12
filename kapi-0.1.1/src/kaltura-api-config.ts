import { Injectable } from '@angular/core';

@Injectable()
export class KalturaAPIConfig {
    ks : string;
    apiUrl : string;
    apiVersion : string;

    clientTag = 'kaltura/kaltura-api_v1';
    headers = {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    };
    format = 1;

}