// @flow

import Immutable from "immutable";
import ComplexRecord from "../helpers/complex-record";
import Message from "../records/message";
import File from "../records/file";
import {getStorageItem} from "../helpers/storage";
import CommentsRecord from "../records/comments-record";
import Chat from "../records/chat";

const ActiveChatState = ComplexRecord({
  id: (getStorageItem("activeChatId") && parseInt(getStorageItem("activeChatId"), 10)) || 0,
  parentId: getStorageItem("parentId") && parseInt(getStorageItem("parentId"), 10),
  messages: null,
  comments: Immutable.Map,
  pendingMessages: Immutable.OrderedMap,
  users: null,
  description: "",
  admins: null,
  tas: null,
  resources: null,
  filePreview: null,
  hasUnsentFile: false,
  ifAllFilesLoaded: false,
  ifAllSubchatsLoaded: false,
  hasMessagesLoaded: false,
  isUploadingChatPicture: false,
  isFirstTimeLoadingMessages: true,
  ifInviteNewFromParent: false,
  count: 0
}, {
  messages: [Immutable.List, Message],
  comments: [Immutable.Map, CommentsRecord],
  pendingMessages: [Immutable.OrderedMap, Message],
  users: Immutable.List,
  admins: Immutable.Set,
  tas: Immutable.Set,
  resources: Immutable.List,
  filePreview: File
});

