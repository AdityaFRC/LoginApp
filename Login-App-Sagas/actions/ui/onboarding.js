export const setActiveStep = (step: string) => ({type: "SET_ACTIVE_STEP", step});

export const refreshUniversitySuggestionList = (name: string) =>
  ({type: "REFRESH_UNIVERSITY_SUGGESTION_LIST", name});

export const setUniversitySuggestionList = (list: Array<University>) =>
  ({type: "SET_UNIVERSITY_SUGGESTION_LIST", list});

export const loadUniversitySuggestionListPage = list =>
  ({type: "LOAD_UNIVERSITY_SUGGESTION_LIST_PAGE", list});

export const requestPageUniversitySuggestionList = () =>
  ({type: "REQUEST_PAGE_UNIVERSITY_SUGGESTION_LIST"});

export const closeUniversitySuggestionList = () => setUniversitySuggestionList(null);

export const signupSuccess = () => ({type: "SIGNUP_SUCCESS"});

export const setnewAccountError = (errorName: string) =>
  ({type: "SET_NEW_ACCOUNT_ERROR", errorName});

export const resetnewAccountError = () =>
  ({type: "RESET_NEW_ACCOUNT_ERROR"});

export const sendEmailError = (errorName: string) =>
  ({type: "SEND_EMAIL_ERROR", errorName});

export const changeIfRequestSendingEmail = (state: boolean) =>
  ({type: "CHANGE_IF_REQUEST_SENDING_EMAIL", state});

