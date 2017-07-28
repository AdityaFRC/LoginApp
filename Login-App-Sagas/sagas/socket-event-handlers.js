import {put, select, call, takeEvery} from "redux-saga/effects";

import {addUser} from "../actions/users";
import {updateChat, addChat} from "../actions/chats";
import {receiveMessage, loadUsersPage} from "../actions/active-chat";
import {updateUnreadMessages} from "../actions/ui/left-panel";
import {getActiveChat, getCurrentUser, getUnreadMessages} from "./selectors";
import {updateUnreadMessagesObj} from "../helpers/socket";

export function* messageReceived({message, user}) {
  const {id: currentUserId} = yield select(getCurrentUser);
  if(user.id !== currentUserId) {
    yield put(addUser(user));

    const chatId = message.chat;
    yield put(updateChat(chatId, message));

    const {id: activeChatId} = yield select(getActiveChat);
    if (chatId === activeChatId) {
      yield put(receiveMessage(message));
    } else {
      // alert("got a message from " + chatId + " but active chat is " + activeChatId);
      const unreadMessagesObj = yield select(getUnreadMessages);
      const newUnreadMsgsObj = yield call(updateUnreadMessagesObj, chatId, unreadMessagesObj);
      yield put(updateUnreadMessages(newUnreadMsgsObj));
    }
  }
}

export function* userInvitedToNewChat(chat) {
  yield put(addChat(chat));
}

// I have no idea what proper error handling for Socket.io is.
// It's an event, but I don't know what kind of objects to expect or if I need to do anything with
// them in order to recover.
// So for right now... I'm logging to the console.
// Please improve if you have wisdom I don't.
export function* error(err) {
  yield call([console, console.error], "Socket error", err);
}

export default function*() {
  yield takeEvery("MESSAGE_RECIVED", messageReceived);
}

