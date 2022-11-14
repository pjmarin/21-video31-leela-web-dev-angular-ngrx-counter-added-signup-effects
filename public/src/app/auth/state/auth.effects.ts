import { AuthService } from './../../services/auth.service';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { loginStart, loginSuccess, signupStart, signupSuccess } from './auth.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setLoadingSpinner, setErrorMessage } from '../../store/Shared/shared.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions, 
    private authService: AuthService, 
    private store: Store,
    private router: Router
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMessage({ message: '' }));
            const user = this.authService.formatUser(data);
            return loginSuccess({ user });
          }),
          catchError(errResp => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage = this.authService.getErrorMessage(errResp.error?.error);
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        // ofType(loginSuccess), // opcion 2
        // Opcion 1 no definir un nuevo efect, unicamente incluir en el del login la action de signupSuccess
        ofType(...[ loginSuccess, signupSuccess ]),
        tap((action) => {
          this.store.dispatch(setErrorMessage({ message: '' }));
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  // Opcion 2 definir un nuevo effect para redireccionar en signup
  // signUpRedirect$ = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(signupSuccess),
  //       tap((action) => {
  //         this.store.dispatch(setErrorMessage({ message: '' }));
  //         this.router.navigate(['/']);
  //       })
  //     );
  //   },
  //   { dispatch: false }
  // );

  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap((action) => {
        return this.authService.signUp(action.email, action.password, action.repassword).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const user = this.authService.formatUser(data);
            return signupSuccess({ user });
          }),
          catchError((errResp) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage = this.authService.getErrorMessage(
              errResp.error?.error ? errResp.error?.error : errResp.error?.errors[0]?.msg
            );
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });
}