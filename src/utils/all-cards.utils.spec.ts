import { TestBed } from '@angular/core/testing';

import { AllCards } from './all-cards.utils';

describe('AllCards', () => {
  let service: AllCards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllCards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
