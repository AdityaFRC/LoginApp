// @flow

export const requestLoadChats = () => ({type: "REQUEST_LOAD_CHATS"});

export const loadChats = (chats: Array<Object>) => ({type: "LOAD_CHATS", chats});

export const loadSubchats = (parentId: number, subchats: Array<Object>) =>
  ({type: "LOAD_SUBCHATS", parentId, subchats});

export const addChat = (chat: Object) => ({type: "ADD_CHAT", chat});

export const createChat = (name: string, ifSearchable: boolean, pictureObject: number) =>
  ({type: "CREATE_CHAT", name, ifSearchable, pictureObject});

export const createSubchat = (
  name: string,
  parentId: number,
  ifSearchable: boolean,
  isSubchatAnonymous: boolean
) =>
  ({type: "CREATE_SUBCHAT", name, parentId, ifSearchable, isSubchatAnonymous});

export const updateChat = (id: number, updates: Object) => ({type: "UPDATE_CHAT", id, updates});

export const leaveChat = (chatId, userId) => ({type: "LEAVE_CHAT", chatId, userId});

export const changeChatDetails = (id: number, name: string, desc: string) =>
  ({type: "CHANGE_CHAT_DETAILS", id, name, desc});

export const changeChatInviteAll = (id: number, ifInviteAll: Boolean) =>
  ({type: "CHANGE_CHAT_INVITE_ALL", id, ifInviteAll});

export const versionDetails = () => ({type: "VERSION_DETAILS"});

export const createOneToOneChat = (otherUser) => ({type: "CREATE_ONE_TO_ONE_CHAT", otherUser});

export const loadMoreChats = () => ({type: "LOAD_MORE_CHATS"});

export const toggleLoadingChatsState =
  (isLoading: boolean) => ({type: "TOGGLE_LOADING_CHATS_STATE", isLoading});
