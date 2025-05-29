import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstudianteService } from '../../../services/estudiante.service';
import { AlertsComponent } from '../../alerts/error-alerts.component';
import { CommonModule } from '@angular/common';
import { Curso, RegistrarEstudianteRequest, EstudianteConCursos } from '../../../interfaces/estudiante';
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

  verificacionMensaje: string | null = null;
  verificacionTitulo: string = '';
  esperandoVerificacion: boolean = false; 

  // NUEVO: Estado para saber si el estudiante ya existe
  estudianteYaExiste: boolean = false;
  mostrarRegistroCompleto: boolean = false;
  estudianteEncontrado: EstudianteConCursos | null = null;

  // Formulario solo para buscar documento
  buscarForm: FormGroup = this.fb.group({
    documento: new FormControl('', [
      Validators.required,
      CustomValidators.cedulaValida,
      CustomValidators.noSoloEspacios
    ])
  });

  // Formulario completo para registro
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
    this.rolUsuario = this.loginService.getUserRole();
    this.obtenerUbicacion();

    this.cursoService.obtenerMisCursos().subscribe({
      next: cursos => {
        this.cursosDisponibles = cursos;
      },
      error: err => console.error('Error al cargar cursos:', err)
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
          
          // Nueva: Forzar validación y deshabilitar edición
          this.estudianteForm.get('latitud')?.disable();
          this.estudianteForm.get('longitud')?.disable();
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
          this.tipoAlerta = 'error';
          this.mensajeSuccess = 'Debe permitir la geolocalización para continuar';
        },
        { 
          enableHighAccuracy: true, // Mayor precisión
          timeout: 5000,
          maximumAge: 0 
        }
      );
    } else {
      this.tipoAlerta = 'error';
      this.mensajeSuccess = 'Su navegador no soporta geolocalización';
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

  // NUEVO: Buscar estudiante por documento antes de mostrar el formulario completo
    buscarEstudiante(): void {
    if (this.buscarForm.invalid) {
      this.buscarForm.markAllAsTouched();
      return;
    }
    const documento = this.buscarForm.value.documento;
    this.service.estudianteExiste(documento).subscribe({
      next: (res) => {
        this.esperandoVerificacion = true;
        if (res.existe) {
          this.verificacionTitulo = 'Estudiante ya registrado';
          this.verificacionMensaje = 'El estudiante ya está registrado. Puede inscribirlo a un nuevo curso.';
          this.estudianteYaExiste = true;
          this.mostrarRegistroCompleto = false;
          this.service.obtenerEstudiantes().subscribe(lista => {
            this.estudianteEncontrado = lista.find(e => e.estudiante.documento === documento) || null;
            // Prellenar el documento en el form de inscripción
            this.estudianteForm.patchValue({ documento });
          });
        } else {
          this.verificacionTitulo = 'Estudiante no registrado';
          this.verificacionMensaje = 'El estudiante no está registrado. Puede proceder con el registro completo.';
          this.estudianteYaExiste = false;
          this.mostrarRegistroCompleto = true;
          this.estudianteForm.patchValue({ documento });
        }
      },
      error: () => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al verificar existencia del estudiante.';
      }
    });
  }

  onSubmit(): void {

    if (this.estudianteForm.get('latitud')?.value === 0 || 
      this.estudianteForm.get('longitud')?.value === 0) {
      this.tipoAlerta = 'error';
      this.mensajeSuccess = 'No se pudo obtener su ubicación';
      return;
    }

    if (this.estudianteYaExiste) {
      // Solo inscribir a un nuevo curso
      const documento = this.buscarForm.value.documento;
      const curso = this.estudianteForm.value.curso;
      if (!curso) {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Debe seleccionar un curso.';
        return;
      }
      this.service.inscribirEstudiante(documento, curso).subscribe({
        next: (resp) => {
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = resp.mensaje;
          this.estudianteForm.reset();
          this.buscarForm.reset();
          this.estudianteYaExiste = false;
          this.estudianteEncontrado = null;
        },
        error: (err) => {
          this.tipoAlerta = 'error';
          this.tituloSuccess = 'Error';
          this.mensajeSuccess = err.error?.mensaje || 'Error al inscribir estudiante.';
        }
      });
    } else {
      if (this.estudianteForm.invalid) {
        this.estudianteForm.markAllAsTouched();
        return;
      }
      const estudiante: RegistrarEstudianteRequest = this.estudianteForm.getRawValue();
      const cursoExiste = this.cursosDisponibles.some(c => c.nombre === estudiante.curso);
      if (!cursoExiste) {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = `El curso "${estudiante.curso}" no existe o no está disponible para registro.`;
        return;
      }
      this.service.registrarEstudiante(estudiante).subscribe({
        next: (resp) => {
          this.tipoAlerta = 'success';
          this.tituloSuccess = 'Éxito';
          this.mensajeSuccess = resp.mensaje;
          this.estudianteForm.reset();
          this.buscarForm.reset();
        },
        error: (err) => {
          this.tipoAlerta = 'error';
          this.tituloSuccess = 'Error';
          if (err.error && err.error.mensaje) {
            this.mensajeSuccess = err.error.mensaje;
          } else if (err.status === 403) {
            this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
          } else if (err.status === 409) {
            this.mensajeSuccess = 'El correo electrónico o cédula ya están registrados.';
          } else {
            this.mensajeSuccess = 'No tiene permisos para realizar esta acción.';
          }
        }
      });
    }
  }

  continuarDespuesVerificacion(): void {
    this.esperandoVerificacion = false;
    if (this.verificacionTitulo === 'Estudiante ya registrado') {
      this.estudianteYaExiste = true;
      this.mostrarRegistroCompleto = false;
      const documento = this.buscarForm.value.documento;
      this.service.obtenerEstudiantes().subscribe(lista => {
        this.estudianteEncontrado = lista.find(e => e.estudiante.documento === documento) || null;
        this.estudianteForm.patchValue({ documento });
      });
    } else {
      this.estudianteYaExiste = false;
      this.mostrarRegistroCompleto = true;
      this.estudianteForm.patchValue({ documento: this.buscarForm.value.documento });
    }
    this.verificacionMensaje = null;
  }

  campoInvalido(campo: string): boolean {
    const control = this.estudianteForm.get(campo);
    return !!(control && control.touched && control.invalid);
  }

  cancelar(): void {
    this.router.navigate(['/principal-web/estudiantes']);
  }
}