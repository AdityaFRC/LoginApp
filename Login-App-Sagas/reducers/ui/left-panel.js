// @flow

import Immutable from "immutable";

const LeftPanelState = Immutable.Record({
  chatCreationDialogActive: false,
  chatCreationPending: false,
  classCreationPending: false,
  newChatName: "",
  newChatIsPrivate: true,
  chatFilter: "",
  newClassName: "",
  newClassCode: "",
  userDropDownMenuActive: false,
  // Should be one of the menu items, or false
  userDropDownMenuItemState: false,
  isLoadingMoreChats: false,
  firstTimeLoadingChats: true,
  successfulUserInfoUpdate: false,
  unreadMessages: {}
});

export default function(state = new LeftPanelState(), action: Object) {
  switch (action.type) {
    case "RESET_CLASS_NAME":
      return state.set("newClassName", "");
    case "RESET_CLASS_CODE":
      return state.set("newClassCode", "");
    case "TOGGLE_CHAT_CREATION_DIALOG":
      return state.set("chatCreationDialogActive",
        action.value !== undefined ? action.value : !state.chatCreationDialogActive);
    case "TOGGLE_USER_DROP_DOWN_MENU":
      return state.set("userDropDownMenuActive",
        action.value !== undefined ? action.value : !state.userDropDownMenuActive);
    case "USER_DROP_DOWN_MENU_STATE_CHANGE":
      return state.set("userDropDownMenuItemState", action.setting);
    case "TOGGLE_CHAT_CREATION_PENDING":
      return state.set("chatCreationPending", !state.chatCreationPending);
    case "TOGGLE_CLASS_CREATION_PENDING":
      return state.set("classCreationPending", !state.classCreationPending);
    case "CHANGE_NEW_CHAT_NAME":
      return state.set("newChatName", action.name);
    case "CHANGE_NEW_CLASS_NAME":
      return state.set("newClassName", action.name);
    case "CHANGE_NEW_CLASS_CODE":
      return state.set("newClassCode", action.classCode);
    case "CHANGE_CHAT_FILTER":
      return state.set("chatFilter", action.chatFilter);
    case "TOGGLE_NEW_CHAT_PRIVACY":
      return state.set("newChatIsPrivate", !state.newChatIsPrivate);
    case "TOGGLE_LOADING_CHATS_STATE":
      return state.set("isLoadingMoreChats", action.isLoading);
    case "CHANGE_FIRST_TIME_LOADING_CHATS":
      return state.set("firstTimeLoadingChats", false);
    case "USER_INFO_UPDATE":
      return state.set("successfulUserInfoUpdate", action);
    case "UPDATE_UNREAD_MESSAGES":
      return state.set("unreadMessages", action.newUnreadList);
    default:
      return state;
  }
}
