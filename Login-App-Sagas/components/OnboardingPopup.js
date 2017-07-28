// @flow
/* eslint-disable react/jsx-no-bind */ // For now, I'm not fixing all the arrow functions in this

import React, {Component, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/Onboarding.css";
import connect from "../helpers/connect-with-action-types";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import University from "../records/university";
import {Link} from "react-router";
import {deleteError} from "../actions/errors";


import {
  setActiveStep,
  refreshUniversitySuggestionList,
  closeUniversitySuggestionList,
  resetnewAccountError
} from "../actions/ui/onboarding";
import {signUp} from "../actions/current-user";

function stopPropagation(e) {
  e.stopPropagation();
}

function clickUniversity(name) {
  const schoolInput = document.getElementsByClassName("school-input")[0];
  schoolInput.value = name;
}

@connect(state => ({
  onboardingStep: state.ui.onboarding.activeStep,
  universitySuggestionList: state.ui.onboarding.universitySuggestionList,
  signupSuccess: state.ui.onboarding.signupSuccess,
  signupError: state.errors.signUp,
  newAccountError: state.ui.onboarding.newAccountError
}), {
  setActiveStep,
  refreshUniversitySuggestionList,
  closeUniversitySuggestionList,
  resetnewAccountError,
  signUp,
  deleteError
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class OnboardingPopup extends Component {
  static propTypes = {
    onboardingStep: PropTypes.string,
    universitySuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(University)),
    signupSuccess: PropTypes.bool
  };

  static defaultProps = {
    universitySuggestionList: null,
    signupSuccess: false,
    onboardingStep: ""
  };

  state = {
    account_type: "",
    school: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    valid: false,
    componentSignupError: "",
    isUniversitySelected: false
  };

  constructor(props) {
    const {actions} = props;

    super(props);
    actions.closeUniversitySuggestionList();
    actions.setActiveStep("school-step");
  }

  changeOnboardingStep = step => {
    const {actions, signupSuccess, signupError} = this.props;

    if (signupSuccess) {
      actions.setActiveStep("success");
    } else if (signupError) {
      actions.setActiveStep("error");
    } else {
      actions.setActiveStep(step);
    }
  };

  searchUniversity = e => {
    const {actions} = this.props;

    this.setState({school: e.target.value.trim()});
    actions.refreshUniversitySuggestionList(e.target.value);
    this.setState({isUniversitySelected: false});
  };

  updateUniversity = universityId => this.setState({school: universityId});

  updateDetails = (e, key) => {
    this.setState({[key]: e.target.value});
  };

  onCheck = () => {
    if (this.state.email && this.state.last_name && this.state.first_name
    && this.state.password && this.state.confirm_password) {
      return true;
    } else {
      return false;
    }
  };

  onboardingSubmit = () => {
    this.props.actions.signUp(
      this.state.account_type,
      this.state.email,
      this.state.password,
      this.state.first_name,
      this.state.last_name,
      parseInt(this.state.school, 10)
    );
  };
  goBackOneStep = () => {
    const {onboardingStep, actions} = this.props;

    if (onboardingStep === "account-step") {
      this.setState({school: ""});
      actions.closeUniversitySuggestionList();
      // close suggestion list when go back
      actions.setActiveStep("school-step");
    } else if (onboardingStep === "details-step") {
      this.resetAccountErrors();
      actions.setActiveStep("account-step");
    } else if (onboardingStep === "error") {
      actions.setActiveStep("details-step");
    } else {
      actions.setActiveStep("school-step");
    }
    actions.deleteError("signUp");
  };

  chooseAccountType = (type) => {
    this.setState({account_type: type});
  };

  onSignUp = () => {
    this.resetAccountErrors();
    if (this.state.first_name.length <= 1) {
      this.setState({componentSignupError:
        "First Name needs to be at least two characters long"});
    } else if (this.state.last_name.length <= 1) {
      this.setState({componentSignupError:
        "Last Name needs to be at least two characters long"});
    } else if (this.state.password !== this.state.confirm_password) {
      this.setState({componentSignupError: "Passwords do not match"});
    } else {
      this.onboardingSubmit();
    }
  };

  resetAccountErrors = () => {
    const {actions} = this.props;
    this.setState({componentSignupError: ""});
    this.setState({isUniversitySelected: false});
    actions.resetnewAccountError();
    return true;
  };

  setUniversityError = () => {
    this.setState({componentSignupError: "Please select an University from the List"});
  };

  setUniversityTrue = () => {
    this.setState({isUniversitySelected: true});
  }

  render() {
    const {
      onboardingStep,
      accountType,
      universitySuggestionList,
      actions
    } = this.props;

    return (
      <div styleName="onboarding-popup-wrapper">
        {/* eslint-disable */}
        <div styleName="onboarding-popup-school" onClick={stopPropagation}>
        {/* eslint-enable */}
          <div styleName="onboarding-header-container">
            {onboardingStep !== "school-step" &&
              <span
                  onClick={this.goBackOneStep}
                  onKeyDown={onEnterKey(this.goBackOneStep)}
                  role="button"
                  tabIndex="0"
              >
                <img src="/img/back-arrow.svg" styleName="back-icon" alt=""/>
                <span styleName="back-word">Back</span>
              </span>
            }
            <Link to="/">
              <span
                  onClick={this.resetAccountErrors}
                  onKeyDown={onEnterKey(this.resetAccountErrors)}
                  tabIndex="0"
                  role="button"
              >
                <img
                    styleName="close-icon"
                    src="/img/onboarding/close-icon.svg"
                    alt="To close Login Popup"
                />
              </span>

            </Link>
            <img styleName="edu-chat-logo" src="/img/educhat-logo2.png" alt="Edu Chat Logo"/>
            <div styleName="seperator"/>
            <h3 styleName="header-title">Let’s Get Started</h3>
          </div>
          <div styleName="main-alert-message" style={{visibility: "visible"}}>
            {this.state.componentSignupError}
            {this.props.newAccountError}
          </div>

          {/* STEP 1 OF ONBOARDING: PICK YOUR SCHOOL*/}
          {onboardingStep === "school-step" &&
          <div styleName="onboarding-info">
            <div styleName={
              onboardingStep === "school-step" ? "school-onboarding-form" : "onboarding-form"}
            >
              <div styleName="signup-university-field">
                <img
                    styleName="warning-icon"
                    alt="Please select an University from the List"
                    src="/img/home/warning.svg"
                    style={{visibility: this.state.componentSignupError
                    === "Please select an University from the List" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="school-input"
                      className="school-input"
                      type="text"
                      placeholder="School / University"
                      onInput={this.searchUniversity}
                  />
                </div>
              </div>

              {universitySuggestionList &&
                <ul styleName="university-popup" role="menu">
                  {universitySuggestionList.map(university => {
                    const select = () => {
                      clickUniversity(university.name);
                      actions.closeUniversitySuggestionList();
                      this.updateUniversity(university.id.toString());
                      this.resetAccountErrors();
                      this.setUniversityTrue();
                    };

                    return (
                      <li
                          styleName="university"
                          key={university.id}
                          onClick={select}
                          onKeyDown={onEnterKey(select)}
                          role="menuItem"
                          tabIndex="0"
                      >
                        {university.name}
                      </li>
                    );
                  })}
                </ul>
              }
            </div>
            <input
                styleName={
                  !this.state.isUniversitySelected
                  ?
                  "onboarding-submit-button-inactive"
                  :
                  "onboarding-submit-button"
                }
                type="submit"
                value="Go"
                onClick={
                  this.state.isUniversitySelected
                  // this.state.school === ""
                  ?
                  () => this.resetAccountErrors() && this.changeOnboardingStep("account-step")
                  :
                  () => this.resetAccountErrors() && this.setUniversityError()
                }
            />
            </div>
          }

          {/* STEP 2 OF ONBOARDING: PICK YOUR ACCOUNT TYPE*/}
          {onboardingStep === "account-step" &&
            <div styleName="onboarding-form">
              <div styleName="account-container">
                <div styleName={accountType === "p" ?
                                  "active-faculty-container" :
                                  "faculty-container"}
                >
                  <img
                      styleName="faculty-img"
                      src="/img/onboarding/faculty.png"
                      alt="Account Type: Faculty"
                      onClick={() => {
                        this.chooseAccountType("p");
                        this.changeOnboardingStep("details-step");
                      }}
                      onKeyDown={onEnterKey(() => {
                        this.chooseAccountType("p");
                        this.changeOnboardingStep("details-step");
                      })}
                      role="button"
                      tabIndex="0"
                  />
                  <h2 styleName="faculty-title">Faculty</h2>
                  <div styleName="selected-line"/>
                </div>
                <div styleName="account-seperator"/>
                <div styleName={accountType === "s" ?
                                  "active-student-container" :
                                  "student-container"}
                >
                  <img
                      styleName="student-img"
                      src="/img/onboarding/student.png"
                      alt="Account Type: Student"
                      onClick={() => {
                        this.chooseAccountType("s");
                        this.changeOnboardingStep("details-step");
                      }}
                      onKeyDown={onEnterKey(() => {
                        this.chooseAccountType("s");
                        this.changeOnboardingStep("details-step");
                      })}
                      role="button"
                      tabIndex="0"
                  />
                  <h2 styleName="student-title">Student</h2>
                  <div styleName="selected-line"/>
                </div>
              </div>
            </div>
          }

          {/* STEP 3 OF ONBOARDING: ACCOUNT DETAILS*/}
          {onboardingStep === "details-step" &&
            <div styleName="onboarding-form">
              <div styleName="signup-account-field">
                <img
                    styleName="warning-icon"
                    alt="First Name needs to be at least two characters long"
                    src="/img/home/warning.svg"
                    style={{visibility: this.state.componentSignupError
                  === "First Name needs to be at least two characters long" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="first-name-input"
                      type="text"
                      placeholder="First Name"
                      value={this.state.first_name}
                      onChange={ev => this.updateDetails(ev, "first_name")}
                  />
                </div>
              </div>
              <div styleName="signup-account-field">
                <img
                    styleName="warning-icon"
                    alt="Last Name needs to be at least two characters long"
                    src="/img/home/warning.svg"
                    style={{visibility: this.state.componentSignupError
                  === "Last Name needs to be at least two characters long" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="last-name-input"
                      type="text"
                      placeholder="Last Name"
                      value={this.state.last_name}
                      onChange={ev => this.updateDetails(ev, "last_name")}
                  />
                </div>
              </div>
              <div styleName="signup-account-field">
                <img
                    styleName="warning-icon"
                    alt="Email is already used"
                    src="/img/home/warning.svg"
                    style={{visibility: this.props.newAccountError
                    === "Email already Taken" || this.props.newAccountError
                      === "Please put a valid Email" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="email-input"
                      type="text"
                      placeholder="School Email Address"
                      value={this.state.email}
                      onChange={ev => this.updateDetails(ev, "email")}
                  />
                </div>
              </div>
              <div styleName="signup-account-field">
                <img
                    styleName="warning-icon"
                    alt="Passwords do not match"
                    src="/img/home/warning.svg"
                    style={{visibility: this.state.componentSignupError
                      === "Passwords do not match" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="password-input"
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={ev => this.updateDetails(ev, "password")}
                      onKeyPress={ev => this.updateDetails(ev, "password")}
                  />
                </div>
              </div>
              <div styleName="signup-account-field">
                <img
                    styleName="warning-icon"
                    alt="Passwords do not match"
                    src="/img/home/warning.svg"
                    style={{visibility: this.state.componentSignupError
                      === "Passwords do not match" ? "visible" : "hidden"}}
                />
                <div styleName="input-container">
                  <input
                      styleName="password-input"
                      type="password"
                      placeholder="Confirm Password"
                      value={this.state.confirm_password}
                      onChange={ev => this.updateDetails(ev, "confirm_password")}
                      onKeyPress={ev => this.updateDetails(ev, "confirm_password")}
                  />
                </div>
              </div>
              <p styleName="policy-description">
                By clicking Sign Up, you agree to our Terms and that you have read our Data Policy.
              </p>
              <input
                  styleName={
                    this.onCheck() ?
                        "onboarding-submit-button"
                      :
                        "onboarding-submit-button-inactive"
                    }
                  type="submit"
                  value="Sign Up"
                  // onClick={this.state.valid === false ? undefined : ()
                  // => this.onboardingSubmit()}
                  onClick={(e) => this.onSignUp()}
              />
            </div>
          }

          {/* STEP 4 OF ONBOARDING: Loading */}
          {/* TODO: I need designs for this panel */}
          {onboardingStep === "loading" &&
          <div styleName="onboarding-form">
            <p>&nbsp;</p>
            <img src="/img/ring.gif" alt="Loading"/>
            <p>&nbsp;</p>
          </div>
          }

          {/* STEP 5 OF ONBOARDING: Verify */}
          {/* TODO: I need designs for this panel */}
          {onboardingStep === "success" &&
          <div styleName="onboarding-form">
            <p>&nbsp;</p>
            <p>Please check your email for an email to verify your account.</p>
            <p>&nbsp;</p>
          </div>
          }

          {/* Errors in ONBOARDING */}
          {onboardingStep === "error" &&
          <div styleName="onboarding-form">
            <p>&nbsp;</p>
            <p>There is an error of some sort.</p>
            <p>Please try again</p>
            <p>&nbsp;</p>
          </div>
          }

          <p styleName="login-description">
            Already have an account?&nbsp;
            <Link
                styleName="login-link"
                to="/"
                onClick={this.resetAccountErrors}
                onKeyDown={onEnterKey(this.resetAccountErrors)}
            >
              Log In!
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
