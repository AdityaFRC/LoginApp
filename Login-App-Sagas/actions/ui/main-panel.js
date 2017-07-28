// @flow

export const changeHeaderType = (headerType: string) => ({type: "CHANGE_HEADER_TYPE", headerType});

export const toggleBotPanel = () => ({type: "TOGGLE_BOT_PANEL"});

export const setUserProfilePopupData = (userList) => {
  const userData = userList && userList[0];
  return {type: "SET_USER_PROFILE_POPUP_DATA", userData};
};

export const openUserProfile = (id) => ({type: "OPEN_USER_PROFILE", id});

export const closeUserProfile = () => setUserProfilePopupData(null);

export const updateTagsInMainPanelUserData = (tag) => ({type: "UPDATE_TAGS_TO_USERDATA", tag});

export const updateAreaOfStudyInMainPanelUserData = (tag) => ({type: "UPDATE_AREA_OF_STUDY_TO_USERDATA", tag});
