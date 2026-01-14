import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

interface MaskElement {
  pos: number;
  value: string;
  length: number;
  type: 'raw' | 'mask';
  isInfinity: boolean;
  splitChar: string | null;
  splitAt: number | null;
}

@Directive({
  selector: '[appMask]',
})
export class Mask implements OnInit {
  private readonly inputRef = inject<ElementRef<HTMLInputElement>>(ElementRef<HTMLInputElement>);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly mask = input.required<string>();
  public readonly formatType = input<'text' | 'number'>('text');
  public readonly formControl = input.required<FormControl>();

  private maskElements: MaskElement[] = [];
  private reverseMaskElements: MaskElement[] = [];
  private cursorPos = 0;

  public ngOnInit(): void {
    const maskTemplate = this.mask();
    const maskLength = maskTemplate.length;

    for (let c = 0; c < maskLength; c++) {
      const nextOpenBrace = maskTemplate.indexOf('{', c);

      if (maskTemplate[c] != '{') {
        const content = maskTemplate.substring(c, nextOpenBrace);
        this.maskElements.push({
          pos: c,
          value: content,
          isInfinity: false,
          length: content.length,
          splitAt: null,
          splitChar: null,
          type: 'raw',
        });

        c += content.length - 1;
        continue;
      }

      const closeBrace = maskTemplate.indexOf('}', c);
      const content = maskTemplate.substring(c + 1, closeBrace);

      if (content.includes('/')) {
        const splitedProps = content.split('/');
        const isInfinity = splitedProps.length == 3 && splitedProps[0] == '?';
        const splitAt = splitedProps.length == 3 ? Number(splitedProps[1]) : null;

        this.maskElements.push({
          pos: c,
          length: isInfinity ? 1 : Number(splitedProps[0]),
          isInfinity,
          splitAt,
          splitChar: splitAt != null ? splitedProps[2] : null,
          type: 'mask',
          value: content,
        });
      } else {
        this.maskElements.push({
          pos: c,
          length: Number(content),
          isInfinity: false,
          splitAt: null,
          splitChar: null,
          type: 'mask',
          value: content,
        });
      }
      c += content.length + 1;
    }

    this.reverseMaskElements = [...this.maskElements];
    this.reverseMaskElements.reverse();

    // this.renderMask('');
  }

  @HostListener('beforeinput', ['$event'])
  public handleBeforeInput(event: InputEvent): void {
    if (this.maskElements.length == 0) return;

    event.preventDefault();
    event.stopPropagation();

    const inputType = event.inputType;
    const newChar = event.data;

    let currentCleanValue = this.getCleanValue(this.inputRef.nativeElement.value);

    if (newChar && !inputType.includes('delete')) {
      if (this.formatType() == 'number' && isNaN(Number(newChar))) {
        return;
      }
      currentCleanValue += newChar;
    } else if (inputType.includes('delete')) {
      currentCleanValue = currentCleanValue.slice(0, -1);
    }

    this.renderMask(currentCleanValue);
    this.formControl().setValue(
      this.formatType() == 'number' ? Number(currentCleanValue) : currentCleanValue,
      {
        emitModelToViewChange: false,
        emitEvent: true,
      },
    );
  }

  private getCleanValue(displayValue: string): string {
    let clean = displayValue;

    this.maskElements
      .filter((el) => el.type === 'raw')
      .forEach((el) => {
        clean = clean.split(el.value).join('');
      });

    this.maskElements
      .filter((el) => el.type === 'mask' && el.splitChar)
      .forEach((el) => {
        if (el.splitChar) {
          clean = clean.split(el.splitChar).join('');
        }
      });

    clean = clean.replace(/\s/g, '');
    return clean;
  }

  private renderMask(cleanValue: string): void {
    let result = '';
    const pendingChars = cleanValue.split('');

    for (const el of this.reverseMaskElements) {
      if (el.type == 'raw') {
        result = el.value + result;
      } else {
        let chunk = '';

        if (el.isInfinity) {
          let charCount = 0;

          while (pendingChars.length > 0) {
            const char = pendingChars.pop();
            chunk = char + chunk;
            charCount++;

            if (
              el.splitAt != null &&
              el.splitChar != null &&
              charCount % el.splitAt === 0 &&
              pendingChars.length > 0
            ) {
              chunk = el.splitChar + chunk;
            }
          }
        } else {
          for (let i = 0; i < el.length; i++) {
            const char = pendingChars.pop();
            if (char) {
              chunk = char + chunk;
            } else {
              chunk = ' ' + chunk;
            }
          }
        }

        result = chunk + result;
      }
    }

    this.inputRef.nativeElement.value = result;
    this.formControl().setValue(result);
    this.cursorPos = result.length;

    if (isPlatformBrowser(this.platformId)) {
      if (typeof this.inputRef.nativeElement.setSelectionRange === 'function') {
        try {
          this.inputRef.nativeElement.setSelectionRange(this.cursorPos, this.cursorPos);
        } catch (e) {
          // Ignora erro
        }
      }
    }
  }
}
