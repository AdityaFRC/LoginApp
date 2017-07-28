import Immutable from "immutable";

import ComplexRecord from "../../helpers/complex-record";
import University from "../../records/university";

const OnboardingState = ComplexRecord({
  activeStep: null,
  universitySuggestionList: null,
  signupSuccess: false,
  newAccountError: "",
  sendEmailError: "",
  hasRequestSendingEmail: false
}, {
  universitySuggestionList: [Immutable.List, University]
});

export default function(state = new OnboardingState(), action) {
  switch (action.type) {
    case "SET_ACTIVE_STEP":
      return state.set("activeStep", action.step);
    case "SET_UNIVERSITY_SUGGESTION_LIST":
      return state.set(
          "universitySuggestionList",
          action.list && new Immutable.List(action.list.map(uni => new University(uni)))
      );
    case "LOAD_UNIVERSITY_SUGGESTION_LIST_PAGE":
      return state.update("universitySuggestionList", list => {
        if (!action.list) return list;
        if (list === null) return new Immutable.List(action.list.map(uni => new University(uni)));
        return list.concat(action.list.map(uni => new University(uni)));
      });
    case "SIGNUP_SUCCESS":
      return state.set("activeStep", "success");
    case "SET_NEW_ACCOUNT_ERROR":
      return state.set("newAccountError", action.errorName);
    case "RESET_NEW_ACCOUNT_ERROR":
      return state.set("newAccountError", "");
    case "SEND_EMAIL_ERROR":
      return state.set("sendEmailError", action.errorName);
    case "RESET_ERROR_MESSAGE":
      return state.set("sendEmailError", "");
    case "CHANGE_IF_REQUEST_SENDING_EMAIL":
      return state.set("hasRequestSendingEmail", action.state);
    default:
      return state;
  }
}
