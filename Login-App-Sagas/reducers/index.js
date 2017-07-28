// @flow

import {combineReducers} from "redux";

import activeChat from "./active-chat";
import chats from "./chats";
import classes from "./classes";
import currentUser from "./current-user";
import errors from "./errors";
import users from "./users";
import ui from "./ui";

export default combineReducers({activeChat, chats, classes, currentUser, errors, users, ui});
