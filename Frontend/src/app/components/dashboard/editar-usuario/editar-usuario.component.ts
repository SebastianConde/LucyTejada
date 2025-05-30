import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/usuario';
import { CustomValidators } from '../../../validators/custom-validators';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from '../../alerts/error-alerts.component';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertsComponent],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  usuarioForm!: FormGroup;
  usuarioId!: number;
  mensajeSuccess: string = '';
  tituloSuccess: string = '';
  tipoAlerta: 'success' | 'error' = 'success';
  cargando = false;

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      apellidos: ['', [Validators.required, CustomValidators.noSoloEspacios]],
      correoElectronico: ['', [Validators.required, CustomValidators.correoPersonalizado]],
      rol: ['', [Validators.required]],
      fechaNacimiento: [''],
      direccion: [''],
      telefono: ['', [CustomValidators.telefonoColombiano]],
      sexo: [''],
      tipoSangre: ['']
    });

    this.usuarioService.obtenerUsuarios().subscribe(usuarios => {
      const usuario = usuarios.find(u => u.id === this.usuarioId);
      if (usuario) {
        this.usuarioForm.patchValue(usuario);
      }
    });
  }

    onSubmit() {
    if (this.usuarioForm.invalid) return;
    this.cargando = true;
    this.usuarioService.editarUsuario(this.usuarioId, this.usuarioForm.value).subscribe({
      next: res => {
        this.tipoAlerta = 'success';
        this.tituloSuccess = 'Éxito';
        this.mensajeSuccess = res.mensaje;
        this.cargando = false;
      },
      error: err => {
        this.tipoAlerta = 'error';
        this.tituloSuccess = 'Error';
        this.mensajeSuccess = 'Error al modificar el usuario';
        this.cargando = false;
      }
    });
  }

  onCancelar() {
    this.router.navigate(['/principal-web/usuarios']);
  }

  onCerrarAlerta() {
    this.mensajeSuccess = '';
    this.tituloSuccess = '';
    this.usuarioForm.reset();
    this.router.navigate(['/principal-web/usuarios']);
  }

  isInvalid(control: string): boolean {
    const ctrl = this.usuarioForm.get(control);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}