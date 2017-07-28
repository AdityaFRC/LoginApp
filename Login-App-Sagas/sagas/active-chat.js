import {put, call, select, take, fork, takeLatest, takeEvery} from "redux-saga/effects";

import {
  startLoadChat,
  loadMessagesPage,
  addPendingMessage,
  confirmPendingMessage,
  loadUsersPage,
  loadResourcesPage,
  addResource,
  loadAdmins,
  loadTas,
  loadComments,
  addPendingComment,
  confirmPendingComment,
  cancelPendingMessage,
  cancelPendingComment,
  changeIfAllFilesLoaded,
  changeIfAllSubchatsLoaded,
  allMessagesLoaded,
  startUploadingChatPicture,
  finishedUploadChatPicture,
  isFirstTimeLoadingMessages,
  pickUpCounter
} from "../actions/active-chat";
import {loadSubchats, loadChats} from "../actions/chats";
import {addUsers} from "../actions/users";
import {setError} from "../actions/errors";
import {toggleInviteInterface,
  clearInviteList,
  hideInviteListErrorMessage,
  startInvitingUserToChat,
  endInvitingUserToChat
} from "../actions/ui/right-panel";
import {logout, setCreating, changeCurrentSessionExpired} from "../actions/current-user";
import ecapi, {AUTH_ERROR} from "../ecapi";
import {
  getCurrentUser,
  getActiveChat,
  getChat,
  // getMessageCount,
  getIsFirstTimeLoadingMessages
} from "./selectors";
import worker from "./worker";
import {setStorageItem, removeStorageItem} from "../helpers/storage";

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
const tagApi = new EduchatApi.TagApi();
const fileApi = new EduchatApi.FileApi();
const chatApi = new EduchatApi.ChatApi();
const chatUserApi = new EduchatApi.Chat_userApi();
const messageApi = new EduchatApi.MessageApi();

function* loadUserHelper(id, parentId, ifOnlyParent) {
  // const paginator = (ifOnlyParent)
  //   ? yield call(ecapi.chatUser.getAll, parentId) : yield call(ecapi.chatUser.getAll, id);

  const opts = {
    "chat": ifOnlyParent ? parentId : id
  };
  // use the helper function
  const getAllUsers = function() {
    return new Promise((resolve, reject) => {
      chatUserApi.chatUserList(opts, makeCallback(resolve, reject));
    });
  };

  const nextPageKeyword = "offset=";
  let done = false;
  const userList = {};
  do {
    const [response] = yield call(getAllUsers);
    const {next, results} = JSON.parse(response.text);
    done = !next;
    if (results) {
      if (results.size !== 0) {
        const activeChat = results[0].chat;
        yield put(loadChats([activeChat]));
      }

      for (const eachUser of results) {
        userList[eachUser.user.id] = eachUser.user;
      }
    }
    if (next && next.indexOf(nextPageKeyword) !== -1) {
      const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
      if (Number.isNaN(nextNumber)) {
        break;
      }
      opts.offset = nextNumber;
    } else {
      break;
    }
  } while (!done);

  // let done = false;
  // let value;
  // const userList = {};
  //
  // do {
  //   ({value, done} = yield paginator.next());
  //
  //   if (value) {
  //     if (value.size !== 0) {
  //       const activeChat = value[0].chat;
  //       yield put(loadChats([activeChat]));
  //     }
  //
  //     // const currentUser = yield select(getCurrentUser);
  //     for (const eachUser of value) {
  //       userList[eachUser.user.id] = eachUser.user;
  //     }
  //   }
  // } while (!done);
  yield put(addUsers(userList));
  yield put(loadUsersPage(id, Object.keys(userList).map(id => +id)));
}

function* loadMessagesHelper(id) {
  // const paginator = yield call(ecapi.chat.getMessages, id);
  // let done;
  // let value;
  // let offset;
  // do {
  //   offset = yield select(getMessageCount);
  //   ({value, done} = yield paginator.getPage(offset));
  //
  //   if (value) {
  //     const {messages} = value;
  //     yield put(loadMessagesPage(id, messages));
  //     yield put(isFirstTimeLoadingMessages(false));
  //   }
  //
  //   yield take("REQUEST_PAGE_MESSAGES");
  // } while (!done);
  try {
    const opts = {};
    // use the helper function
    const getAllMessages = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageList(id, opts, makeCallback(resolve, reject));
      });
    };
    const nextPageKeyword = "offset=";

    let finished = false;
    do {
      const [response] = yield call(getAllMessages);
      const {next, results} = JSON.parse(response.text);
      finished = !next;
      if (results) {
        const {messages} = results;
        yield put(loadMessagesPage(id, messages));
        yield put(isFirstTimeLoadingMessages(false));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("REQUEST_PAGE_MESSAGES");
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get messages");
  }
  yield put(allMessagesLoaded(true));
}

