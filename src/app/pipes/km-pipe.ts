import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'km',
})
export class KmPipe implements PipeTransform {
  public transform(value: unknown): string {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue == 0) {
      return '0 km';
    }

    const formated = new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numberValue);

    return `${formated} km`;
  }
}
