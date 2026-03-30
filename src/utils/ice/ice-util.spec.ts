import { TestBed } from '@angular/core/testing';

import { BreakerInterfaceUtil } from './ice-util';

describe('BreakerInterfaceUtil', () => {
  let service: BreakerInterfaceUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakerInterfaceUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