function* loadSubchatsHelper(parent) {
  // const paginator = yield call(ecapi.chat.getChats, {parent});
  // let done;
  // do {
  //   const {value: {chats}, done} = yield paginator.next();
  //
  //   yield put(loadSubchats(parent, chats));
  //   if (done) {
  //     break;
  //   }
  //   yield take("REQUEST_LOAD_SUBCHATS");
  // } while (!done);
  // yield put(changeIfAllSubchatsLoaded(true));
  try {
    const opts = {
      "parent": parent
    };
    // use the helper function
    const getAllSubChats = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };

    const nextPageKeyword = "offset=";
    const endPageKeyword = "&parent=";

    let finished = false;
    do {
      const [response] = yield call(getAllSubChats);
      const {next, results} = JSON.parse(response.text);
      finished = !next;
      if (results) {
        const {chats} = results;
        yield put(loadSubchats(parent, chats));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber =
          next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length,
            next.indexOf(endPageKeyword));
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("REQUEST_LOAD_SUBCHATS");
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get subchats");
  }
  yield put(changeIfAllSubchatsLoaded(true));
}

function* loadPrivilegedUsersHelper(id) {
  const {admins, tas} = yield call(ecapi.chat.getPrivilegedUsers, id);

  yield put(loadAdmins(id, admins));
  yield put(loadTas(id, tas));
}

function* loadResourcesHelper(id) {
  const paginator = yield call(ecapi.chat.getResources, id);

  let done;
  let value;
  do {
    ({value, done} = yield paginator.next());

    if (value) {
      const {messages: resources} = value;
      yield put(loadResourcesPage(id, resources));
    }
    if (done) {
      break;
    }
    yield take("REQUEST_PAGE_RESOURCES");
  } while (!done);

  // try {
  //   const opts = {};
  //   // use the helper function
  //   const getAllChatResources = function() {
  //     return new Promise((resolve, reject) => {
  //       chatApi.chatResourcesList(id, id, opts, makeCallback(resolve, reject));
  //     });
  //   };
  //
  //   const nextPageKeyword = "offset=";
  //   // const endPageKeyword = "&parent=";
  //
  //   let finished = false;
  //   do {
  //     alert(1);
  //     const [response] = yield call(getAllChatResources);
  //     alert(1);
  //     console.log(response);
  //     const {next, results} = JSON.parse(response.text);
  //     alert(1);
  //     finished = !next;
  //     if (results) {
  //       console.log(results);
  //       const {messages} = results;
  //       yield put(loadResourcesPage(id, messages));
  //     }
  //     if (next && next.indexOf(nextPageKeyword) !== -1) {
  //       const nextNumber =
  //         next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
  //       if (Number.isNaN(nextNumber)) {
  //         break;
  //       }
  //       opts.offset = nextNumber;
  //     } else {
  //       break;
  //     }
  //     yield take("REQUEST_PAGE_RESOURCES");
  //   } while (!finished);
  // } catch ([error, response]) {
  //   alert("WTF");
  //   if (error.status === 401
  //     && (response.body.detail === "Invalid token."
  //     || response.body.detail === "Authentication credentials were not provided.")) {
  //     yield put(changeCurrentSessionExpired());
  //   }
  //   console.error("fail to get chats resources");
  // } finally {
  //   alert("end");
  // }
  yield put(changeIfAllFilesLoaded(true));
}

const loadChatWorker = worker("loadChat", function*({id, parentId, onlyParentChatUser}) {
  if (parentId !== null) {
    const self = yield select(getChat(id));
    if (!self) yield call(loadSubchatsHelper, parentId);
  }

  yield put(setCreating(false));
  const firstTimeLoadingMessages = yield select(getIsFirstTimeLoadingMessages);
  if(firstTimeLoadingMessages) {
    yield put(isFirstTimeLoadingMessages(false));
  } else{
    yield put(isFirstTimeLoadingMessages(true));
  }

  // Block on this action so we know lists are emptied before getting new pages
  yield put.resolve(startLoadChat(id, parentId));
  yield put(clearInviteList());
  yield put(hideInviteListErrorMessage());

  if (onlyParentChatUser) {
    yield call(loadUserHelper, id, parentId, true);
    yield [
      call(loadMessagesHelper, id),
      call(loadPrivilegedUsersHelper, id)
    ];
  } else {
    yield call(loadUserHelper, id, null, false);
    if (parentId === null) { // you are clicking on parent class/chat
      yield [
        call(loadSubchatsHelper, id),
        fork(loadMessagesHelper, id),
        call(loadPrivilegedUsersHelper, id),
        fork(loadResourcesHelper, id)
      ];
    } else { // there are subchats
      yield [
        fork(loadMessagesHelper, id),
        call(loadPrivilegedUsersHelper, id),
        fork(loadResourcesHelper, id)
      ];
    }
  }

  yield call(setStorageItem, "activeChatId", id);

  if (parentId === null) yield call(removeStorageItem, "parentId");
  else yield call(setStorageItem, "parentId", parentId);
});

