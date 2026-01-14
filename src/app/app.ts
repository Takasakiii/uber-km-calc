import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomBar } from './components/bottom-bar/bottom-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
