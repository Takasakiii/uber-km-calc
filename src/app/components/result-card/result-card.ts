import { Component, computed, input } from '@angular/core';
import { MoneyPipe } from '../../pipes/money-pipe';

@Component({
  selector: 'app-result-card',
  imports: [MoneyPipe],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
  public readonly label = input.required<string>();
  public readonly value = input.required<number>();
  public readonly km = input<number | undefined>(undefined);

  protected readonly kmCost = computed(() => (this.km() ? this.value() / this.km()! : null));
}
