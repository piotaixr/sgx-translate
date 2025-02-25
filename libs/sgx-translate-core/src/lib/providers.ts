import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
  Type,
} from '@angular/core';
import { CurrentLanguageService } from './current-language.service';
import {
  KeyAsMissingTranslationHandler,
  MissingTranslationHandler,
} from './missing-translation-handler';
import {
  HttpLoader,
  Language,
  PartialInjectableDef,
  StaticLanguageLoader,
  TranslateService,
  TranslationDict,
  TranslationLoader,
} from './translate.service';

export function provideLocalTranslations(...providers: Provider[]): Provider[] {
  return [...providers, TranslateService];
}

export function withStaticLanguageValues(
  lang: Language,
  translations: TranslationDict
) {
  return {
    provide: TranslationLoader,
    multi: true,
    useFactory: () => new StaticLanguageLoader({ [lang]: translations }),
  };
}

export function withRemoteTranslation(lang: string, url: string) {
  return {
    provide: TranslationLoader,
    useFactory: () => new HttpLoader(lang, url),
    multi: true,
  };
}

export function withLoader(loaderDef: PartialInjectableDef): Provider {
  return {
    ...loaderDef,
    provide: TranslationLoader,
  };
}

export const TranslationLoader = new InjectionToken<TranslationLoader>(
  'TranslationLoader'
);

export function withDefaultLanguage(lang: Language) {
  return {
    provide: DefaultLanguage,
    useValue: lang,
  };
}

export function withTranslationLoader<T extends TranslationLoader>(
  loader: Type<T>
): Provider[] {
  return [
    loader,
    {
      provide: TranslationLoader,
      useExisting: loader,
      multi: true,
    },
  ];
}

export function useKeyAsMissingTranslation(): Provider {
  return {
    provide: MissingTranslationHandler,
    useClass: KeyAsMissingTranslationHandler,
  };
}

export function provideSgxTranslate(
  config: { defaultLanguage: string },
  ...providers: Provider[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    TranslateService,
    CurrentLanguageService,
    ...providers,
    withDefaultLanguage(config.defaultLanguage),
  ]);
}
