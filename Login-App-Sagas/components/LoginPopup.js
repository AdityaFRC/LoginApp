// @flow

import React, {Component, PropTypes} from "react";
import styles from "../styles/LoginPopup.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {deleteError} from "../actions/errors";
import {onEnterKey, withDefaultPrevented} from "../helpers/events";
import {Link} from "react-router";

import {login, updateEmail, updatePassword} from "../actions/current-user";

@connect(state => ({
  loginError: state.errors.login,
  email: state.currentUser.email,
  password: state.currentUser.password
}), {
  deleteError,
  login,
  updateEmail,
  updatePassword
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class LoginPopup extends Component {

  componentWillUnmount() {
    const {actions} = this.props;
    actions.deleteError("login");
  }

  static propTypes = {
    loginError: PropTypes.any
  };

  static defaultProps = {
    loginError: null
  };
// //////////////////////////////////
// THIS IS VERY IMPORTANT STUFF
  onEmailChange = (e) => {
    const {actions} = this.props;

    actions.updateEmail(e.target.value); // it dispatches an action, then next it targets the event
  };                                     // hanldler and it's value and puts it in updateEmail in action

  onPasswordChange = (e) => {
    const {actions} = this.props;

    actions.updatePassword(e.target.value);
  };
// END OF IMPORTANT STUFF
// /////////////////////////////

  onLogin = () => {
    const {actions} = this.props;

    actions.login();
    this.resetPasswordField();
  };

  resetPasswordField = () => {
    this.setState({userPassword: ""});
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  goToHome = () => {
    window.location.href = "/";
  };

  close = () => {
    const {actions} = this.props;

    actions.deleteError("login");
    this.goToHome();
  };

  render() {
    const {loginError} = this.props;

    return (
  <form className="loginPopUp" styleName="login-form" onSubmit={withDefaultPrevented(this.onLogin)}>
    <h1>Login Form</h1>
    <p>
      Email:
      <input type="text" onChange={this.onEmailChange} />
    </p>
    <p>
      Password:
      <input type="password" onChange={this.onPasswordChange}/>
    </p>
            <input styleName="login-submit-button" type="submit" value="Log In"/>
          </form>
    );
  }
}

// export default CSSModules(LoginPopup, styles);
