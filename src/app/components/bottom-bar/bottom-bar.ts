import { Component } from '@angular/core';
import { BottomBarItem } from '../bottom-bar-item/bottom-bar-item';

@Component({
  selector: 'app-bottom-bar',
  imports: [BottomBarItem],
  templateUrl: './bottom-bar.html',
  styleUrl: './bottom-bar.css',
})
export class BottomBar {}
