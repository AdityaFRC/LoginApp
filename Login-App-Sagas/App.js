import React, {PureComponent, PropTypes} from "react";
import styles from "./styles/App.css";
import cssModules from "react-css-modules";
import {Router, Route, browserHistory} from "react-router";
import connect from "./helpers/connect-with-action-types";
import NotFound from "./pages/404";
import LoginPopup from "./components/LoginPopup";
import OnboardingPopup from "./components/OnboardingPopup";
import ChangeLog from "./components/ChangeLog";
import EduChatPanel from "./containers/EduChatPanel";
import ForgotPasswordPopup from "./components/ForgotPasswordPopup";

@cssModules(styles)
class App extends PureComponent {

  render() {
    return (
      <div>
      <LoginPopup/>
      </div>
    );
  }
}

export default App;
