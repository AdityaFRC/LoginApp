// @flow

import {combineReducers} from "redux";

import leftPanel from "./left-panel";
import mainPanel from "./main-panel";
import rightPanel from "./right-panel";
import staticPages from "./static-pages";
import onboarding from "./onboarding";

export default combineReducers({leftPanel, mainPanel, rightPanel, staticPages, onboarding});
