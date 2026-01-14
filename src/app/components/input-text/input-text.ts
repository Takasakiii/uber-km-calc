import { Component, computed, input } from '@angular/core';
import { Label } from '../label/label';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Mask } from '../../directives/mask';

@Component({
  selector: 'app-input-text',
  imports: [Label, ReactiveFormsModule, Mask],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
})
export class InputText {
  public label = input.required<string>();
  public placeholder = input<string>('');
  public type = input<'text' | 'number'>('text');
  public mask = input<string | null>(null);

  public control = input.required<FormControl>();

  protected hasMask = computed(() => this.mask() != null);
}
