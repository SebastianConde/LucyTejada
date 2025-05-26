import { AbstractControl, ValidationErrors} from '@angular/forms';

export class CustomValidators {

  static edadValida(control: AbstractControl): ValidationErrors | null {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    const edadFinal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

    if (isNaN(edadFinal)) return null;

    if (edadFinal < 18) {
      return { menorDeEdad: true };
    }

    if (edadFinal > 80) {
      return { mayorDe80: true };
    }

    return null;
  }

  static contrasenasIguales(group: AbstractControl): ValidationErrors | null {
    const password = group.get('contrasena')?.value;
    const confirmacion = group.get('confirmarContrasena')?.value;

    if (password !== confirmacion) {
      group.get('confirmarContrasena')?.setErrors({ noCoincide: true });
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
    const cedulaRegex = /^\d{10}$/; // exactamente 10 dígitos
    if (valor && !cedulaRegex.test(valor)) {
      return { cedulaInvalida: true };
    }
    return null;
  }

  static correoPersonalizado(control: AbstractControl): ValidationErrors | null {
    const valor = control.value as string;

    // Solo valida si el campo tiene al menos un "@" y un "." después
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Si el campo está vacío, no mostrar este error (lo manejará "required")
    if (!valor) return null;

    // Si aún no coincide con formato tipo nombre@dominio.ext, mostrar error
    if (!correoRegex.test(valor)) {
      return { correoInvalido: true };
    }

    return null;
  }

}
