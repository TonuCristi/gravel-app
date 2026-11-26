import { signalStore, withMethods, withState } from '@ngrx/signals';

import { User } from './auth.models';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initalState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initalState),
  withMethods(() => ({})),
);
