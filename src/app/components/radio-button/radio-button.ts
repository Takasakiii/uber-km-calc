import { Component, input } from '@angular/core';
import { Label } from '../label/label';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface Option {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-radio-button',
  imports: [Label, ReactiveFormsModule],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.css',
})
export class RadioButton {
  public label = input.required<string>();
  public options = input.required<Option[]>();
  public name = input.required<string>();

  public control = input.required<FormControl>();
}
