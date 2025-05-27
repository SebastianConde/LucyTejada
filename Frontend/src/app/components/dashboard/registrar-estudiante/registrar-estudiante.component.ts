import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EstudianteService } from '../../../services/estudiante.service';
import { AlertsComponent } from '../../alerts/error-alerts.component';
import { CommonModule } from '@angular/common';
import { Estudiante } from '../../../interfaces/estudiante';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { CustomValidators } from '../../../validators/custom-validators';

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

  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';
  tipoAlerta: string = '';  // <-- Declaración para controlar tipo de alerta

  estudianteForm: FormGroup = this.fb.group({
    tipoDocumento: new FormControl('CC', Validators.required),
    documento: new FormControl('', [
      Validators.required,
      CustomValidators.cedulaValida
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
      CustomValidators.correoPersonalizado
    ]),
    ciudadOrigen: new FormControl('', Validators.required),
    ciudadResidencia: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10}$/)
    ]),
    tipoSangre: new FormControl('', Validators.required),
    sexo: new FormControl('', Validators.required),
    latitud: new FormControl(0, Validators.required),
    longitud: new FormControl(0, Validators.required),
    curso: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.obtenerUbicacion();

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

    const estudiante: Estudiante = this.estudianteForm.getRawValue();
    console.log('Estudiante a registrar:', estudiante);

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

        if (err.status === 403) {
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
