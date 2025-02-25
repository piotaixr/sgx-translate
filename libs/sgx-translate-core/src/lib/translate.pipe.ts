import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  #translateService = inject(TranslateService);

  transform(value: string, ...args: any[]): string {
    return this.#translateService.translate(value);
  }
}
