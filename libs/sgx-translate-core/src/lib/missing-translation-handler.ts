import { InjectionToken } from '@angular/core';

const MissingTranslationHandler = new InjectionToken<MissingTranslationHandler>(
  'MissingTranslationHandler'
);

export interface MissingTranslationHandler {
  handleMissingTranslation(key: string, lang: string): string;
}

export class KeyAsMissingTranslationHandler
  implements MissingTranslationHandler
{
  handleMissingTranslation(key: string, lang: string): string {
    return key;
  }
}
