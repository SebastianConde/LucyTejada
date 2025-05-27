import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEstudianteComponent } from './registrar-estudiante.component';

describe('RegistrarEstudianteComponent', () => {
  let component: RegistrarEstudianteComponent;
  let fixture: ComponentFixture<RegistrarEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
