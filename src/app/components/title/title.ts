import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.html',
  styleUrl: './title.css',
})
export class Title {
  public text = input.required<string>();
  public center = input<boolean>(false);
  public length = input<'h1' | 'h2'>('h1');

  protected fontSize = computed(() => {
    if (this.length() == 'h1') {
      return 2;
    }

    return 1.5;
  });
}
