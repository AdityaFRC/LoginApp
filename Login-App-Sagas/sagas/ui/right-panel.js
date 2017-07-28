import {put, call, takeLatest, take} from "redux-saga/effects";

import {
  setInviteSuggestionList,
  loadInviteSuggestionListPage,
  closeInviteSuggestionList,
  displayInviteListErrorMessage,
  updateInviteListErrorMessage
} from "../../actions/ui/right-panel";
import worker from "../worker";
import EduchatApi from "educhat_api_alpha";

const showInviteListErrorMessageWorker =
 worker("showInviteListErrorMessage", function*(errorMessage) {
   yield put(updateInviteListErrorMessage(errorMessage.errorType));
   yield put(displayInviteListErrorMessage());
 });

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const getInviteSuggestionListApi = new EduchatApi.UserApi();

const refreshInviteSuggestionListWorker =
  worker("refreshInviteSuggestionList", function*({firstName, lastName}) {
    if (
      (typeof firstName !== "string" || firstName.trim() === "")
      && (typeof lastName !== "string" || lastName.trim() === "")
    ) {
      yield put(closeInviteSuggestionList());
      return;
    }

    const opts = {"firstNameIcontains": firstName, "lastNameIcontains": lastName};

    const getInviteSuggestionList = function() {
      return new Promise((resolve, reject) => {
        getInviteSuggestionListApi.userList(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(getInviteSuggestionList);
    console.log(response);
    const suggestionList = response.body.results;

    if (suggestionList.length) {
      yield put(setInviteSuggestionList(suggestionList));
    } else {
      yield put(closeInviteSuggestionList());
    }

    // const paginator = yield call(ecapi.user.search, firstName, {last_name: lastName});

    // let done;
    // let value;
    // let first = true;
    // do {
    //   ({value, done} = yield paginator.next());

    //   if (value) {
    //     const list = value;

    //     if (list.length === 0) {
    //       yield put(closeInviteSuggestionList());
    //     } else {
    //       yield put(first ? setInviteSuggestionList(list) : loadInviteSuggestionListPage(list));
    //       first = false;
    //     }
    //   }

    //   yield take("REQUEST_PAGE_INVITE_SUGGESTION_LIST");
    // } while (!done);
  });

export default function*() {
  yield takeLatest("REFRESH_INVITE_SUGGESTION_LIST", refreshInviteSuggestionListWorker);
  yield takeLatest("SHOW_INVITE_LIST_ERROR_MESSAGE", showInviteListErrorMessageWorker);
}
