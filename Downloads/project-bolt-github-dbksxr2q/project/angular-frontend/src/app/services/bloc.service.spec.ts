import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlocService } from './bloc.service';
import { Bloc } from '../models/bloc.model';

describe('BlocService', () => {
  let service: BlocService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlocService]
    });
    service = TestBed.inject(BlocService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all blocs', () => {
    const mockBlocs: Bloc[] = [
      { idBloc: 1, nomBloc: 'Bloc A', capaciteBloc: 100 },
      { idBloc: 2, nomBloc: 'Bloc B', capaciteBloc: 150 }
    ];

    service.getAllBlocs().subscribe(blocs => {
      expect(blocs.length).toBe(2);
      expect(blocs).toEqual(mockBlocs);
    });

    const req = httpMock.expectOne('http://localhost:8089/tpfoyer/bloc/retrieve-all-blocs');
    expect(req.request.method).toBe('GET');
    req.flush(mockBlocs);
  });

  it('should add a bloc', () => {
    const newBloc: Bloc = { nomBloc: 'New Bloc', capaciteBloc: 200 };
    const savedBloc: Bloc = { idBloc: 3, ...newBloc };

    service.addBloc(newBloc).subscribe(bloc => {
      expect(bloc).toEqual(savedBloc);
    });

    const req = httpMock.expectOne('http://localhost:8089/tpfoyer/bloc/add-bloc');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBloc);
    req.flush(savedBloc);
  });

  it('should delete a bloc', () => {
    const blocId = 1;

    service.deleteBloc(blocId).subscribe();

    const req = httpMock.expectOne(`http://localhost:8089/tpfoyer/bloc/remove-bloc/${blocId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});