import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { routes } from './app.routes';
import {provideHttpClient } from '@angular/common/http';
import { FlightStatusPipe } from './flight-status.pipe';
import {RecaptchaModule} from 'ng-recaptcha';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),FlightStatusPipe, importProvidersFrom(RecaptchaModule), provideAnimationsAsync()],
};
