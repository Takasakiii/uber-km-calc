import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-bar-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-bar-item.html',
  styleUrl: './bottom-bar-item.css',
})
export class BottomBarItem {
  public icon = input.required<string>();
  public name = input.required<string>();
  public link = input.required<string>();

  protected urlLink = computed(() => [this.link()]);
}
