// @flow

import {put, call, takeEvery} from "redux-saga/effects";

import {toggleClassCreationPending} from "../actions/ui/left-panel";
import {setCreating} from "../actions/current-user";
import {requestLoadChat, uploadChatPicture} from "../actions/active-chat";
import {addChat} from "../actions/chats";
import {resetClassName, resetClassCode} from "../actions/classes";
import worker from "./worker";
import EduchatApi from "educhat_api_alpha";

function* resetClassInfoWorker() {
  yield put(resetClassName());
  yield put(resetClassCode());
}

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};
const chatApi = new EduchatApi.ChatApi();
const fileApi = new EduchatApi.FileApi();


const createClassWorker = worker("createClass", function*({className, classCode, ifSearchable, pictureObject}) {
  yield put(toggleClassCreationPending());

  // set these parameters regardless if there is a picture object or not
  const createClassDataSerializer = new EduchatApi.APIViewChatSerializer();
  createClassDataSerializer.name = className;
  createClassDataSerializer.is_class = true;
  createClassDataSerializer.parent = null;
  createClassDataSerializer.searchable = ifSearchable;
  createClassDataSerializer.is_bot = false;
  createClassDataSerializer.is_read_only = true;
  createClassDataSerializer.course_code = classCode;

  // if there is a picture object, upload the file then set picture parameter
  if (pictureObject !== null) {
    const chatProfilePictureOpts = {
      "upload": pictureObject
    };

    const uploadChatPicture = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(className, chatProfilePictureOpts, makeCallback(resolve, reject));
      });
    };

    const [chatPictureResponse] = yield call(uploadChatPicture);
    const newProfilePicture = chatPictureResponse.body.results;
    createClassDataSerializer.picture_file = newProfilePicture.id;
  }

  const opts = {
    "aPIViewChatSerializer": createClassDataSerializer
  };

  // use the helper function
  const createNewChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(createNewChat);
  const newClass = response.body.results;

  // const newClass = yield call(ecapi.chat.create, className, true, null,
  //                         {searchable: ifSearchable, is_read_only: "True", course_code: classCode});
  yield put(addChat(newClass));
  // Immediately switch to the new chat
  yield put(requestLoadChat(newClass.id, null, false));
  yield put(setCreating(false));
  yield put(toggleClassCreationPending());
});


export default function*() {
  yield takeEvery("CREATE_CLASS", createClassWorker);
  yield takeEvery("RESET_CLASS_INFORMATION", resetClassInfoWorker);
}
