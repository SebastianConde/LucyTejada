import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstudianteService } from '../../../services/estudiante.service';
import { AlertsComponent } from '../../alerts/error-alerts.component';
import { CommonModule } from '@angular/common';
import { Curso, RegistrarEstudianteRequest } from '../../../interfaces/estudiante';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { CustomValidators } from '../../../validators/custom-validators';
import { CursoService } from '../../../services/curso.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-registro-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, AlertsComponent, HttpClientModule],
  templateUrl: './registrar-estudiante.component.html',
  styleUrls: ['./registrar-estudiante.component.scss']
})
export class RegistroEstudianteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EstudianteService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private cursoService = inject(CursoService);
  private loginService = inject(LoginService);

  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';
  tipoAlerta: string = '';
  cursosDisponibles: Curso[] = [];
  rolUsuario: string | null = null;

  estudianteForm: FormGroup = this.fb.group({
    tipoDocumento: new FormControl('CC', Validators.required),
    documento: new FormControl('', [
      Validators.required,
      CustomValidators.cedulaValida,
      CustomValidators.noSoloEspacios
    ]),
    nombres: new FormControl('', [
      Validators.required,
      CustomValidators.noSoloEspacios
    ]),
    apellidos: new FormControl('', [
      Validators.required,
      CustomValidators.noSoloEspacios
    ]),
    correoElectronico: new FormControl('', [
      Validators.required,
      CustomValidators.correoPersonalizado,
      CustomValidators.noSoloEspacios
    ]),
    ciudadOrigen: new FormControl('', [
      Validators.required,
      CustomValidators.noSoloEspacios
    ]),
    ciudadResidencia: new FormControl('', [
      Validators.required,
      CustomValidators.noSoloEspacios
    ]),
    direccion: new FormControl('', [
      Validators.required,
      CustomValidators.noSoloEspacios
    ]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/),
      CustomValidators.noSoloEspacios
    ]),
    tipoSangre: new FormControl('', Validators.required),
    sexo: new FormControl('', Validators.required),
    latitud: new FormControl(0, Validators.required),
    longitud: new FormControl(0, Validators.required),
    curso: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    // Depuración: mostrar rol del usuario
    this.rolUsuario = this.loginService.getUserRole();
    console.log('Rol del usuario:', this.rolUsuario);

    this.obtenerUbicacion();

    // Depuración: mostrar cursos disponibles para registro
    this.cursoService.obtenerMisCursos().subscribe({
      next: cursos => {
        this.cursosDisponibles = cursos;
        console.log('Cursos disponibles para registro:', cursos.map(c => c.nombre));
      },
      error: err => console.error('Error al cargar cursos:', err)
    });

    this.estudianteForm.get('ciudadResidencia')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(ciudad => ciudad?.trim().length > 2 ? this.obtenerCoordenadasCiudad(ciudad.trim()) : of(null)),
      catchError(err => {
        console.error('Error al buscar coordenadas:', err);
        return of(null);
      })
    ).subscribe(coords => {
      if (coords) {
        this.estudianteForm.patchValue({
          latitud: coords.lat,
          longitud: coords.lon
        });
      }
    });
  }

  obtenerUbicacion(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.estudianteForm.patchValue({
            latitud: +position.coords.latitude.toFixed(6),
            longitud: +position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada.');
    }
  }

  obtenerCoordenadasCiudad(ciudad: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ciudad)}`;
    return this.http.get<any[]>(url).pipe(
      switchMap((results) => {
        if (results.length > 0) {
          const loc = results[0];
          return of({ lat: parseFloat(loc.lat), lon: parseFloat(loc.lon) });
        }
        return of(null);
      })
    );
  }

  onSubmit(): void {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }

    const estudiante: RegistrarEstudianteRequest = this.estudianteForm.getRawValue();
    console.log('Estudiante a registrar:', estudiante);

    // Depuración: verificar si el curso seleccionado existe en cursosDisponibles
    const cursoExiste = this.cursosDisponibles.some(c => c.nombre === estudiante.curso);
    if (!cursoExiste) {
      this.tipoAlerta = 'error';
      this.tituloSuccess = 'Error';
      this.mensajeSuccess = `El curso "${estudiante.curso}" no existe o no está disponible para registro.`;
      console.error(`Curso "${estudiante.curso}" no encontrado en cursosDisponibles:`, this.cursosDisponibles.map(c => c.nombre));
      return;
    }

    this.service.registrarEstudiante(estudiante).subscribe({
      next: () => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = 'Usuario creado exitosamente.';
        this.estudianteForm.reset();
      },
      error: (err) => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';

        // Depuración: mostrar error detallado
        if (err.error && err.error.mensaje) {
          this.mensajeSuccess = err.error.mensaje;
        } else if (err.status === 403) {
          this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
        } else if (err.status === 409) {
          this.mensajeSuccess = 'El correo electrónico o cédula ya están registrados.';
        } else if (err.status === 500) {
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = 'Estudiante creado exitosamente.';
          this.estudianteForm.reset();
        } else {
          this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
        }

        console.error('Error en el registro:', err);
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.estudianteForm.get(campo);
    return !!(control && control.touched && control.invalid);
  }

  cancelar(): void {
    this.router.navigate(['/principal-web/estudiantes']);
  }
}