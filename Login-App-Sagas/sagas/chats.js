// @flow

import {put, call, take, takeEvery, takeLatest} from "redux-saga/effects";
import {
  loadChats,
  addChat,
  updateChat,
  toggleLoadingChatsState,
  loadSubchats
} from "../actions/chats";
import {addUsers} from "../actions/users";
import {requestLoadChat, startLoadChat, uploadChatPicture} from "../actions/active-chat";
import {setCreating, changeCurrentSessionExpired} from "../actions/current-user";
import {setError} from "../actions/errors";
import {toggleChatCreationPending, changeFirstTimeLoadingChats} from "../actions/ui/left-panel";
import {
  toggleRightPanel,
  openRightPanel,
  changeActivePanel
} from "../actions/ui/right-panel";
import {closeUserProfile} from "../actions/ui/main-panel";
import worker from "./worker";
import {setStorageItem, removeStorageItem} from "../helpers/storage";
import EduchatApi from "educhat_api_alpha";

// const versionDetailsWorker = worker("versionDetails", function*() {
//   yield call(ecapi.chat.getChats);
// });

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
const chatUserApi = new EduchatApi.Chat_userApi();
const fileApi = new EduchatApi.FileApi();

const loadChatsWorker = worker("loadChats", function*() {
  try {
    const opts = {};
    // use the helper function
    const getAllChats = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };

    const defaultClient = EduchatApi.ApiClient.instance;
    const Token = defaultClient.authentications.Token;
    Token.apiKey = localStorage.getItem("token");
    Token.apiKeyPrefix = "Token";
    const nextPageKeyword = "offset=";

    let finished = false;
    let firstTime = true;
    do {
      const [response] = yield call(getAllChats);
      const {next, results: {chats, users}} = JSON.parse(response.text);
      finished = !next;
      if (firstTime) {
        if (chats.length !== 0) {
          yield put(requestLoadChat(chats[0].id, null, false));
        }
        firstTime = false;
      }
      yield put(addUsers(users));
      yield put(loadChats(chats));
      yield put(toggleLoadingChatsState(false));
      yield put(changeFirstTimeLoadingChats());
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("LOAD_MORE_CHATS");
      yield put(toggleLoadingChatsState(true));
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
    && (response.body.detail === "Invalid token."
        || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get chats");
  }
});

const createChatWorker = worker("createChat", function*({name, ifSearchable, pictureObject}) {
  yield put(toggleChatCreationPending());

  // set these parameters regardless if there is a picture object or not
  const createChatDataSerializer = new EduchatApi.APIViewChatSerializer();
  createChatDataSerializer.name = name;
  createChatDataSerializer.is_class = false;
  createChatDataSerializer.parent = null;
  createChatDataSerializer.searchable = ifSearchable;
  createChatDataSerializer.is_bot = false;

  // if there is a picture object, upload the file then set picture parameter
  if (pictureObject !== null) {
    const chatProfilePictureOpts = {
      "upload": pictureObject
    };

    const uploadChatPicture = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(name, chatProfilePictureOpts, makeCallback(resolve, reject));
      });
    };

    const [chatPictureResponse] = yield call(uploadChatPicture);
    const newProfilePicture = chatPictureResponse.body.results;
    createChatDataSerializer.picture_file = newProfilePicture.id;
    }

    const opts = {
      "aPIViewChatSerializer": createChatDataSerializer
    };
  // use the helper function
  const createNewChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(createNewChat);
  const chat = response.body.results;
  yield put(addChat(chat));
  // Immediately switch to the new chat
  yield put(requestLoadChat(chat.id, null, false));
  // Close the creation UI
  yield put(setCreating(false));
  yield put({type: "setCreating", state: false});
  yield put(toggleChatCreationPending());
  yield put(openRightPanel());
});

const createSubchatWorker = worker("createSubchat",
function*({name, parentId, ifSearchable, isSubchatAnonymous}) {
  yield put(toggleChatCreationPending());
  // const chat = yield call(ecapi.chat.create, name, false, parentId,
  //                         {searchable: ifSearchable, is_anonymous: isSubchatAnonymous});
  const createSubChatDataSerializer = new EduchatApi.APIViewChatSerializer();
  createSubChatDataSerializer.name = name;
  createSubChatDataSerializer.parent = parentId;
  createSubChatDataSerializer.searchable = ifSearchable;
  createSubChatDataSerializer.is_anonymous = isSubchatAnonymous;
  createSubChatDataSerializer.is_bot = false;
  const opts = {
    "aPIViewChatSerializer": createSubChatDataSerializer
  };

  // use the helper function
  const createNewSubChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(createNewSubChat);
  const newSubchat = response.body.results;
  yield put(loadSubchats(parentId, [newSubchat]));
  yield put(addChat(newSubchat));
  // Immediately switch to the new chat
  yield put(requestLoadChat(newSubchat.id, parentId, true));
  // Close the creation UI
  yield put(toggleChatCreationPending());
  yield put(changeActivePanel("user"));
  yield put(setCreating("subchat_setup"));
  yield put(openRightPanel());
});

