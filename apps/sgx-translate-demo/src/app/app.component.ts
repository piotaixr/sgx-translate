import { Component, inject, Injectable } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CurrentLanguageService,
  MultiLanguageTranslations,
  provideLocalTranslations,
  TranslatePipe,
  TranslationLoader,
  withStaticLanguageValues,
} from '@sgx-translate/core';

@Injectable()
export class MyLoader implements TranslationLoader {
  loadTranslations(): Promise<MultiLanguageTranslations> {
    throw new Error('Method not implemented.');
  }
}

@Component({
  selector: 'app-nested-component',
  template: `
    <p>Nested translation: {{ 'some.nested.key' | translate }}</p>
    <p>A translation in the root store: {{ 'some.key' | translate }}</p>
  `,
  providers: [
    provideLocalTranslations(
      withStaticLanguageValues('fr', {
        'some.nested.key': 'Une traduction imbriquée',
      }),
      withStaticLanguageValues('en', {
        'some.nested.key': 'A nested translation',
      })
      // withTranslationLoader(MyLoader)
    ),
  ],
  imports: [TranslatePipe],
})
export class NestedComponent {}

@Component({
  imports: [RouterModule, NestedComponent, TranslatePipe],
  selector: 'app-root',
  template: `
    <button (click)="changeLanguage('en')">English</button>
    <button (click)="changeLanguage('fr')">French</button>
    <p>Root translation: {{ 'some.key' | translate }}</p>
    <app-nested-component />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sgx-translate-demo';
  readonly #currentLanguage = inject(CurrentLanguageService);

  changeLanguage(lang: string) {
    this.#currentLanguage.currentLanguage = lang;
  }
}
