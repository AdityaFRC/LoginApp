// @flow

import React, {Component, PropTypes} from "react";
import styles from "../styles/LoginPopup.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {requestPasswordChange, resetPassword, resetErrorMessage} from "../actions/current-user";
import bindState from "../helpers/bind-state";
import {withDefaultPrevented} from "../helpers/events";
import {Link} from "react-router";
import {onEnterKey} from "../helpers/events";
import {changeIfRequestSendingEmail} from "../actions/ui/onboarding";

@connect(state => ({
  loginError: state.errors.login,
  sendEmailError: state.ui.onboarding.sendEmailError,
  hasRequestSendingEmail: state.ui.onboarding.hasRequestSendingEmail
}), {
  requestPasswordChange,
  resetPassword,
  resetErrorMessage,
  changeIfRequestSendingEmail
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class ForgotPasswordPopup extends Component {
  static propTypes = {
    // loginError: PropTypes.any,
    resetKey: PropTypes.string
  };

  static defaultProps = {
    loginError: null,
    resetKey: null
  };

  state = {
    userPassword: "",
    userEmail: "",
    passwordsEqual: true,
    emailError: false
  };

  componentWillMount() {
    this.props.actions.changeIfRequestSendingEmail(false);
  }

  onRequest = () => {
    const {userEmail, hasRequestSendingEmail} = this.state;
    const {actions} = this.props;
    this.onResetErrorMessage();
    actions.requestPasswordChange(userEmail);

    if (hasRequestSendingEmail && !this.props.sendEmailError) {
      this.onResetErrorMessage();
    }
  };

  onReset = () => this.props.actions.resetPassword(this.props.resetKey, this.state.userPassword);

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  checkInputSchoolName = (e) => {
    if(this.state.userEmail === "") {
      this.setState({school: ""});
    } else {
      this.setState({school: "schoolEmailAddress"});
    }
  };

  onResetErrorMessage = () => this.props.actions.resetErrorMessage();

  render() {
    const {location: {query: {key}}, hasRequestSendingEmail} = this.props;
    const {passwordsEqual, emailError} = this.state;

    let emailSentform;
    if (hasRequestSendingEmail) {
      emailSentform = (
        <div styleName="sent-reset-password-email">
          <p>
            We have sent an email to {this.state.userEmail}.
          </p>
          <p>
            Click the link in the email to reset your password.
          </p>
        </div>
      );
    } else {
      emailSentform = (
        <div>
          <form
              className="loginPopUp"
              styleName="login-form"
              onSubmit={withDefaultPrevented(this.onRequest)}
          >
            <div styleName="user-account-field">
              <img
                  styleName="warning-icon"
                  alt="Warning Wrong Password"
                  src="/img/home/warning.svg"
                  style={{visibility: emailError ? "visible" : "hidden"}}
              />
              <div styleName="input-container">
                <input
                    styleName="email-input"
                    type="text"
                    {...bindState(this, "userEmail")}
                    placeholder="School Email Address"
                />
              </div>
            </div>
            <input
                styleName={
                  this.state.userEmail === ""
                  ?
                  "login-submit-button-inactive"
                  :
                  "login-submit-button"}
                type="submit"
                value="Send Email"
                disabled={
                  this.state.userEmail === ""
                  ?
                  "disabled"
                  :
                  ""}
            />
          </form>
        </div>
      );
    }

    return (
      <div styleName="login-popup-wrapper">
        <div // eslint-disable-line
            styleName="login-popup"
            onClick={this.stopPropagation}
        >
          <div styleName="login-header-container">
            <Link to="/">
              <span
                  onClick={this.onResetErrorMessage}
                  onKeyDown={onEnterKey(this.onResetErrorMessage)}
                  tabIndex="0"
                  role="button"
              >
                <img
                    styleName="close-icon"
                    src="/img/file_preview/close-icon.svg"
                    alt="To close Login Popup"
                />
              </span>
            </Link>
            <img styleName="edu-chat-logo" src="/img/educhat-logo2.png" alt="Edu Chat Logo"/>
            <div styleName="seperator"/>
            <h3 styleName="header-title">Forgot Password to Edu.Chat</h3>
            <br/>
            {this.props.sendEmailError ?
              <div style={{color: "red"}}>
                {this.props.sendEmailError}
              </div>
              :
              <div style={{visibility: "hidden"}}>
                Email Address is correct!
              </div>
            }
          </div>

          {key ?
            <div>
              <div
                  styleName="main-alert-message"
                  style={{visibility: passwordsEqual ? "hidden" : "visible"}}
              >
                Please confirm the password
              </div>
              <form
                  className="loginPopUp"
                  styleName="login-form"
                  onSubmit={withDefaultPrevented(this.onReset)}
              >
                <div styleName="user-account-field">
                  <img
                      styleName="warning-icon"
                      alt="Warning Wrong Password"
                      src="/img/home/warning.svg"
                      style={{visibility: passwordsEqual ? "hidden" : "visible"}}
                  />
                  <div styleName="input-container">
                    <input
                        styleName="password-input"
                        type="password"
                        placeholder="New Password"
                        {...bindState(this, "userPassword")}
                    />
                  </div>
                </div>
                <div styleName="user-account-field">
                  <img
                      styleName="warning-icon"
                      alt="Warning Wrong Password"
                      src="/img/home/warning.svg"
                      style={{visibility: passwordsEqual ? "hidden" : "visible"}}
                  />
                  <div styleName="input-container">
                    <input
                        styleName="password-input"
                        type="password"
                        onChange={this.onPasswordConfirmChange}
                        placeholder="Confirm Password"
                    />
                  </div>
                </div>
                <input
                    styleName="login-submit-button"
                    type="submit"
                    value="Set Password"
                    disabled={!passwordsEqual}
                />
              </form>
            </div>
          :
            <div>
              {emailSentform}
            </div>
          }

          <p styleName="signup-description">
            Dont have an account?&nbsp;
            <Link styleName="signup-link" to="/onboarding">
              Sign Up!
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
