import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum RentType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
}

export interface RentInfo {
  rentalPeriod: RentType;
  rentalValue: number;
  kmDriven: number;
}

export enum FuelType {
  Gas = 0,
  Ethanol = 1,
  Gnv = 2,
}

export interface FuelInfo {
  fuelType: FuelType;
  fuelPrice: number;
  fuelConsumption: number;
}

export interface CarInfo {
  carValue: number;
  ipva: number;
  depreciation: number;
  kmDriven: number;
  insuranceValue: number;
}

export interface OilCostInfo {
  oilChangeCost: number;
  oilChangeFrequency: number;
}

export interface TiresCostInfo {
  tiresCost: number;
  tiresLifetime: number;
}

export interface Data {
  rent?: RentInfo;
  fuel?: FuelInfo;
  carInfo?: CarInfo;
  oilCost?: OilCostInfo;
  tiresCost?: TiresCostInfo;
  installmentAmount?: number;
  desiredMonthlyProfit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResultCalc {
  private readonly router = inject(Router);
  private data: Data | null = null;

  public async processResult(values: Data): Promise<void> {
    this.data = values;
    console.log(this.data);
    await this.router.navigate(['/result']);
  }
}
