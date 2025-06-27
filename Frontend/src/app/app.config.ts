import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FlightStatusPipe } from './flight-status.pipe';
import { RecaptchaModule } from 'ng-recaptcha';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr'; // ✅ Import Toastr provider
import { provideClientHydration } from '@angular/platform-browser';

// ✅ Import Social Login Providers
import { SocialAuthServiceConfig, GoogleLoginProvider,SocialLoginModule,GoogleSigninButtonModule } from '@abacritt/angularx-social-login';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    FlightStatusPipe,
    importProvidersFrom(RecaptchaModule),
    provideAnimationsAsync(),
    provideToastr(),
    provideClientHydration(),
    // ✅ Add Google OAuth Configuration
    importProvidersFrom(SocialLoginModule, GoogleSigninButtonModule),


    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('503737234528-153ofdt1ul26iu028adba3ar17fjd9jd.apps.googleusercontent.com'),
          },
        ],
        onError: (err) => {
          console.error('Google OAuth Error:', err);
        },
      } as SocialAuthServiceConfig,
    },

  ],
};
