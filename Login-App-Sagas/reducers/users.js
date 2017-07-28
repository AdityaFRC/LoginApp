// @flow

import Immutable from "immutable";
import User from "../records/user";
import {getStorageItem} from "../helpers/storage";

const init = [];
const rememberedUser = JSON.parse(getStorageItem("user"));
if (rememberedUser) {
  init.push([rememberedUser.id, new User(rememberedUser)]);
}

export default function(state = new Immutable.Map(init), action: Object) {
  switch (action.type) {
    case "ADD_USERS": {
      const tuples = [];
      // for (const id in action.users) if (action.users.hasOwnProperty(id)) {
      for (const id in action.users) if (action.users.hasOwnProperty(id)) {
        const user = action.users[id];
        tuples.push([user.id, new User(user)]);
      }
      return state.mergeDeep(tuples);
    }
    case "ADD_USER":
      return state.set(action.user.id, new User(action.user));
    case "ADD_NEW_TAGS_SUCCESSFULLY":
      return state.updateIn([action.id, "tags"],
      tags => tags.push({id: action.tagId, tags: action.tag}));
    case "ADD_NEW_AREA_OF_STUDY_SUCCESSFULLY":
      return state.updateIn([action.id, "areas_of_study"],
        tags => tags.push({id: action.tagId, tags: action.tag}));
    case "CHANGE_FIRST_NAME":
      return state.updateIn([action.id, "first_name"], firstName => action.firstName);
    case "CHANGE_YEAR_OF_GRADUATION":
      return state.updateIn([action.id, "year_of_graduation"],
        yearOfGraduation => action.yearOfGraduation);
    default:
      return state;
  }
}
