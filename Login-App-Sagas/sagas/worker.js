import {put} from "redux-saga/effects";

import {setError, deleteError} from "../actions/errors";
import {logout} from "../actions/current-user";
import {AUTH_ERROR} from "../ecapi";

const isIterator = obj => obj[Symbol.iterator] === obj && typeof obj.next === "function";

// A lot of the sagas follow a simple "worker" model using takeEvery or takeLatest
// They generally handle errors the same way, so this function can be used to construct
// a worker with that error handling built in
//
// Arguments:
// name: The name of the worker, used as the key in the errors store
// worker: The generator to run
// clearOnRetry: Optional. false if you don't want to delete the error next time this worker runs
// customLogic: Optional. Either a generator or a function. Takes the thrown error as an argument,
//  possibly yields additional effects (only if it is a generator!), and then possibly returns a new
//  value to set as the error instead of what was initially thrown (undefined will be ignored)
const worker = (name, worker, clearOnRetry = true, customLogic) => function*(action) {
  if (clearOnRetry) yield put(deleteError(name));

  try {
    yield* worker(action);
  } catch (err) {
    if (err === AUTH_ERROR) {
      yield put(logout(true));
    } else {
      let errToUse = err;
      if (customLogic) {
        const customLogicReturnValue = customLogic(err);
        const customLogicResult = isIterator(customLogicReturnValue) ?
          yield* customLogicReturnValue :
          customLogicReturnValue;
        if (customLogicResult !== undefined) {
          errToUse = customLogicResult;
        }
      }

      yield put(setError(name, errToUse));
    }
  }
};

export default worker;
