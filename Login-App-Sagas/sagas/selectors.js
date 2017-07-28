export const getCurrentUser = state => state.currentUser;

export const getActiveChat = state => state.activeChat;

export const getChat = id => state => state.chats.get(id);

export const getProfileUserData = state => state.ui.mainPanel.userProfilePopupData;

export const getMessageCount = state =>
  state.activeChat.messages ? state.activeChat.messages.size : 0;

export const getIsFirstTimeLoadingMessages = state =>
  state.activeChat.isFirstTimeLoadingMessages;

export const getUnreadMessages = state => state.ui.leftPanel.unreadMessages;
