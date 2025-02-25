import { HttpClient } from '@angular/common/http';
import {
  ClassSansProvider,
  ExistingSansProvider,
  FactorySansProvider,
  Inject,
  inject,
  Injectable,
  InjectionToken,
  Optional,
  Self,
  signal,
  ValueSansProvider,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CurrentLanguageService } from './current-language.service';
import { TranslationLoader } from './providers';

@Injectable()
export class TranslateService {
  readonly #store = signal<Record<string, Record<string, string>>>({});
  readonly #parent = inject(TranslateService, {
    optional: true,
    skipSelf: true,
  });
  readonly #currentLanguage = inject(CurrentLanguageService);

  constructor(
    @Inject(TranslationLoader)
    @Self()
    @Optional()
    loaders: TranslationLoader[]
  ) {
    if (loaders) {
      const promises = loaders.map((loader) => loader.loadTranslations());
      Promise.all(promises).then((loadedTranslations) => {
        loadedTranslations.forEach((langTranslations) => {
          Object.entries(langTranslations).forEach(([lang, translations]) => {
            this.#store.set({
              ...this.#store(),
              [lang]: {
                ...(this.#store()[lang] ?? {}),
                ...translations,
              },
            });
          });
        });

        console.log('Translations loaded', this.#store());
      });
    }
  }

  translate(key: string, lang?: string): string {
    const currentLang = this.#currentLanguage.currentLanguage();
    const targetLang = lang ?? currentLang;

    const result = this.localTranslate(key, targetLang);
    if (result) {
      return result;
    } else if (this.#parent) {
      return this.#parent.translate(key, targetLang);
    } else {
      return key;
    }
  }

  private localTranslate(key: string, lang: string): string | undefined {
    const language = this.#store()[lang];
    if (!language) {
      return key;
    }

    return language[key];
  }
}

export class HttpLoader implements TranslationLoader {
  readonly #http = inject(HttpClient);
  readonly #lang: string;
  readonly #url: string;

  constructor(lang: string, url: string) {
    this.#lang = lang;
    this.#url = url;
  }

  async loadTranslations(): Promise<MultiLanguageTranslations> {
    const loaded = await firstValueFrom(
      this.#http.get<TranslationDict>(this.#url)
    );

    return { [this.#lang]: loaded };
  }
}

export type PartialInjectableDef =
  | ValueSansProvider
  | ClassSansProvider
  | FactorySansProvider
  | ExistingSansProvider;

export type Language = string;
export type TranslationDict = { [key: string]: string };
export type MultiLanguageTranslations = Record<Language, TranslationDict>;

export interface TranslationLoader {
  loadTranslations(): Promise<MultiLanguageTranslations>;
}

export class StaticLanguageLoader implements TranslationLoader {
  constructor(private translations: MultiLanguageTranslations) {}

  loadTranslations(): Promise<MultiLanguageTranslations> {
    return Promise.resolve(this.translations);
  }
}

export const DefaultLanguage = new InjectionToken<Language>('DefaultLanguage');
