// @flow

import {
  // Put takes an action object and dispatches it to the Redux store
  // (and therefore also to any sagas listening for it).
  // This is a non-blocking effect.
  // If you want to block the saga until the effect has been completely processed,
  // call put.resolve instead.
  put,

  // Call takes a function, or an array of form [receiver, function]
  // (the receiver is the value of `this` inside the function),
  // followed by any number of additional arguments to pass to the function.
  // It then performs the described function call and passes back in its return value.
  // If the function returns a Promise, it waits on the Promise.
  // If the function is a generator, it treats it as a saga (processes yield values as effects).
  // This effect is blocking. If you want to call a function non-blocking, use fork.
  call,

  // Select takes a selector function. This function is called similarly to the first argument to
  // @connect: it is called with the top-level Redux state. Whatever the selector returns is
  // returned to the saga. Select is a blocking effect.
  select,

  // Take is the core effect of sagas. It usually takes an action name. It can take other arguments,
  // but I've never needed them (see the actual docs for those). Take blocks the saga until an
  // action with that name is dispatched. Then it returns the action to the saga.
  take,

  // Fork is like call, but it spawns a non blocking attached Task. Attached means that:
  // a) the saga that forked will wait for the task to return before returning itself,
  // b) errors from the forked task will propagate to the parent.
  // To create a detached task, use spawn.
  // Fork returns a Task object that can be used to cancel the task, among other uses.
  fork,

  // TakeLatest takes the same argument as take, followed by a generator,
  // and forks a Task that watches for the given action.
  // When it sees that action, it forks an instance of the given generator, calling it with the
  // action.
  // If it sees another action of the same type while the last one is still being processed,
  // it cancels the existing task.
  // TakeEvery is like this, but without the cancelling (it can run multiple copies at once).
  // These two effects are useful for simple cases and provide functionality similar to thunks.
  takeLatest,

  // Cancel takes a Task object and cancels it. It is non-blocking.
  cancel,

  // Race takes an object of effects in the form {key1: effect1, key2: effect2, ...}
  // It returns an object of the form {winningKey: winningEffect},
  // where winningEffect is the return value of the first effect that returned,
  // and winningKey is its key from the input object.
  // Obviously, for this to make sense, all the effects you pass in should be blocking.
  race
} from "redux-saga/effects";


import {getCurrentUser} from "./selectors";
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

const loginAndOutApi = new EduchatApi.ApiApi(); // THIS IS THE API WE USE FOR LOGIN

// OUR AUTHORIZATION FUNCTION
function* authSaga() {
  while (true) {
     const currentUser = yield select(getCurrentUser);

// THIS CHECKS WHETHER USE IS LOGGED IN { isLoggedIn:true => It skips then succesfully logs in}
// IF {isLoggedin:fale =>runs the const them sends an LOGIN FUNCTION}
    if (!currentUser.isLoggedIn) {
      const {loginRequested} = yield race({
        loginRequested: take("LOGIN"),
      });

// NOW LOGIN IS REQUESTED
      if (loginRequested) {
        // THIS GETS DATA FROM GETCURRENTUSER
        const {email, password} = yield select(getCurrentUser);

        // DATA IS PASSED IN AND THEN ASSIGNED
        const loginData = new EduchatApi.LoginInput();
        loginData.username = email;
        loginData.password = password;
        loginData.platform = "web";
        const opts = {
          "loginInput": loginData // {LoginInput}
        };

// THIS FUNCTION CALLS API AND INSERTS DATA
        const getLogin = function() {
          return new Promise((resolve, reject) => {
            loginAndOutApi.apiLoginCreate(opts, makeCallback(resolve, reject));
          });
        };

// CALLS GETLOGIN
        try {
         const getLoginCall = yield call(getLogin);
          alert("LOGIN SUCESS");
        } catch ([err, response]) {
          alert("LOGIN ERROR");
        }
      }
    }
  }
}

export default function*() {
  yield fork(authSaga);
}
