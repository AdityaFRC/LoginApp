// @flow

export const toggleRightPanel = () => ({type: "TOGGLE_RIGHT_PANEL"});

export const openRightPanel = () => ({type: "OPEN_RIGHT_PANEL"});

export const closeRightPanel = () => ({type: "CLOSE_RIGHT_PANEL"});

export const changeActivePanel = (panel: string) => ({type: "CHANGE_ACTIVE_PANEL", panel});

export const toggleInviteInterface = () => ({type: "TOGGLE_INVITE_INTERFACE"});

export const refreshInviteSuggestionList = (firstName: string, lastName: string = "") =>
  ({type: "REFRESH_INVITE_SUGGESTION_LIST", firstName, lastName});

export const setInviteSuggestionList = (list: Array<Object>) =>
  ({type: "SET_INVITE_SUGGESTION_LIST", list});

export const loadInviteSuggestionListPage = list =>
  ({type: "LOAD_INVITE_SUGGESTION_LIST_PAGE", list});

export const requestPageInviteSuggestionList = () =>
  ({type: "REQUEST_PAGE_INVITE_SUGGESTION_LIST"});

export const closeInviteSuggestionList = () => ({type: "CLOSE_INVITE_SUGGESTION_LIST"});

export const addUserToInviteList = (user: Object) => ({type: "ADD_USER_TO_INVITE_LIST", user});

export const removeUserFromInviteList = (user: Object) =>
  ({type: "REMOVE_USER_FROM_INVITE_LIST", user});

export const clearInviteList = () => ({type: "CLEAR_INVITE_LIST"});

export const showInviteListErrorMessage = (errorType: string) =>
 ({type: "SHOW_INVITE_LIST_ERROR_MESSAGE", errorType});

export const updateInviteListErrorMessage = (errorType: string) =>
 ({type: "UPDATE_INVITE_LIST_ERROR_MESSAGE", errorType});

export const displayInviteListErrorMessage = () => ({type: "DISPLAY_INVITE_LIST_ERROR_MESSAGE"});

export const hideInviteListErrorMessage = () => ({type: "HIDE_INVITE_LIST_ERROR_MESSAGE"});

export const startInvitingUserToChat = () => ({type: "START_INVITING_USER_TO_CHAT"});

export const endInvitingUserToChat = () => ({type: "END_INVITING_USER_TO_CHAT"});