export default function(state = new ActiveChatState(), action: Object) {
  switch (action.type) {
    case "START_LOAD_CHAT":
      // Currently no client-side caching,
      // so we delete the messages and users arrays from the previous chat
      return state.mergeDeep({
        id: action.id,
        parentId: action.parentId,
        messages: null,
        comments: new Immutable.Map(),
        pendingMessages: new Immutable.OrderedMap(),
        description: "",
        users: null,
        admins: null,
        tas: null,
        resources: null,
        filePreview: null,
        hasUnsentFile: false,
        ifAllFilesLoaded: false,
        ifAllSubchatsLoaded: false,
        hasMessagesLoaded: false,
        isUploadingChatPicture: false
      });
    case "CHECK_INVITE_NEW":
      return state.set("ifInviteNewFromParent", !state.ifInviteNewFromParent);
    case "LOAD_MESSAGES_PAGE":
      // Handle the possiblity of two clicks causing a race condition
      if (action.chatId !== state.id) return state;

      return state.update("messages", list => {
        const messages = action.messages.map(msg => {
          if (msg.file && !msg.file.extension && msg.file.name.indexOf(".") !== -1) {
            msg.file.extension = msg.file.name.split(".").pop().toLowerCase();
          }
          if (msg.file && !msg.file.created && msg.created) {
            msg.file.created = msg.created;
          }
          return new Message(msg);
        });
        // console.log("messages: " + messages);
        if (list === null) return new Immutable.List(messages);
        // Make a new list and concat to ensure the messages are added in the correct order
        return new Immutable.List(messages).concat(list);
      });
    case "ADD_PENDING_MESSAGE":
      return state.setIn(["pendingMessages", action.id], new Message(action.message));
    case "CONFIRM_PENDING_MESSAGE":
      if (!state.pendingMessages.has(action.id)) return state;

      return state.update("messages", list => {
        if (list === null) return list;
        const msg = action.message;
        if (msg.file && !msg.file.extension && msg.file.name.indexOf(".") !== -1) {
          msg.file.extension = msg.file.name.split(".").pop().toLowerCase();
        }
        if (msg.file && !msg.file.created && msg.created) {
          msg.file.created = msg.created;
        }
        return list.push(new Message(msg));
      }).deleteIn(["pendingMessages", action.id]);
    case "CANCEL_PENDING_MESSAGE":
      if (!state.pendingMessages.has(action.id)) return state;

      return state.deleteIn(["pendingMessages", action.id]);
    case "RECEIVE_MESSAGE":
      if (action.message.chat !== state.id) return state;

      return state.update("messages", list => {
        if (list === null) return list;
        const msg = action.message;
        if (msg.file && !msg.file.extension && msg.file.name.indexOf(".") !== -1) {
          msg.file.extension = msg.file.name.split(".").pop().toLowerCase();
        }
        if (msg.file && !msg.file.created && msg.created) {
          msg.file.created = msg.created;
        }
        return list.push(new Message(msg));
      });
    case "LOAD_COMMENTS":
      if (action.chatId !== state.id) return state;

      return state.setIn(["comments", action.messageId],
                         new CommentsRecord({confirmed: action.comments}));
    case "ADD_PENDING_COMMENT":
      return state.setIn(["comments", action.messageId, "pending", action.commentId],
                         new Message(action.comment));
    case "CONFIRM_PENDING_COMMENT":
      if (
        !state.comments.has(action.messageId)
        || !state.comments.getIn([action.messageId, "pending"]).has(action.commentId)
      ) return state;

      return state
        .updateIn(["comments", action.messageId, "confirmed"],
                  list => list.push(new Message(action.comment)))
        .deleteIn(["comments", action.messageId, "pending", action.commentId]);
    case "CANCEL_PENDING_COMMENT":
      if (
        !state.comments.has(action.messageId)
        || !state.comments.getIn([action.messageId, "pending"]).has(action.commentId)
      ) return state;

      return state.deleteIn(["comments", action.messageId, "pending", action.commentId]);
    case "RECEIVE_COMMENT":
      if (
        action.comment.chat !== state.id
        || !state.comments.has(action.comment.parent)
      ) return state;

      return state.updateIn(["comments", action.comment.parent, "confirmed"],
                            list => list.push(new Message(action.comment)));
    case "LOAD_RESOURCES_PAGE": {
      if (action.chatId !== state.id) return state;

      const resources = action.resources.map(resource => {
        if (resource.file && !resource.file.extension && resource.file.name.indexOf(".") !== -1) {
          resource.file.extension = resource.file.name.split(".").pop().toLowerCase();
        }
        if (resource.file && !resource.file.created && resource.created) {
          resource.file.created = resource.created;
        }
        return new Message(resource);
      });
      return state.update("resources", list => {
        if (list === null) return new Immutable.List(resources);
        return list.concat(resources);
      });
    }
    case "ADD_RESOURCE":
      if (action.message.chat !== state.id) return state;

      return state.update("resources", list => {
        if (list === null) return list;
        const resource = action.message;
        if (resource.file && !resource.file.extension && resource.file.name.indexOf(".") !== -1) {
          resource.file.extension = resource.file.name.split(".").pop().toLowerCase();
        }
        if (resource.file && !resource.file.created && resource.created) {
          resource.file.created = resource.created;
        }
        return list.reverse().push(new Message(resource)).reverse();
      });
    case "LOAD_USERS_PAGE":
      if (action.chatId !== state.id) return state;

      return state.update("users", list => {
        if (list === null) return new Immutable.List(action.users);
        return list.mergeDeep(action.users);
      });
    case "LOAD_ADMINS":
      if (action.chatId !== state.id) return state;

      return state.update("admins", set => {
        if (set === null) return new Immutable.Set(action.admins);
        return set.merge(action.admins);
      });
    case "LOAD_TAS":
      if (action.chatId !== state.id) return state;

      return state.update("tas", set => {
        if (set === null) return new Immutable.Set(action.tas);
        return set.merge(action.tas);
      });
    case "SET_FILE_PREVIEW":
      return state.set("filePreview", action.data);
    case "LEAVE_CHAT":
      return state.set("id", null);
    case "CHANGE_IF_EXISTS_UNSENT_FILE":
      return state.set("hasUnsentFile", action.hasUnsentFile);
    case "CHANGE_IF_ALL_FILES_LOADED":
      return state.set("ifAllFilesLoaded", action.allFilesLoaded);
    case "CHANGE_IF_ALL_SUBCHATS_LOADED":
      return state.set("ifAllSubchatsLoaded", action.allSubchatsLoaded);
    case "ALL_MESSAGES_HAVE_BEEN_LOADED":
      return state.set("hasMessagesLoaded", true);
    case "START_UPLOADING_CHAT_PICTURE":
      return state.set("isUploadingChatPicture", true);
    case "FINISHED_UPLOAD_CHAT_PICTURE":
      return state.set("isUploadingChatPicture", false);
    case "FIRST_TIME_LOADING_MESSAGES":
      return state.set("isFirstTimeLoadingMessages", action.isFirstTimeLoadingMessages);
    default:
      return state;
  }
}
