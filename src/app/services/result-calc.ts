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
  kmDriven: number;
}

export interface Result {
  rent: number;
  fuel: number;
  oil: number;
  tires: number;
  ipva: number;
  depreciation: number;
  insurance: number;
  installment: number;
  km: number;
}

@Injectable({
  providedIn: 'root',
})
export class ResultCalc {
  private readonly router = inject(Router);
  private result: Result | null = null;

  public async processResult(values: Data): Promise<void> {
    const km = ResultCalc.getFinalKm(values);
    this.result = {
      rent: ResultCalc.getRentCost(values.rent),
      fuel: ResultCalc.getFuelCost(km, values.fuel),
      oil: ResultCalc.getOilCost(km, values.oilCost),
      tires: ResultCalc.getTiresCost(km, values.tiresCost),
      ipva: ResultCalc.getIpvaCost(values.carInfo),
      depreciation: ResultCalc.getDepreciationCost(values.carInfo),
      insurance: ResultCalc.getInsuranceCost(values.carInfo),
      installment: values.installmentAmount ?? 0,
      km,
    };

    await this.router.navigate(['/result']);
  }

  public get resultValues(): Result | null {
    if (!this.result) return null;

    return { ...this.result };
  }

  private static getFinalKm(data: Data): number {
    if (data.rent) {
      switch (data.rent.rentalPeriod) {
        case RentType.Daily: {
          return data.kmDriven * 30;
        }

        case RentType.Weekly: {
          return data.kmDriven * 4;
        }

        default: {
          return data.kmDriven;
        }
      }
    }

    return data.kmDriven;
  }

  private static getFuelCost(km: number, fuel?: FuelInfo): number {
    if (!fuel) {
      return 0;
    }

    return km * (fuel.fuelPrice / fuel.fuelConsumption);
  }

  private static getRentCost(rent?: RentInfo): number {
    if (!rent) {
      return 0;
    }

    let rentValue = 0;

    switch (rent.rentalPeriod) {
      case RentType.Daily: {
        rentValue = rent.rentalValue * 30;
        break;
      }
      case RentType.Weekly: {
        rentValue = rent.rentalValue * 4;
        break;
      }
      default: {
        rentValue = rent.rentalValue;
        break;
      }
    }

    return rentValue;
  }

  private static getOilCost(km: number, oilCost?: OilCostInfo): number {
    if (!oilCost) {
      return 0;
    }

    return (km / oilCost.oilChangeFrequency) * oilCost.oilChangeCost;
  }

  private static getTiresCost(km: number, tires?: TiresCostInfo): number {
    if (!tires) {
      return 0;
    }

    return (km / tires.tiresLifetime) * tires.tiresCost;
  }

  private static getIpvaCost(carInfo?: CarInfo): number {
    if (!carInfo) {
      return 0;
    }

    return carInfo.ipva / 12;
  }

  private static getDepreciationCost(carInfo?: CarInfo): number {
    if (!carInfo) {
      return 0;
    }

    return (carInfo.carValue * (carInfo.depreciation / 100)) / 12;
  }

  private static getInsuranceCost(carInfo?: CarInfo): number {
    if (!carInfo) {
      return 0;
    }

    return carInfo.insuranceValue / 12;
  }
}
