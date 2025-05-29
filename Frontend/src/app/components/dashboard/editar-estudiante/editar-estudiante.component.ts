import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';
import { CustomValidators } from '../../../validators/custom-validators';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-editar-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertsComponent],
  templateUrl: './editar-estudiante.component.html',
  styleUrls: ['./editar-estudiante.component.scss']
})
export class EditarEstudianteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  estudianteForm!: FormGroup;
  estudianteId!: number;
  mensajeSuccess: string = '';
  tituloSuccess: string = '';
  tipoAlerta: 'success' | 'error' = 'success';
  cargando = false;

  ngOnInit() {
    this.estudianteId = Number(this.route.snapshot.paramMap.get('id'));
    this.estudianteForm = this.fb.group({
      nombres: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      apellidos: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      direccion: [''],
      telefono: ['', [CustomValidators.telefonoColombiano]],
      ciudadOrigen: [''],
      ciudadResidencia: [''],
      sexo: [''],
      tipoSangre: ['']
    });

    this.estudianteService.obtenerEstudiantes().subscribe(estudiantes => {
      const estudiante = estudiantes.find(e => e.estudiante.id === this.estudianteId)?.estudiante;
      if (estudiante) {
        this.estudianteForm.patchValue(estudiante);
      }
    });
  }

  isInvalid(control: string): boolean {
    const ctrl = this.estudianteForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit() {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.estudianteService.editarEstudiante(this.estudianteId, this.estudianteForm.value).subscribe({
      next: res => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.cargando = false;
      },
      error: () => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al modificar el estudiante';
        this.cargando = false;
      }
    });
  }

  onCancelar() {
    this.router.navigate(['/principal-web/estudiantes']);
  }

  onCerrarAlerta() {
    this.mensajeSuccess = '';
    this.tituloSuccess = '';
    this.estudianteForm.reset();
    this.router.navigate(['/principal-web/estudiantes']);
  }

  /* isInvalid(control: string): boolean {
    const ctrl = this.estudianteForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
 */

}