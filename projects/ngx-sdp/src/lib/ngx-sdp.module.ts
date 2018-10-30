import { NgModule } from '@angular/core';
import { NgxSdpComponent } from './ngx-sdp.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxSdpComponent],
  exports: [NgxSdpComponent]
})
export class NgxSdpModule {}
