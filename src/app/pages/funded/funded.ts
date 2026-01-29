import { Component, inject } from '@angular/core';
import { Title } from '../../components/title/title';
import { Button } from '../../components/button/button';
import { InputText } from '../../components/input-text/input-text';
import { RadioButton } from '../../components/radio-button/radio-button';
import { gasType } from '../../app-types';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ResultCalc } from '../../services/result-calc';
import { getNumberFromForm } from '../../../utils';

@Component({
  selector: 'app-funded',
  imports: [Title, Button, InputText, RadioButton, ReactiveFormsModule],
  templateUrl: './funded.html',
  styleUrl: './funded.css',
})
export class Funded {
  private readonly formBuilder = inject(FormBuilder);
  private readonly resultCalc = inject(ResultCalc);

  protected readonly gasType = gasType;

  protected readonly form = this.formBuilder.group({
    carValue: [''],
    ipva: [''],
    depreciation: [''],
    kmDriven: [''],
    insuranceValue: [''],

    installmentAmount: [''],

    fuelType: [0],
    fuelPrice: [''],
    fuelConsumption: [''],

    oilChangeCost: [''],
    oilChangeFrequency: [''],

    tiresCost: [''],
    tiresLifetime: [''],

    desiredMonthlyProfit: [''],
  });

  protected async handleSubmit(): Promise<void> {
    const formValues = this.form.value;
    await this.resultCalc.processResult({
      carInfo: {
        carValue: getNumberFromForm(formValues.carValue, true),
        depreciation: getNumberFromForm(formValues.depreciation),
        insuranceValue: getNumberFromForm(formValues.insuranceValue, true),
        ipva: getNumberFromForm(formValues.ipva, true),
      },
      installmentAmount: getNumberFromForm(formValues.installmentAmount, true),
      fuel: {
        fuelConsumption: getNumberFromForm(formValues.fuelConsumption, true),
        fuelPrice: getNumberFromForm(formValues.fuelPrice, true),
        fuelType: getNumberFromForm(formValues.fuelType),
      },
      oilCost: {
        oilChangeCost: getNumberFromForm(formValues.oilChangeCost, true),
        oilChangeFrequency: getNumberFromForm(formValues.oilChangeFrequency),
      },
      tiresCost: {
        tiresCost: getNumberFromForm(formValues.tiresCost, true),
        tiresLifetime: getNumberFromForm(formValues.tiresLifetime),
      },
      desiredMonthlyProfit: getNumberFromForm(formValues.desiredMonthlyProfit, true),
      kmDriven: getNumberFromForm(formValues.kmDriven),
    });
  }
}
