import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CrearCursoRequest } from '../../../interfaces/crear-curso';
import { CursoService } from '../../../services/curso.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { CustomValidators } from '../../../validators/custom-validators';

@Component({
  selector: 'app-crear-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.scss']
})
export class CrearCursoComponent implements OnInit {
  cursoForm!: FormGroup;
  cargando = false;
  instructores: Usuario[] = []; // Asumiendo que los instructores son tipo Estudiante
  mensajeExito: string = '';
  mensajeError: string = '';

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
      horarios: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      zonaImparticion: ['', Validators.required],
      fechaInicio: ['', [Validators.required, CustomValidators.fechaNoPasada]]
    });

    this.cargarInstructores();
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

  isInvalid(control: string): boolean {
    const ctrl = this.cursoForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit() {
    if (this.cursoForm.invalid) return;
    this.cargando = true;
    const payload: CrearCursoRequest = this.cursoForm.value;
    this.cursoService.crearCurso(payload).subscribe({
      next: res => {
        this.mensajeExito = res.mensaje;
        this.cursoForm.reset();
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/dashboard/cursos']), 1500);
      },
      error: () => {
        this.mensajeError = 'Error al crear el curso';
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/principal-web/cursos']);
  }
}