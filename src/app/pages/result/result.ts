import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Data, Graph } from '../../components/graph/graph';
import { ResultCardSummary } from '../../components/result-card-summary/result-card-summary';
import { Title } from '../../components/title/title';
import { ResultCard } from '../../components/result-card/result-card';
import {
  ResultCalc,
  Result as ResultInterface,
} from '../../services/result-calc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [Graph, ResultCardSummary, Title, ResultCard],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result implements OnInit {
  private readonly resultCalc = inject(ResultCalc);
  private readonly router = inject(Router);

  protected graphData: Data[] = [];
  protected readonly result = signal<ResultInterface | null>(null);

  protected readonly total = computed(() => {
    if (!this.result()) {
      return 0;
    }
    const r = this.result()!;
    return (
      r.rent +
      r.fuel +
      r.oil +
      r.tires +
      r.ipva +
      r.depreciation +
      r.insurance +
      r.installment
    );
  });

  public async ngOnInit(): Promise<void> {
    const r = this.resultCalc.resultValues;
    if (!r) {
      await this.router.navigate(['/']);
      return;
    }

    this.result.set(r);
  }
}
