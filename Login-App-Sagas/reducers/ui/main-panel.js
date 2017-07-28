// @flow

import ComplexRecord from "../../helpers/complex-record";
import User from "../../records/user";

const MainPanelState = ComplexRecord({
  // I don't know what this actually is, so I'm keeping it in the refactor
  mainHeaderType: "normal",
  // These two next properties could possibly
  // be factored out into their own state objects or otherwise moved
  botPanelActive: false,
  userProfilePopupData: null
}, {
  userProfilePopupData: User
});

export default function(state = new MainPanelState(), action: Object) {
  switch (action.type) {
    case "CHANGE_HEADER_TYPE":
      return state.set("mainHeaderType", action.headerType);
    case "TOGGLE_BOT_PANEL":
      return state.set("botPanelActive", !state.botPanelActive);
    case "SET_USER_PROFILE_POPUP_DATA":
      return state.set("userProfilePopupData", action.userData && new User(action.userData));
    case "FINISHED_UPLOAD_PICTURE":
      return state.setIn(["userProfilePopupData", "picture_file"], action.picture);
    case "UPDATE_TAGS_TO_USERDATA":
      return state.updateIn(["userProfilePopupData", "tags"], tags => tags.push(action.tag));
    case "UPDATE_AREA_OF_STUDY_TO_USERDATA":
      return state.updateIn(["userProfilePopupData", "areas_of_study"], areas => areas.push(action.tag));
    default:
      return state;
  }
}
