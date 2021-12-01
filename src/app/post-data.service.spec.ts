import { TestBed } from '@angular/core/testing';

import { PostDataService } from './post-data.service';
import { HttpClientTestingModule} from '@angular/common/http/testing';
describe('PostDataService', () => {
  let service: PostDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(PostDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
