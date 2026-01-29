import { afterNextRender, Component, ElementRef, input, viewChild } from '@angular/core';

const ns = 'http://www.w3.org/2000/svg';

interface BarInfo {
  label: string;
  labelValue: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Data {
  label: string;
  value: number;
  labelValue: string;
}

@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrl: './graph.css',
})
export class Graph {
  public readonly data = input.required<Data[]>();

  protected graphElement = viewChild<ElementRef<SVGSVGElement>>('graphElement');

  private svgWidth = 0;
  private svgHeight = 0;
  private usableWidth = 0;
  private quarterWidth = 0;

  private x = 0;

  constructor() {
    afterNextRender(() => {
      const svgRef = this.graphElement()?.nativeElement;

      if (!svgRef) {
        return;
      }

      this.calcLengths(svgRef);
      this.drawHeaderSeparatorLine(svgRef);

      this.data().forEach((value, idx) => {
        const barInfo = this.drawBar(svgRef, value, idx);
        this.drawLabel(svgRef, barInfo);
        this.drawValueLabel(svgRef, barInfo);
      });

      console.log('finalizado');
    });
  }

  private calcLengths(svgRef: SVGSVGElement): void {
    this.svgWidth = svgRef.width.baseVal.value;
    this.svgHeight = svgRef.height.baseVal.value - 30;

    this.quarterWidth = this.svgWidth * 0.25;
    this.usableWidth = this.svgWidth - this.quarterWidth;
    this.x = this.svgWidth * 0.25;
  }

  private drawBar(svgRef: SVGSVGElement, value: Data, idx: number): BarInfo {
    const rect = document.createElementNS(ns, 'rect');

    const barHeight = (this.svgHeight - 50) / this.data().length;
    const barWidth = (this.usableWidth / 100.0) * value.value;

    const y = idx * (barHeight + 5) + 25;

    rect.setAttribute('x', String(this.x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('height', String(barHeight));
    rect.setAttribute('width', String(barWidth));
    rect.setAttribute('fill', 'darkslategray');

    svgRef.appendChild(rect);

    return {
      x: this.x,
      y: y,
      labelValue: value.labelValue,
      width: barWidth,
      height: barHeight,
      label: value.label,
    };
  }

  private drawHeaderSeparatorLine(svgRef: SVGSVGElement): void {
    const rect = document.createElementNS(ns, 'rect');

    const width = 1;
    const height = this.svgHeight - 15;

    const x = this.quarterWidth;
    const y = 15;

    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('height', String(height));
    rect.setAttribute('width', String(width));
    rect.setAttribute('fill', 'darkgray');

    svgRef.appendChild(rect);
  }

  private drawLabel(svgRef: SVGSVGElement, bar: BarInfo): void {
    const text = document.createElementNS(ns, 'text');

    text.textContent = bar.label;
    svgRef.appendChild(text);
    const labelBBox = text.getBBox();
    const textWidth = labelBBox.width;

    const x = this.quarterWidth - textWidth;
    const y = this.getBarCenterY(bar, labelBBox.height);
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y));

    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '0.85rem');
  }

  private getBarCenterY(bar: BarInfo, labelHeight: number = 0): number {
    return bar.y + bar.height / 2 + labelHeight / 4;
  }

  private drawValueLabel(svgRef: SVGSVGElement, bar: BarInfo): void {
    const text = document.createElementNS(ns, 'text');
    text.textContent = bar.labelValue;
    svgRef.appendChild(text);
    const textBBox = text.getBBox();
    const textWidth = textBBox.width;
    const barWidth = bar.width;
    const barX = bar.x;
    const isLabelInside = barX + barWidth + textWidth + 20 > this.svgWidth;
    const x = isLabelInside ? barX + barWidth - textWidth - 10 : barX + barWidth + 10;
    const y = this.getBarCenterY(bar, textBBox.height);

    text.setAttribute('x', String(x));
    text.setAttribute('y', String(y));
    text.setAttribute('fill', isLabelInside ? 'white' : 'black');
    text.setAttribute('font-size', '0.85rem');
  }
}
