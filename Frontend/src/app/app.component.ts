import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LlamarBackendService } from './llamar-backend.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule], // Importa los módulos necesarios
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  data: any;

  constructor(private backendService: LlamarBackendService) { }

  ngOnInit() {
    this.backendService.getData().subscribe(response => {
      this.data = response;
      console.log('Datos recibidos del backend:', this.data);
    }, error => {
      console.error('Error al obtener datos del backend:', error);
    });
  }
}
