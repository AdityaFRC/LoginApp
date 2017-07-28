// @flow

export const toggleChatCreationDialog = () => ({type: "TOGGLE_CHAT_CREATION_DIALOG"});

export const toggleChatCreationPending = () => ({type: "TOGGLE_CHAT_CREATION_PENDING"});

export const toggleClassCreationPending = () => ({type: "TOGGLE_CLASS_CREATION_PENDING"});

export const changeNewChatName = (name: string) => ({type: "CHANGE_NEW_CHAT_NAME", name});

export const changeNewClassName = (name: string) => ({type: "CHANGE_NEW_CLASS_NAME", name});

export const changeNewClassCode = (classCode: string) =>
  ({type: "CHANGE_NEW_CLASS_CODE", classCode});

export const changeChatFilter = (chatFilter: string) => ({type: "CHANGE_CHAT_FILTER", chatFilter});

export const toggleNewChatPrivacy = () => ({type: "TOGGLE_NEW_CHAT_PRIVACY"});

// actions concerning User Dropdown Menu
export const toggleUserDropDownMenu = (value) => ({type: "TOGGLE_USER_DROP_DOWN_MENU", value});

export const setUserDropDownMenuState = (setting: (string|boolean)) =>
  ({type: "USER_DROP_DOWN_MENU_STATE_CHANGE", setting});

export const resetClassInformation = () => ({type: "RESET_CLASS_INFORMATION"});

export const changeFirstTimeLoadingChats = () => ({type: "CHANGE_FIRST_TIME_LOADING_CHATS"});

export const updateUnreadMessages = (newUnreadList) => ({
  type: "UPDATE_UNREAD_MESSAGES",
  newUnreadList
});
