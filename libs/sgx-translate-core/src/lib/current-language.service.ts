import {
  Inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Language } from './translate.service';

@Injectable()
export class CurrentLanguageService {
  readonly #currentLanguage: WritableSignal<string>;

  constructor(@Inject(DefaultLanguage) private defaultLanguage: Language) {
    this.#currentLanguage = signal(this.defaultLanguage);
  }

  get currentLanguage(): Signal<string> {
    return this.#currentLanguage;
  }

  set currentLanguage(lang: string) {
    this.#currentLanguage.set(lang);
  }
}
