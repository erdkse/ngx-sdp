import { TestBed } from '@angular/core/testing';

import { NgxSdpService } from './ngx-sdp.service';

describe('NgxSdpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxSdpService = TestBed.get(NgxSdpService);
    expect(service).toBeTruthy();
  });
});
