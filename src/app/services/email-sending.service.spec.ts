import { TestBed, inject } from '@angular/core/testing';

import { EmailSendingService } from './email-sending.service';

describe('EmailSendingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailSendingService]
    });
  });

  it('should be created', inject([EmailSendingService], (service: EmailSendingService) => {
    expect(service).toBeTruthy();
  }));
});
