import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CursoService } from '../../../services/curso.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { CustomValidators } from '../../../validators/custom-validators';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertsComponent],
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.scss']
})
export class CrearCursoComponent implements OnInit {
  cursoForm!: FormGroup;
  cargando = false;
  instructores: Usuario[] = [];
  mensajeSuccess: string = '';
  tituloSuccess: string = '';
  tipoAlerta: 'success' | 'error' = 'success';
  horariosDisponibles: string[] = [];
  todosHorarios: string[] = [];

  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      descripcion: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      instructorId: ['', Validators.required],
      tipo: ['', Validators.required],
      duracion: ['', Validators.required],
      horarios: ['', Validators.required],
      zonaImparticion: ['', Validators.required],
      fechaInicio: ['', [Validators.required, CustomValidators.fechaNoPasada]]
    });

    this.todosHorarios = [
      ...this.generarHorarios(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábados', 'Domingos'], { inicio: 8, fin: 20 }, 2),
      ...this.generarHorarios(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábados', 'Domingos'], { inicio: 8, fin: 19 }, 3),
      ...this.combinarDiasYHoras([
        ['Lunes', 'Miércoles'],
        ['Martes', 'Jueves'],
        ['Sábados', 'Domingos'],
        ['Lunes', 'Viernes'],
        ['Martes', 'Sábados'],
        ['Miércoles', 'Viernes'],
        ['Jueves', 'Domingos'],
        ['Lunes', 'Jueves'],
        ['Martes', 'Viernes'],
        ['Miércoles', 'Sábados']
      ], { inicio: 8, fin: 20 }, 2),
      ...this.combinarDiasYHoras([
        ['Lunes', 'Miércoles'],
        ['Martes', 'Jueves'],
        ['Sábados', 'Domingos'],
        ['Lunes', 'Viernes'],
        ['Martes', 'Sábados'],
        ['Miércoles', 'Viernes'],
        ['Jueves', 'Domingos'],
        ['Lunes', 'Jueves'],
        ['Martes', 'Viernes'],
        ['Miércoles', 'Sábados']
      ], { inicio: 8, fin: 19 }, 3)
    ];

    this.cargarInstructores();
    this.cargarHorariosDisponibles();
  }

  // Genera horarios individuales
  generarHorarios(dias: string[], horas: { inicio: number, fin: number }, duracion: number): string[] {
    const horarios: string[] = [];
    for (let dia of dias) {
      for (let h = horas.inicio; h <= horas.fin - duracion; h++) {
        const inicio = h;
        const fin = h + duracion;
        const inicioStr = `${inicio < 12 ? inicio : inicio === 12 ? 12 : inicio - 12}${inicio < 12 ? 'am' : 'pm'}`;
        const finStr = `${fin < 12 ? fin : fin === 12 ? 12 : fin - 12}${fin < 12 ? 'am' : 'pm'}`;
        horarios.push(`${dia} ${inicioStr} - ${finStr}`);
      }
    }
    return horarios;
  }

  // Genera horarios combinando días
  combinarDiasYHoras(diasCombinados: string[][], horas: { inicio: number, fin: number }, duracion: number): string[] {
    const horarios: string[] = [];
    for (let dias of diasCombinados) {
      for (let h = horas.inicio; h <= horas.fin - duracion; h++) {
        const inicio = h;
        const fin = h + duracion;
        const inicioStr = `${inicio < 12 ? inicio : inicio === 12 ? 12 : inicio - 12}${inicio < 12 ? 'am' : 'pm'}`;
        const finStr = `${fin < 12 ? fin : fin === 12 ? 12 : fin - 12}${fin < 12 ? 'am' : 'pm'}`;
        horarios.push(`${dias.join(' y ')} ${inicioStr} - ${finStr}`);
      }
    }
    return horarios;
  }

  cargarInstructores() {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: usuarios => {
        this.instructores = usuarios.filter(u => u.rol === 'Instructor');
      },
      error: () => {
        this.instructores = [];
      }
    });
  }

  /* cargarHorariosDisponibles() {
    // Permitir repetir horarios: todos los horarios siempre disponibles
    this.horariosDisponibles = this.todosHorarios;
  }
 */

  cargarHorariosDisponibles() {
    // No permitir repetir horarios: solo los que no estén ocupados
    this.cursoService.obtenerCursos().subscribe({
      next: cursos => {
        const horariosOcupados = cursos.map(c => c.horarios);
        this.horariosDisponibles = this.todosHorarios.filter(h => !horariosOcupados.includes(h));
      },
      error: () => {
        // Si hay error, muestra todos los horarios
        this.horariosDisponibles = this.todosHorarios;
      }
    });
  }

  isInvalid(control: string): boolean {
    const ctrl = this.cursoForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getDuraciones(): string[] {
    return Array.from({ length: 15 }, (_, i) => `${i + 1} mes${i === 0 ? '' : 'es'}`);
  }

  onSubmit() {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }
    this.cargando = true;
    const payload = this.cursoForm.value;
    this.cursoService.crearCurso(payload).subscribe({
      next: res => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.cargando = false;
        // Actualiza horarios disponibles después de crear
        this.cargarHorariosDisponibles();
      },
      error: () => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al crear el curso';
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/principal-web/cursos']);
  }

  onCerrarAlerta() {
    this.mensajeSuccess = '';
    this.tituloSuccess = '';
    this.cursoForm.reset();
    this.router.navigate(['/principal-web/cursos']);
  }
}