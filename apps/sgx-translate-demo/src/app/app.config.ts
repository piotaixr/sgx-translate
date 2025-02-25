import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  provideSgxTranslate,
  useKeyAsMissingTranslation,
  withRemoteTranslation,
  withStaticLanguageValues,
} from '@sgx-translate/core';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideSgxTranslate(
      { defaultLanguage: 'en' },
      withStaticLanguageValues('fr', { 'some.key': 'Une traduction' }),
      withRemoteTranslation('en', '/translations.en.json'),
      useKeyAsMissingTranslation()
    ),
    provideHttpClient(),
  ],
};
