import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './notFound.component.html',
  styleUrl: './notFound.component.scss',
})
export class NotFoundComponent {}
