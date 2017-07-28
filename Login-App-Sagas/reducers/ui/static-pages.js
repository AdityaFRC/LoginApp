import Immutable from "immutable";

const StaticPagesState = Immutable.Record({
  loginPopupActive: false,
  forgotPasswordPopupActive: false
});

export default function(state = new StaticPagesState(), action) {
  switch (action.type) {
    case "TOGGLE_LOGIN_POPUP":
      return state.set("loginPopupActive", !state.loginPopupActive);
    case "TOGGLE_FORGOT_PASSWORD":
      return state.set("forgotPasswordPopupActive", !state.forgotPasswordPopupActive);
    default:
      return state;
  }
}
