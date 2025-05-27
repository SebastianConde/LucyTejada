import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static edadValida(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }

    if (isNaN(edad)) return null;

    if (edad < 18) {
      return { menorDeEdad: true };
    }

    if (edad > 80) {
      return { mayorDe80: true };
    }

    return null;
  }

  static contrasenasIguales(group: AbstractControl): ValidationErrors | null {
    const password = group.get('contrasena')?.value;
    const confirmacion = group.get('confirmarContrasena')?.value;

    if (password !== confirmacion) {
      return { noCoincide: true };
    }

    return null;
  }

  static noSoloEspacios(control: AbstractControl): ValidationErrors | null {
    const valor = control.value as string;
    if (valor && valor.trim().length === 0) {
      return { soloEspacios: true };
    }
    return null;
  }

  static cedulaValida(control: AbstractControl): ValidationErrors | null {
    const valor = control.value as string;
    const cedulaRegex = /^\d{8,10}$/;
    if (valor && !cedulaRegex.test(valor)) {
      return { cedulaInvalida: true };
    }
    return null;
  }

  static correoPersonalizado(control: AbstractControl): ValidationErrors | null {
    const valor = control.value as string;
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) return null;
    if (!correoRegex.test(valor)) {
      return { correoInvalido: true };
    }
    return null;
  }
  static telefonoColombiano(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^[0-9]{10}$/;
    return value && regex.test(value) ? null : { pattern: true };
  }

}
