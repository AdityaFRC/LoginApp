// @flow

import Immutable from "immutable";
import Chat from "../records/chat";

export default function(state = new Immutable.OrderedMap(), action: Object) {
  switch (action.type) {
    case "LOAD_CHATS":
      return state.mergeDeep(action.chats.map(chat => [chat.id, new Chat(chat)]));
    case "LOAD_SUBCHATS":
      return state.mergeDeep(action.subchats.map(subchat =>
        [subchat.id, new Chat(Object.assign(subchat, {parent: action.parentId}))]
      )).update(action.parentId, chat => {
        const list = new Immutable.List(action.subchats.map(subchat => subchat.id));
        if (!chat) return new Chat({subchats: list});
        else return chat.set(
          "subchats", chat.subchats.toOrderedSet().union(list.toOrderedSet()).toList());
      });
    case "ADD_CHAT": {
      const newChat = new Chat(action.chat);
      return state.reverse().update(newChat.id, chat => chat ? chat.mergeDeep(newChat) : newChat)
        .reverse();
      // return state.update(newChat.id, chat => chat ? chat.splice(0, 0, newChat) : newChat);
    }
    case "UPDATE_CHAT":
      return state.update(action.id, chat => chat.mergeDeep(action.updates));
    case "LEAVE_CHAT":
      return state.delete(action.chatId);
    default:
      return state;
  }
}
