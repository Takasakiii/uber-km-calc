import { Component, inject, OnInit, signal } from '@angular/core';
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

  public async ngOnInit(): Promise<void> {
    const r = this.resultCalc.resultValues;
    if (!r) {
      await this.router.navigate(['/']);
      return;
    }

    this.result.set(r);
  }
}
