import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxSdpModule } from '../../projects/ngx-sdp/src/lib/ngx-sdp.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgxSdpModule } from 'ngx-sdp';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'ngx-sdp-demo' }),
    NgxSdpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
