import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '../../components/title/title';
import { RadioButton } from '../../components/radio-button/radio-button';
import { InputText } from '../../components/input-text/input-text';
import { Button } from '../../components/button/button';
import { gasType, rentType } from '../../app-types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ResultCalc } from '../../services/result-calc';
import { getNumberFromForm } from '../../../utils';

@Component({
  selector: 'app-rented',
  imports: [Title, RadioButton, InputText, Button, ReactiveFormsModule],
  templateUrl: './rented.html',
  styleUrl: './rented.css',
})
export class Rented implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly resultCalc = inject(ResultCalc);

  protected readonly rentType = rentType;
  protected readonly gasType = gasType;

  protected readonly rentalSufix = signal<string>(rentType[0].label);

  protected readonly form = this.formBuilder.group({
    rentalPeriod: [0],
    rentalValue: [''],
    kmDriven: [''],

    fuelType: [0],
    fuelPrice: [''],
    fuelConsumption: [''],

    desiredMonthlyProfit: [''],
  });

  public ngOnInit(): void {
    this.form.get('rentalPeriod')?.valueChanges.subscribe((newValue) => {
      this.rentalSufix.set(rentType[Number(newValue)].label);
    });
  }

  protected async handleSubmit(): Promise<void> {
    const formValues = this.form.value;
    await this.resultCalc.processResult({
      rent: {
        rentalPeriod: getNumberFromForm(formValues.rentalPeriod),
        rentalValue: getNumberFromForm(formValues.rentalValue, true),
      },
      fuel: {
        fuelConsumption: getNumberFromForm(formValues.fuelConsumption),
        fuelPrice: getNumberFromForm(formValues.fuelPrice, true),
        fuelType: getNumberFromForm(formValues.fuelType),
      },

      desiredMonthlyProfit: getNumberFromForm(formValues.desiredMonthlyProfit, true),
      kmDriven: getNumberFromForm(formValues.kmDriven),
    });
  }
}