function* sendMessageHelper(tempId, text) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingMessage(tempId, {
    id: tempId,
    user: currentUser.id,
    text
  }));

  try {
    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    sendMessageDataSerialize.text = text;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendMessageOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendMessage = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendMessageOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendMessage);
    const sentMessage = response.body.results;

    // const sentMessage = yield call(ecapi.message.send, activeChat.id, currentUser.id, text);

    yield put(confirmPendingMessage(tempId, sentMessage));
  } catch (err) {
    // if (err === AUTH_ERROR) {
    //   yield put(logout(true));
    //   return;
    // }

    // TODO: Handle errors on a per-message basis
    yield put(cancelPendingMessage(tempId));
    yield put(setError("sendMessage", err));
  }
}

function* sendMessageSaga() {
  let tempMsgIdNum = 0;
  while(true) {
    const {text} = yield take("SEND_MESSAGE");
    const tempId = `msg${tempMsgIdNum++}`;
    yield fork(sendMessageHelper, tempId, text);
  }
}

function* sendFileHelper(tempId, {file, title, extension, text}) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingMessage(tempId, {
    id: tempId,
    user: currentUser.id,
    text,
    file: {
      extension: extension,
      name: title
    }
  }));

  try {
    // const sentMessage = yield call(ecapi.file.createAndSend, activeChat.id, currentUser.id,
    //                                file, title, extension, {text});
    // chat, user, file, name, extension, {text = "", parent}

    const fileOpts = {
      "upload": file
    };

    const uploadFile = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(title, fileOpts, makeCallback(resolve, reject));
      });
    };

    const [fileUploadResponse] = yield call(uploadFile);
    const newProfilePicture = fileUploadResponse.body.results;


    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    sendMessageDataSerialize.text = text;
    sendMessageDataSerialize.file = newProfilePicture.id;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendMessageOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendMessage = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendMessageOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendMessage);
    const sentMessage = response.body.results;

    yield put(confirmPendingMessage(tempId, sentMessage));
    yield put(addResource(sentMessage));
  } catch (err) {
    if (err === AUTH_ERROR) {
      yield put(logout(true));
      return;
    }

    // TODO: Handle errors on a per-message basis
    yield put(cancelPendingMessage(tempId));
    yield put(setError("sendFile", err));
  }
}

function* sendFileSaga() {
  let tempFileIdNum = 0;
  while (true) {
    const action = yield take("SEND_FILE");
    const tempId = `file${tempFileIdNum++}`;
    yield fork(sendFileHelper, tempId, action);
  }
}

const loadCommentsWorker = worker("loadComments", function*({messageId}) {
  const activeChat = yield select(getActiveChat);

  const chatId = activeChat.id;
  // const paginator = yield call(ecapi.message.getComments, chatId, messageId);
  // const {value: {users, messages: comments}} = yield paginator.next();

  try {
    const opts = {
      "parent": messageId
    };
    // use the helper function
    const getAllFileComments = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageList(chatId, opts, makeCallback(resolve, reject));
      });
    };

    const nextPageKeyword = "offset=";
    const endPageKeyword = "&parent=";

    let finished = false;
    do {
      const [response] = yield call(getAllFileComments);
      console.log(response);
      const {next, results} = JSON.parse(response.text);
      console.log(results);
      finished = !next;
      if (results) {
        const {users, messages: comments} = results;
        console.log(users);
        console.log(comments);
        yield put(addUsers(users));
        yield put(loadComments(chatId, messageId, comments));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber =
          next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length,
            next.indexOf(endPageKeyword));
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get comments");
  }

  // yield put(addUsers(users));
  // yield put(loadComments(chatId, messageId, comments));
});

