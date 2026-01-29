import { Component, inject, OnInit, signal } from '@angular/core';
import { Data as GraphData, Graph } from '../../components/graph/graph';
import { ResultCardSummary } from '../../components/result-card-summary/result-card-summary';
import { Title } from '../../components/title/title';
import { ResultCard } from '../../components/result-card/result-card';
import {
  ResultCalc,
  Result as ResultInterface,
} from '../../services/result-calc';
import { Router } from '@angular/router';
import { MoneyPipe } from '../../pipes/money-pipe';

interface CostCategory {
  label: string;
  cost: number;
}

interface CostPerKm {
  label: string;
  cost: number;
}

@Component({
  selector: 'app-result',
  imports: [Graph, ResultCardSummary, Title, ResultCard],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit {
  private readonly resultCalc = inject(ResultCalc);
  private readonly router = inject(Router);

  protected graphData: GraphData[] = [];
  protected readonly result = signal<ResultInterface | null>(null);

  public async ngOnInit(): Promise<void> {
    const r = this.resultCalc.resultValues;
    if (!r || r.km === 0) {
      await this.router.navigate(['/']);
      return;
    }

    this.result.set(r);

    const moneyPipe = new MoneyPipe();
    const costs: CostCategory[] = [
      { label: 'Aluguel', cost: r.rent },
      { label: 'Combustível', cost: r.fuel },
      { label: 'Óleo', cost: r.oil },
      { label: 'Pneus', cost: r.tires },
      { label: 'IPVA', cost: r.ipva },
      { label: 'Depreciação', cost: r.depreciation },
      { label: 'Seguro', cost: r.insurance },
      { label: 'Financiamento', cost: r.installment },
    ];

    const costsPerKm: CostPerKm[] = costs
      .filter((c: CostCategory) => c.cost > 0)
      .map((c: CostCategory) => ({
        label: c.label,
        cost: c.cost / r.km,
      }));

    if (costsPerKm.length === 0) {
      this.graphData = [];
      return;
    }

    const maxCost = Math.max(...costsPerKm.map((c: CostPerKm) => c.cost));

    this.graphData = costsPerKm.map(
      (item: CostPerKm): GraphData => ({
        label: item.label,
        labelValue: moneyPipe.transform(item.cost) + '/km',
        value: (item.cost / maxCost) * 100,
      }),
    );
  }
}
