// @flow

import React, {Component} from "react";
import styles from "../styles/SessionExpiredPopup.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";

import {logout} from "../actions/current-user";

@connect(state => ({
}), {
  logout
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class SessionExpiredPopup extends Component {

  logout = () => this.props.actions.logout();

  render() {
    return (
      <div
          styleName="session-expiration-confirm-popup-wrapper"
      >
        <div
            styleName="session-expiration-confirm-popup"
        >
          <h3>See you soon~</h3>
          <button
              styleName="session-expiration-confirm-button"
              onClick={this.logout}
          >
            Ok
          </button>
        </div>
        <div styleName="session-expiration-confirm-popup-background"/>
      </div>
    );
  }
}

