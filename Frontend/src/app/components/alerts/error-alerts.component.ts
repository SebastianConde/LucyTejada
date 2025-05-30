import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [NgClass],
  templateUrl: './error-alerts.component.html',
  styleUrl: './error-alerts.component.scss'
})
export class AlertsComponent {
  @Input() mensaje: string = '';
  @Input() mensajeTitulo: string = '';
  @Input() tipo: 'error' | 'success' | 'info' = 'error'; 
  @Output() cerrar = new EventEmitter<void>();

  onCerrar() {
    this.cerrar.emit();
  }
}

