import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';
import { Estudiante } from '../../../interfaces/estudiante';
import { CustomValidators } from '../../../validators/custom-validators';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-editar-estudiante',
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

    this.cargarDatosEstudiante();
  }

  cargarDatosEstudiante() {
    this.cargando = true;
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: estudiantes => {
        const estudianteConCursos = estudiantes.find(e => e.estudiante.id === this.estudianteId);
        if (estudianteConCursos) {
          const estudiante = estudianteConCursos.estudiante;
          this.estudianteForm.patchValue({
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            direccion: estudiante.direccion,
            telefono: estudiante.telefono,
            ciudadOrigen: estudiante.ciudadOrigen,
            ciudadResidencia: estudiante.ciudadResidencia,
            sexo: estudiante.sexo,
            tipoSangre: estudiante.tipoSangre
          });
        }
        this.cargando = false;
      },
      error: () => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al cargar los datos del estudiante';
        this.cargando = false;
      }
    });
  }

  onSubmit() {
    if (this.estudianteForm.invalid) return;
    this.cargando = true;
    
    this.estudianteService.editarEstudiante(this.estudianteId, this.estudianteForm.value).subscribe({
      next: res => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.cargando = false;
      },
      error: err => {
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
    this.router.navigate(['/principal-web/estudiantes']);
  }

  isInvalid(control: string): boolean {
    const ctrl = this.estudianteForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}