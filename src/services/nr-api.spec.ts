import { TestBed } from '@angular/core/testing';

import { NRApi } from './nr-api';

describe('NRApi', () => {
  let service: NRApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NRApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
