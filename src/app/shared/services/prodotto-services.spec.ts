import { TestBed } from '@angular/core/testing';

import { ProdottoServices } from './prodotto-services';

describe('ProdottoServices', () => {
  let service: ProdottoServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdottoServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
