import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarRecuperacionComponent } from './finalizar-recuperacion.component';

describe('FinalizarRecuperacionComponent', () => {
  let component: FinalizarRecuperacionComponent;
  let fixture: ComponentFixture<FinalizarRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizarRecuperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
