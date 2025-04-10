import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { CompletarRegisterService } from '../../services/completa-register.service';
import { CompleteRegisterRequest } from '../../interfaces/register-interface';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login-interface';
import { AlertsComponent } from '../alerts/error-alerts.component';


@Component({
  selector: 'app-completar-registro',
  imports: [ReactiveFormsModule, AlertsComponent],
  templateUrl: './completar-registro.component.html',
  styleUrl: './completar-registro.component.scss'
})
export class CompletarRegistroComponent {
  private formBuilder = inject(FormBuilder);
  private service = inject(CompletarRegisterService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  mensajeSuccess: string | null = null;
  tituloSuccess: string = '';


  completeRegistroForm = this.formBuilder.group({
    fechaNacimiento: new FormControl('',[Validators.required, CustomValidators.edadValida]),
    telefono: new FormControl('',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    direccion: new FormControl('',[Validators.required]),
    contrasena: new FormControl('', [Validators.required , Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]),
    confirmarContrasena: new FormControl('', [Validators.required]),
    tipoSangre: new FormControl('',[Validators.required]),
    sexo: new FormControl('',[Validators.required]),
  },{
    validators:[
      CustomValidators.contrasenasIguales,
    ]
  })

  onSubmit(){
    if(this.completeRegistroForm.valid){
      const formValue = this.completeRegistroForm.value as CompleteRegisterRequest
      this.service.completarRegistro(formValue).subscribe({
        next: () => {

          this.mensajeSuccess = '¡Registro completado exitosamente!';
          this.tituloSuccess = 'Éxito';


          const correo = this.loginService.getDecodedToken()?.sub;
          const loginPayLoad: LoginRequest = {
            username: correo!,
            password: formValue.contrasena,
          };
          this.loginService.login(loginPayLoad).subscribe({
            next: (res) => {
              this.loginService.setToken(res.token);
              const rol = this.loginService.getUserRole();

              switch (rol) {
                case 'ROLE_Administrativo':
                  this.router.navigate(['/admin']);
                  break;
                case 'ROLE_Coordinador':
                  this.router.navigate(['/coordinador']);
                  break;
                case 'ROLE_Instructor':
                  this.router.navigate(['/instructor']);
                  break;
                default:
                  this.router.navigate(['/']);
                  break;
              }
            },
            error: err => {
              console.error("Error al iniciar sesión automáticamente:", err);
            }
          });

        },
        error: (err) => {
          console.error("Error al completar registro:", err);
        }
      })
    }
  }
}
