import { Action, createReducer, on } from '@ngrx/store';
import { AuthState, initialState } from './auth.state';
import { loginSuccess, signupSuccess } from './auth.actions';

const _authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, action): AuthState => {
    return {
      ...state,
      user: action.user,
    };
  }),
  on(signupSuccess, (state, action) => {
    return {
      ...state,
      user: action.user,
    };
  })
);

// export function AuthReducer(state: AuthState, action: User & { type: string }) {
// export function AuthReducer(state: AuthState, action: { email: string; password: string; type: string}) { // original
  export function AuthReducer(state: AuthState, action: Action) {
  return _authReducer(state, action);
}