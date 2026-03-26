import { TestBed } from '@angular/core/testing';

import { UtenteServices } from './utente-services';

describe('UtenteServices', () => {
  let service: UtenteServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtenteServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
