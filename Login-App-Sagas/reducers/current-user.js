// @flow

import Immutable from "immutable";
import ImmutablePropTypes from "react-immutable-proptypes";

import School from "../records/school";
import Department from "../records/department";

import {getStorageItem} from "../helpers/storage";

const rememberedUser = JSON.parse(getStorageItem("user"));
const wantsRemembered = JSON.parse(getStorageItem("wantsRemembered"));

const CurrentUserState = Immutable.Record({
  email: rememberedUser ? rememberedUser.email : "",
  password: "",
  id: rememberedUser ? rememberedUser.id : null,
  isLoggedIn: !!rememberedUser,
  wantsRemembered: wantsRemembered !== null ? wantsRemembered : true,
  // Should be "chat", "class", or false
  isCreating: false,
  // used in account setting panel
  firstName: rememberedUser ? rememberedUser.first_name : "",
  lastName: rememberedUser ? rememberedUser.last_name : "",
  university: rememberedUser ? rememberedUser.university : "",
  universityName: rememberedUser ? rememberedUser.universityName : "",
  accountType: rememberedUser ? rememberedUser.type : "",
  school: rememberedUser ? rememberedUser.school : "",
  schoolName: rememberedUser ? rememberedUser.schoolName : "",
  department: rememberedUser ? rememberedUser.department : "",
  departmentName: rememberedUser ? rememberedUser.departmentName : "",
  yearOfGraduation: rememberedUser ? rememberedUser.year_of_graduation : "",
  // areaOfStudy: rememberedUser ? rememberedUser.areas_of_study : "",
  isUploadingPicture: false,
  newprofilePicUrl: "",
  hasMadeRequest: false,
  hasMadeSuccessfulCall: false,
  hasSessionExpired: false,
  schoolSuggestionList: null,
  departmentSuggestionList: null
}, {
  schoolSuggestionList: [Immutable.List, School],
  departmentSuggestionList: [Immutable.List, Department]
});

export default function(state = new CurrentUserState(), action: Object) {
  switch (action.type) {
    case "UPDATE_EMAIL":                          // Now when the action type CHANGE EMAIL is senses
      return state.set("email", action.email);    // it return the state "email" with the value of email entered
    case "UPDATE_PASSWORD":
      return state.set("password", action.password);
    // case "TOGGLE_WANTS_REMEMBERED":
    //   return state.set("wantsRemembered", !state.wantsRemembered);
    // case "LOGIN_SUCCESS":
    //     // Don't keep the password in memory as plaintext for longer than needed
    //   return state.merge({isLoggedIn: true, password: "", id: action.userId});
    // case "SET_CREATING":
    //   return state.set("isCreating", action.creating);
    // case "LOGOUT_SUCCESS":
    //   return state.merge({isLoggedIn: true, email: "", id: null});
    // case "START_UPLOADING_PICTURE":
    //   return state.set("isUploadingPicture", true);
    // case "FINISHED_UPLOAD_PICTURE":
    //   return state.set("isUploadingPicture", false);
    // case "UPDATE_USER_ACCOUNT_INFO":
    //   return state.merge({firstName: action.firstName, lastName: action.lastName,
    //     email: action.email, university: action.university,
    //     universityName: action.universityName, accountType: action.accountType,
    //     school: action.school, schoolName: action.schoolName, department: action.department,
    //     departmentName: action.departmentName, yearOfGraduation: action.yearOfGraduation, id: action.id});
    // case "HAS_MADE_SUCCESSFUL_USER_REQUEST":
    //   return state.merge({hasMadeRequest: true, hasMadeSuccessfulCall: true});
    // case "RESET_ACCOUNT_SETTING_FLASH_MESSAGE_STATUS":
    //   return state.merge({hasMadeRequest: false, hasMadeSuccessfulCall: false});
    // case "CHANGE_GRAD_YEAR":
    //   return state.set("yearOfGraduation", action.year);
    // case "CHANGE_AREA_OF_STUDY":
    //   return state.set("areaOfStudy", action.areaOfStudy);
    // case "CHANGE_CURRENT_SESSION_EXPIRED":
    //   return state.set("hasSessionExpired", true);
    // case "SET_SCHOOL_SUGGESTION_LIST":
    //   return state.set(
    //     "schoolSuggestionList",
    //     action.list && new Immutable.List(action.list.map(sch => new School(sch)))
    //   );
    // case "SET_DEPARTMENT_SUGGESTION_LIST":
    //   return state.set(
    //     "departmentSuggestionList",
    //     action.list && new Immutable.List(action.list.map(dep => new Department(dep)))
    //   );
    default:
      return state;
  }
}
