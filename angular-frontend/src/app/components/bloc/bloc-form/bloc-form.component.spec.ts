import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { BlocFormComponent } from './bloc-form.component';
import { BlocService } from '../../../services/bloc.service';
import { Bloc } from '../../../models/bloc.model';

describe('BlocFormComponent', () => {
  let component: BlocFormComponent;
  let fixture: ComponentFixture<BlocFormComponent>;
  let mockBlocService: jasmine.SpyObj<BlocService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const blocServiceSpy = jasmine.createSpyObj('BlocService', ['addBloc', 'updateBloc', 'getBlocById']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        BlocFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BlocService, useValue: blocServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlocFormComponent);
    component = fixture.componentInstance;
    mockBlocService = TestBed.inject(BlocService) as jasmine.SpyObj<BlocService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    fixture.detectChanges();
    expect(component.blocForm.get('nomBloc')?.value).toBe('');
    expect(component.blocForm.get('capaciteBloc')?.value).toBe('');
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    const form = component.blocForm;
    
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      nomBloc: 'Test Bloc',
      capaciteBloc: 100
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should add bloc when form is valid', () => {
    const newBloc: Bloc = {
      nomBloc: 'Test Bloc',
      capaciteBloc: 100
    };
    
    mockBlocService.addBloc.and.returnValue(of(newBloc));
    
    component.blocForm.patchValue(newBloc);
    component.onSubmit();
    
    expect(mockBlocService.addBloc).toHaveBeenCalledWith(newBloc);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Bloc ajouté avec succès', 'Fermer', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blocs']);
  });

  it('should cancel and navigate back', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blocs']);
  });
});