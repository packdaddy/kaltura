import { NgModule,SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ShellService} from "./shell.service";
import {InMemoryAppStorage} from "./app-storage.service";
import {AppConfig} from "./config/app-config.service";
import {KMCLanguage} from "./i18n/kmc-language.service";
import {UserAuthentication} from "./auth/user-authentication.service";



@NgModule({
    imports: <any[]>[
        CommonModule
    ],
    declarations: <any[]>[
    ],
    exports: <any[]>[
    ],
    providers: <any[]>[
        ShellService,
        InMemoryAppStorage,
        AppConfig,
        KMCLanguage,
        UserAuthentication]
})
export class KMCngCoreModule {
    constructor(@Optional() @SkipSelf() module : KMCngCoreModule)
    {
        if (module) {
            throw new Error("KMCngCoreModule module imported twice.");
        }
    }
}
