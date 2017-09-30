import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as logoutReducer } from './logout';
import { reducer as toggleSignupReducer } from './toggleSignup';
import { reducer as signupReducer } from './signup';

const reducers = [
  loginReducer,
  logoutReducer,
  toggleSignupReducer,
  signupReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
