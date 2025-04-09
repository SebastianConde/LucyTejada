import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-alerts',
  imports: [],
  templateUrl: './error-alerts.component.html',
  styleUrl: './error-alerts.component.scss'
})
export class ErrorAlertsComponent {
  @Input() mensaje: string = '';
  @Input() mensajeTitulo: string = '';
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(){
    this.cerrar.emit();
  }

}
