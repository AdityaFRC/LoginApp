import {put, call, takeLatest} from "redux-saga/effects";

import {setUserProfilePopupData} from "../../actions/ui/main-panel";
import worker from "../worker";
import EduchatApi from "educhat_api_alpha";

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const userApi = new EduchatApi.UserApi();

const openUserProfileWorker = worker("openUserProfile", function*({id}) {
  const opts = {"id": id};

  const getUserData = function() {
    return new Promise((resolve, reject) => {
      userApi.userList(opts, makeCallback(resolve, reject));
    });
  };
  // const userData = yield call(ecapi.user.get, id);
  const [response] = yield call(getUserData);
  yield put(setUserProfilePopupData(response.body.results));
});

export default function*() {
  yield takeLatest("OPEN_USER_PROFILE", openUserProfileWorker);
}
