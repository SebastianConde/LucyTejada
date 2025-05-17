import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, RegistroComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Frontend';
}
