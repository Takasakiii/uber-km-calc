import { Component, input } from '@angular/core';
import { MoneyPipe } from '../../pipes/money-pipe';
import { KmPipe } from '../../pipes/km-pipe';

@Component({
  selector: 'app-result-card-summary',
  imports: [MoneyPipe, KmPipe],
  templateUrl: './result-card-summary.html',
  styleUrl: './result-card-summary.css',
})
export class ResultCardSummary {
  public readonly desiredMonthlyProfit = input.required<number>();
  public readonly kmDriven = input.required<number>();
  public readonly kmValueMin = input.required<number>();
  public readonly kmSpend = input.required<number>();
}
