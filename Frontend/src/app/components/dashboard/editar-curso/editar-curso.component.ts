import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../../services/curso.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-editar-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertsComponent],
  templateUrl: './editar-curso.component.html',
  styleUrls: ['./editar-curso.component.scss']
})
export class EditarCursoComponent implements OnInit {
  cursoForm!: FormGroup;
  cargando = false;
  instructores: Usuario[] = [];
  mensajeSuccess: string = '';
  tituloSuccess: string = '';
  tipoAlerta: 'success' | 'error' = 'success';
  horariosDisponibles: string[] = [];
  todosHorarios: string[] = [];
  error: string = '';
  cursoId!: number;

  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  ngOnInit() {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      instructorId: ['', Validators.required],
      tipo: ['', Validators.required],
      duracion: ['', Validators.required],
      horarios: ['', Validators.required],
      zonaImparticion: ['', Validators.required],
      fechaInicio: ['', Validators.required]
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

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cursoId = +id;
        this.cargarCurso(this.cursoId);
      }
    });
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

  cargarCurso(id: number) {
    this.cargando = true;
    this.cursoService.obtenerCursoPorId(id).subscribe({
      next: curso => {
        this.cursoForm.patchValue(curso);
        this.cargarHorariosDisponibles(curso.horarios);
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar el curso';
        this.cargando = false;
      }
    });
  }

  cargarHorariosDisponibles(horarioActual: string) {
    this.cursoService.obtenerCursos().subscribe({
      next: cursos => {
        const horariosOcupados = cursos
          .filter(c => c.horarios !== horarioActual) // Permite mantener el horario actual del curso
          .map(c => c.horarios);
        this.horariosDisponibles = this.todosHorarios.filter(h => !horariosOcupados.includes(h) || h === horarioActual);
      },
      error: () => {
        this.horariosDisponibles = this.todosHorarios;
      }
    });
  }

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
    this.cursoService.modificarCurso(this.cursoId, this.cursoForm.value).subscribe({
      next: res => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.cargando = false;
        this.cargarHorariosDisponibles(this.cursoForm.value.horarios);
      },
      error: () => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al modificar el curso';
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