function* sendCommentHelper(parentId, tempId, text) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingComment(parentId, tempId, {
    id: tempId,
    user: currentUser.id,
    text
  }));

  try {
    // const sentComment = yield call(ecapi.message.send, activeChat.id, currentUser.id, text,
    //                                {parent: parentId});
    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    sendMessageDataSerialize.text = text;
    sendMessageDataSerialize.parent = parentId;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendCommentOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendComment = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendCommentOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendComment);
    const {sentComment} = response.body.results;

    yield put(confirmPendingComment(parentId, tempId, sentComment));
  } catch ([error, response]) {
    // if (err === AUTH_ERROR) {
    //   yield put(logout(true));
    //   return;
    // }

    // TODO: Handle errors on a per-comment basis
    yield put(cancelPendingComment(parentId, tempId));
    yield put(setError("sendComment", response.text));
  }
}

function* sendCommentSaga() {
  let tempCmtIdNum = 0;
  while (true) {
    const {messageId, text} = yield take("SEND_COMMENT");
    const tempId = `cmt${tempCmtIdNum++}`;
    yield fork(sendCommentHelper, messageId, tempId, text);
  }
}

const inviteWorker = worker("invite", function*({users}) {
  try {
    yield put(startInvitingUserToChat());
    const activeChat = yield select(getActiveChat);
    const activeChatID = activeChat.id;
    const chatList = [];
    users.forEach(() => {
      chatList.push(activeChatID);
    });

    const createChatUserPostSerializer = new EduchatApi.ChatUserPostSerializer();
    createChatUserPostSerializer.user = users;
    createChatUserPostSerializer.chat = chatList;
    const addUserToThisChatOpts = {
      "chatUserPostSerializer": createChatUserPostSerializer
    };

    const addUserToThisChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserCreate(addUserToThisChatOpts, makeCallback(resolve, reject));
      });
    };

    yield call(addUserToThisChat);
    // yield call(ecapi.chatUser.add, chatList, users);
    yield put(toggleInviteInterface());
    yield put(clearInviteList());
    yield call(loadUserHelper, activeChat.id);
  } catch (err) {
    console.error("error inviting user ", err);
  } finally {
    yield put(endInvitingUserToChat());
  }
});


// const activateBotWorker = worker("activateBot", function*() {
//   const activeChat = yield select(getActiveChat);
//
//   yield call(ecapi.bot.activate, activeChat.id);
// });

const uploadChatPictureWorker = worker("uploadChatPicture", function*({picture, name}) {
  yield put(startUploadingChatPicture());
  const theActiveChat = yield select(getActiveChat);
  // const newChatPicture = yield call(ecapi.file.create, picture, name);
  // yield call(ecapi.chat.changePicture, theActiveChat.id, newChatPicture.results.id);
  const chatProfilePictureOpts = {
    "upload": picture
  };

  const uploadChatPicture = function() {
    return new Promise((resolve, reject) => {
      fileApi.fileCreate(name, chatProfilePictureOpts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(uploadChatPicture);
  const newProfilePicture = response.body.results;

  const chatUpdateSerializerData = new EduchatApi.APIViewChatSerializer();
  chatUpdateSerializerData.picture_file = newProfilePicture.id;

  const chatUpdateSerializerOpts = {
    "aPIViewChatSerializer": chatUpdateSerializerData
  };

  const chatPartialUpdate = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatPartialUpdate(theActiveChat.id, chatUpdateSerializerOpts, makeCallback(resolve, reject));
    });
  };

  yield call(chatPartialUpdate);

  yield put(finishedUploadChatPicture(newProfilePicture));
});

/* Sagas sit between actions and reducers, you can use them to manipulate and get the data you need
to update your state, every async thing is done in a saga(API requests, reading from local storage,
socket, etc..) async stuff is also called side-effects by some people.
Go to current-user saga to get to know about the main function in redux-sagas
*/

const updateCounterWorker = worker("updateCounter", function*() {
  yield call(alert, "Hey counter is working!");
  const message = "Hello world!";
  yield put(pickUpCounter(message));
});

const pickUpWorker = worker("updateCounter", function*({message}) {
  yield call(alert, `The message is ${message}`);
});

export default function*() {
  yield takeLatest("REQUEST_LOAD_CHAT", loadChatWorker);
  yield fork(sendMessageSaga);
  yield takeEvery("REQUEST_LOAD_COMMENTS", loadCommentsWorker);
  yield fork(sendCommentSaga);
  yield fork(sendFileSaga);
  yield takeEvery("INVITE", inviteWorker);
  // yield takeLatest("ACTIVATE_BOT", activateBotWorker);
  yield takeLatest("UPLOAD_CHAT_PICTURE", uploadChatPictureWorker);
  yield takeLatest("UPDATE_COUNTER", updateCounterWorker);
  yield takeLatest("PICK_COUNTER", pickUpWorker);
}
