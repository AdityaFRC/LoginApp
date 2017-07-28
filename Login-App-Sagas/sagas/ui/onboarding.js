import {put, call, takeLatest} from "redux-saga/effects";

import {
  setUniversitySuggestionList,
  // loadUniversitySuggestionListPage,
  closeUniversitySuggestionList,
  setActiveStep
} from "../../actions/ui/onboarding";
import worker from "../worker";
import {addError} from "../../actions/errors";
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

const getUniversityApi = new EduchatApi.InstitutionApi();

const refreshUniversitySuggestionListWorker =
  worker("refreshUniversitySuggestionList", function*({name}) {
    if (typeof name !== "string" || name.trim() === "") {
      yield put(closeUniversitySuggestionList());
      return;
    }

    const opts = {"nameIcontains": name}; // always limit the size to be 6

    const getUniversities = function() {
      return new Promise((resolve, reject) => {
        getUniversityApi.institutionUniversityList(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(getUniversities);
    const list = response.body.results;
    if (list.length) {
      yield put(setUniversitySuggestionList(list));
    } else {
      yield put(closeUniversitySuggestionList());
    }
    // const paginator = yield call(ecapi.institution.getUniversities, name);

    // let done;
    // let value;
    // let first = true;
    // do {
    //   ({value, done} = yield paginator.next());

    //   if (value) {
    //     const list = value;
    //     console.log(value);

    //     if (list.length) {
    //       yield put(
    //         first ? setUniversitySuggestionList(list) : loadUniversitySuggestionListPage(list)
    //       );
    //       first = false;
    //     } else {
    //       yield put(closeUniversitySuggestionList());
    //     }
    //   }

    //   // yield take("REQUEST_PAGE_UNIVERSITY_SUGGESTION_LIST");
    // } while (false && !done);
  });

const displayErrorWorker =
  worker("displayError", function*({key, error}) {
    if (key === "signUp") {
      yield put(setActiveStep("error"));
    }
    yield put(addError(key, error));
  });

export default function*() {
  yield takeLatest("REFRESH_UNIVERSITY_SUGGESTION_LIST", refreshUniversitySuggestionListWorker);
  yield takeLatest("SET_ERROR", displayErrorWorker);
}

