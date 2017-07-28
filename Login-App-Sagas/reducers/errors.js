// @flow

import Immutable from "immutable";

const ErrorState = Immutable.Record({
  login: "",
  refreshUniversitySuggestionList: "",
  signUp: "",
  logout: ""
});

export default function(state = new ErrorState(), action: Object) {
  switch (action.type) {
    case "ADD_ERROR":
      return state.set(action.key, action.error);
    case "DELETE_ERROR":
      return state.delete(action.key);
    default:
      return state;
  }
}
