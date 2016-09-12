import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';

import {KalturaAPIConfig} from "./kaltura-api-config";
import {KalturaAPIClient} from "./kaltura-api-client";

@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        KalturaAPIConfig,
        KalturaAPIClient ]
})
export class KalturaApiModule {
    constructor(@Optional() @SkipSelf() module : KalturaApiModule)
    {
        if (module) {
            throw new Error("KalturaApiModule module imported twice.");
        }
    }
}