const changeChatDetailsWorker = worker("changeChatDetails", function*({id, name, desc}) {
  try {
    // yield call(ecapi.chat.changeDetails, id, {chat_name: name, chat_desc: desc});
    const patchChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    patchChatDataSerializer.name = name;
    patchChatDataSerializer.desc = desc;
    const opts = {
      "aPIViewChatSerializer": patchChatDataSerializer
    };

    // use the helper function
    const changeChatInfo = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatPartialUpdate(id, opts, makeCallback(resolve, reject));
      });
    };

    yield call(changeChatInfo);
    yield put(updateChat(id, {name: name, description: desc}));
  } catch (err) {
    yield put(setError("changeChatDetails", err.message));
  }
});

const changeChatInviteAllWorker = worker("changeChatInviteAll", function*({id, ifInviteAll}) {
  try {
    const patchChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    patchChatDataSerializer.add_new_users_from_parent = ifInviteAll;
    const opts = {
      "aPIViewChatSerializer": patchChatDataSerializer
    };

    // use the helper function
    const changeSubChatAddNewUsersFromParent = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatPartialUpdate(id, opts, makeCallback(resolve, reject));
      });
    };

    yield call(changeSubChatAddNewUsersFromParent);
    // yield call(ecapi.chat.changeAddNewUsersFromParentChat,
    // id, {ifSubchatInviteAll: ifInviteAll});
  } catch ([error, response]) {
    yield put(setError("changeChatInviteAll", response.text));
  }
});

const leaveChatWorker = worker("leaveChat", function*({chatId, userId}) {
  try {
    const leaveThisChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserDelete(chatId, userId, makeCallback(resolve, reject));
      });
    };

    yield call(leaveThisChat);
    // yield call(ecapi.chatUser.leave, chatId, userId);
    yield put(toggleRightPanel());
    yield call(removeStorageItem, "activeChatId");
    // const paginator = yield call(ecapi.chat.getChats);
    // const {value: {chats}} = yield paginator.next();
    const opts = {};
    // use the helper function
    const getAllChats = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };
    const [response] = yield call(getAllChats);
    const {results: {chats}} = JSON.parse(response.text);
    yield call(setStorageItem, "activeChatId", chats[0].id, false);
    yield put.resolve(startLoadChat(chats[0].id, null));
    yield put.resolve(requestLoadChat(chats[0].id, null, false));
  } catch([error, response]) {
    yield put(setError("leaveChat", response.text));
  }
});

const createOneToOneChatWorker = worker("createOneToOneChat", function*({otherUser}) {
  try {
    const createOneToOneChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    createOneToOneChatDataSerializer.name = "Chat with " + [otherUser.first_name];
    const opts = {
      "aPIViewChatSerializer": createOneToOneChatDataSerializer
    };

    // use the helper function
    const createOneToOneNewChat = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatCreate(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(createOneToOneNewChat);
    // const newChat = yield call(ecapi.chat.create, "Chat with " + [otherUser.first_name]);
    const newChat = response.body.results;
    // As this is only a one to one chat the chatList will only have one chat ID
    const chatList = [newChat.id];
    const users = [otherUser.id];

    // const newChatWithUser = yield call(ecapi.chatUser.add, chatList, users);
    const createChatUserPostSerializer = new EduchatApi.ChatUserPostSerializer();
    createChatUserPostSerializer.user = users;
    createChatUserPostSerializer.chat = chatList;
    const addUserToNewChatOpts = {
      "chatUserPostSerializer": createChatUserPostSerializer
    };

    const addUserToNewOneToOneChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserCreate(addUserToNewChatOpts, makeCallback(resolve, reject));
      });
    };

    const [newOnetoOneChatResponse] = yield call(addUserToNewOneToOneChat);
    const newChatWithUser = newOnetoOneChatResponse.body.results;
    yield put.resolve(addChat(newChatWithUser[0].chat));
    yield put(closeUserProfile());
    yield put(startLoadChat(newChat.id, null));
    yield put(requestLoadChat(newChat.id, null, false));
  } catch([error, response]) {
    yield put(setError("createOneToOneChat", response.text));
  }
});

export default function*() {
  // yield takeEvery("VERSION_DETAILS", versionDetailsWorker);
  yield takeEvery("REQUEST_LOAD_CHATS", loadChatsWorker);
  yield takeEvery("CREATE_CHAT", createChatWorker);
  yield takeEvery("CREATE_SUBCHAT", createSubchatWorker);
  yield takeLatest("CHANGE_CHAT_DETAILS", changeChatDetailsWorker);
  yield takeLatest("CHANGE_CHAT_INVITE_ALL", changeChatInviteAllWorker);
  yield takeEvery("LEAVE_CHAT", leaveChatWorker);
  yield takeLatest("CREATE_ONE_TO_ONE_CHAT", createOneToOneChatWorker);
}
