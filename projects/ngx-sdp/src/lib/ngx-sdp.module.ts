import { NgModule } from '@angular/core';
import { NgxSdpComponent } from './ngx-sdp.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [NgxSdpComponent],
  exports: [NgxSdpComponent]
})
export class NgxSdpModule {}
