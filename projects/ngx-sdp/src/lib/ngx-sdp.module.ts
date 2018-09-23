import { NgModule } from '@angular/core';
import { NgxSdpComponent } from './ngx-sdp.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [NgxSdpComponent],
  exports: [NgxSdpComponent]
})
export class NgxSdpModule { }
