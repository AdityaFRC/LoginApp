import React, {Component, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import styles from "../styles/AccountSettingPanel.css";

import {
  changeAccountInfo, resetAccountSettingFlashMessageStatus,
  hasMadeSuccessfulUserRequest, logout, requestPasswordChange,
  refreshSchoolSuggestionList, refreshDepartmentSuggestionList
} from "../actions/current-user";

import bindState from "../helpers/bind-state";

import connect from "../helpers/connect-with-action-types";

import School from "../records/school";

import Department from "../records/school";

@connect(state => ({
  firstName: state.currentUser.firstName,
  lastName: state.currentUser.lastName,
  email: state.currentUser.email,
  university: state.currentUser.university,
  universityName: state.currentUser.universityName,
  accountType: state.currentUser.accountType,
  school: state.currentUser.school,
  schoolName: state.currentUser.schoolName,
  department: state.currentUser.department,
  departmentName: state.currentUser.departmentName,
  department: state.currentUser.department,
  yearOfGraduation: state.currentUser.yearOfGraduation,
  id: state.currentUser.id,
  hasMadeRequest: state.currentUser.hasMadeRequest,
  hasMadeSuccessfulCall: state.currentUser.hasMadeSuccessfulCall,
  schoolSuggestionList: state.currentUser.schoolSuggestionList,
  departmentSuggestionList: state.currentUser.departmentSuggestionList
}), {
  changeAccountInfo,
  resetAccountSettingFlashMessageStatus,
  hasMadeSuccessfulUserRequest,
  logout,
  requestPasswordChange,
  refreshSchoolSuggestionList,
  refreshDepartmentSuggestionList
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class AccountSettingPanel extends Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    university: PropTypes.any, // FIXME Wasn't sure what type this actually was
    universityName: PropTypes.any,
    accountType: PropTypes.any, // FIXME Wasn't sure what type this actually was
    school: PropTypes.any, // FIXME Wasn't sure what type this actually was
    schoolName: PropTypes.any,
    department: PropTypes.any, // FIXME Wasn't sure what type this actually was
    departmentName: PropTypes.any,
    yearOfGraduation: PropTypes.any, // FIXME Wasn't sure what type this actually was,
    toggle: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    hasMadeRequest: PropTypes.bool.isRequired,
    hasMadeSuccessfulCall: PropTypes.bool.isRequired,
    schoolSuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(School)),
    departmentSuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(Department))
  };

  static defaultProps = {
    university: null,
    universityName: null,
    accountType: null,
    school: null,
    schoolName: null,
    department: null,
    departmentName: null,
    yearOfGraduation: null,
    schoolSuggestionList: null,
    departmentSuggestionList: null,
  };

  // This state is supposed to be maintained by this ChangeInfoForm,
  //  and will be modified by user at will, but originally imported from the currentUser state
  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    email: this.props.email,
    university: this.props.university,
    universityName: this.props.universityName,
    accountType: this.props.accountType,
    school: this.props.school,
    schoolName: this.props.schoolName,
    department: this.props.department,
    departmentName: this.props.departmentName,
    yearOfGraduation: this.props.yearOfGraduation,
    // currentPassword: "",
    // newPassword: "",
    // confirmPassword: "",
    hasMakeInnerChange: false,
    passwordHeaderMessage: ""
    // toggleDisplayPasswordFields: false
  };

  componentWillMount() {
    const {actions} = this.props;
    actions.refreshSchoolSuggestionList(this.state.university);
    actions.refreshDepartmentSuggestionList(this.state.school);
  }

  // save button click event
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({hasMakeInnerChange: false});
    this.setState({firstName: this.state.firstName.trim()});
    const {actions, id, hasMadeRequest, hasMadeSuccessfulCall} = this.props;
    const {
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      department,
      yearOfGraduation
    } = this.state;
    if (/* this.onValidate() &&*/ this.validateFirstName()) {
      actions.changeAccountInfo(
        firstName.trim(),
        lastName,
        email,
        university,
        accountType,
        school,
        department,
        yearOfGraduation,
        id
      );
      actions.hasMadeSuccessfulUserRequest(hasMadeRequest, hasMadeSuccessfulCall);
    } else {
      this.setState({firstName: this.props.firstName});
      // this.setState({currentPassword: ""});
      // this.setState({newPassword: ""});
      // this.setState({confirmPassword: ""});
    }
  };

  onSubmitSchool = (e) => {
    e.preventDefault();
    this.setState({hasMakeInnerChange: false});
    this.setState({firstName: this.state.firstName.trim()});
    const {actions, id, hasMadeRequest, hasMadeSuccessfulCall} = this.props;
    const {
      firstName,
      lastName,
      email,
      university,
      accountType,
      department,
      yearOfGraduation
    } = this.state;
    actions.changeAccountInfo(
      firstName,
      lastName,
      email,
      university,
      accountType,
      e.target.value,
      department,
      yearOfGraduation,
      id
    );
    actions.hasMadeSuccessfulUserRequest(hasMadeRequest, hasMadeSuccessfulCall);
  };

  onSubmitDepartment = (e) => {
    e.preventDefault();
    this.setState({hasMakeInnerChange: false});
    this.setState({firstName: this.state.firstName.trim()});
    const {actions, id, hasMadeRequest, hasMadeSuccessfulCall} = this.props;
    const {
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      yearOfGraduation
    } = this.state;
    actions.changeAccountInfo(
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      e.target.value,
      yearOfGraduation,
      id
    );
    actions.hasMadeSuccessfulUserRequest(hasMadeRequest, hasMadeSuccessfulCall);
  };

  onSubmitPassword = () => {
    const {actions} = this.props;
    const {email} = this.state;
    actions.requestPasswordChange(email);
    this.setState({passwordHeaderMessage: "A reset has been sent to your email"});
  };

  // check whether there is anything being changed
  /* onCheck = () => {
    const {currentPassword, newPassword, confirmPassword} = this.state;
    if (
      currentPassword !== ""
      && newPassword !== ""
      && confirmPassword !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };
  */

  // validate the changes that user has made
  /*
  onValidate = () => {
    // clear all fields related to password when validating
    return (this.state.currentPassword === ""
    || this.state.newPassword === ""
    || this.state.newPassword !== this.state.confirmPassword);
  };
  */

  // validates first name; cannot: be null, include spaces between characters, empty, or length < 2
  validateFirstName = () => {
    const {firstName} = this.state;
    if (
      firstName === null
      || firstName.trim().includes(" ")
      || firstName.trim() === ""
      || firstName.trim().length < 2
    ) {
      return false;
    } else {
      return true;
    }
  };

  // displays whether account info was updated successfully or not
  displayAccountSettingFlashMessage = (hasMadeRequest, hasMadeSuccessfulCall) => {
    if (!this.validateFirstName()) {
      return (<div styleName="failure">
        Name must be at least two characters and may not contain spaces</div>);
    }
    if (hasMadeRequest && !this.state.hasMakeInnerChange) {
      if (!hasMadeSuccessfulCall) {
        return (<div styleName="failure">
          Name must be at least two characters and may not contain spaces</div>);
      } else {
        return <div styleName="success">Account info successfully updated </div>;
      }
    } else {
      return <div/>;
    }
  };

  // used to reset hasMadeRequest and hasMadeSuccessfulCall to false
  resetAccountSettingFlashMessageStatus = () => {
    const {actions, hasMadeRequest, hasMadeSuccessfulCall} = this.props;
    actions.resetAccountSettingFlashMessageStatus(hasMadeRequest, hasMadeSuccessfulCall);
  };

  /* combineToggleAndReset = () => {
    const {toggle} = this.props;
    if (this.onCheck()) {
      toggle();
      this.resetAccountSettingFlashMessageStatus();
    } else {
      const choice = confirm("You have unsaved changes. Are you sure you want to continue?");
      if (choice) {
        toggle();
        this.resetAccountSettingFlashMessageStatus();
      }
    }
  };
  */

  onFirstNameChange = () => {
    this.setState({hasMakeInnerChange: true});
  };

  translateAccountType = (type) => {
    switch(type.toLowerCase()) {
      case "a":
        return "Admin";
      case "b":
        return "Bot";
      case "p":
        return "Professor";
      case "s":
        return "Student";
      default:
        return "Other";
    }
  };

  toggleBox = () => {
    const x = document.getElementById("toggleBox");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
    this.setState({passwordHeaderMessage: ""});
  };

  displayChangelog = (e) => {
    e.preventDefault();
    window.location = "../changelog";
  };

  logout = () => {
    const {actions} = this.props;
    actions.logout();
  };

  changeSchool = e => {
    this.onSubmitSchool(e);
  }

  changeDepartment = e => {
    this.onSubmitDepartment(e);
  }

  toggleAndClose = () => {
    const {toggle} = this.props;
    toggle();
    this.resetAccountSettingFlashMessageStatus;
  }

  render() {
    const {hasMadeRequest, hasMadeSuccessfulCall,
    schoolSuggestionList, departmentSuggestionList, actions} = this.props;

    return (
      <div styleName="account-setting-panel">
        <div styleName="account-setting-panel-header">
          <h3 styleName="popup-title-text">Account Settings</h3>
          <button styleName="popup-close-button" onClick={this.toggleAndClose}>
            <img
                styleName="close-icon"
                alt="Closes Create Chat"
                src="img/fill-205.svg"
            />
          </button>
        </div>
        {/* will only display message when user clicked save */}
        <div styleName="popup-info-update-status">
          {((hasMadeRequest || !this.validateFirstName())
          && this.displayAccountSettingFlashMessage(hasMadeRequest, hasMadeSuccessfulCall))}
        </div>

        <form>
          <div styleName="account-chunk-header"> Personal Info</div>

          <div styleName="account-info-field">
            <div styleName="changeable-field-header"> Name</div>
            <input
                styleName="changeable-field-input-box"
                type="text"
                placeholder="User Name"
                autoComplete="off"
                onKeyDown={this.onFirstNameChange && onEnterKey(this.onSubmit)}
                {...bindState(this, "firstName")}
            />
          </div>
          <div styleName="small-line"/>

          <div styleName="Rectangle-uneditablebox">
            <div styleName="unchangeable-field-header"> Account Type</div>
            <div styleName="unchangeable-field-input-box">
              {this.translateAccountType(this.state.accountType) || "N/A"}
            </div>
          </div>
          <div styleName="small-line"/>

          <div styleName="Rectangle-uneditablebox">
            <div styleName="unchangeable-field-header"> Email Address</div>
            <div styleName="unchangeable-field-input-box">
              {this.state.email || "N/A"}
            </div>
          </div>
          <div styleName="small-line"/>

          <div styleName="Rectangle-uneditablebox">
            <div styleName="unchangeable-field-header"> University</div>
            <div styleName="unchangeable-field-input-box">
              {this.state.universityName || "N/A"}
            </div>
          </div>
          <div styleName="small-line"/>

          <div styleName="Rectangle-uneditablebox">
            <div styleName="unchangeable-field-header"> School</div>
            { /*
            <div styleName="unchangeable-field-input-box">
              <input
                  className="school-input"
                  type="text"
                  placeholder={this.state.schoolName || "N/A"}
                  onInput={this.searchSchool}
                  onKeyDown={onEnterKey(this.onSubmitSchool)}
              />
            </div>
            */ }
          </div>
          <select onChange={this.changeSchool}>
            <option key={this.state.school}>
              {this.state.schoolName}</option>
            {schoolSuggestionList && schoolSuggestionList.map(school => {
              if (school.name === this.state.schoolName) {
                return ("");
              }
              return (
                <option
                    key={school.id}
                    value={school.id}
                    tabIndex="0"
                >
                  {school.name}
                </option>
              );
            })}
          </select>
          <div styleName="small-line"/>

          <div styleName="Rectangle-uneditablebox">
            <div styleName="unchangeable-field-header"> Department</div>
          </div>
          <select onChange={this.changeDepartment}>
            <option key={this.state.department}>
              {this.state.departmentName}</option>
            {departmentSuggestionList && departmentSuggestionList.map(department => {
              if (department.name === this.state.departmentName) {
                return ("");
              }
              return (
                <option
                  key={department.id}
                  value={department.id}
                  tabIndex="0"
                >
                  {department.name}
                </option>
              );
            })}
          </select>

          <hr styleName="line"/>

          <button
              id="show-password-reset"
              styleName="reset-password-button"
              type="button"
              onClick={this.toggleBox}
          >
            Reset Password

          </button>
          <div
              id="toggleBox"
              styleName="hidden"
          >
            <div
                styleName="popup-info-password-status"
            > {this.state.passwordHeaderMessage} </div>
            <div>
              <button
                  id="save-button"
                  styleName="save-button2"
                  type="button"
                  value="Save"
                  onClick={this.onSubmitPassword}
              >
               Reset
               </button>
            </div>
          </div>

          <hr styleName="line"/>
          <button
              id="change-log"
              styleName="change-log"
              type="button"
              onClick={this.displayChangelog}
          >
                Changelog
          </button>
          <hr styleName="line"/>
          <button
              id="logout-button"
              styleName="logout-button"
              type="button"
              onClick={this.logout}
          >
                Log Out
            </button>
          <hr styleName="line"/>
        </form>
      </div>

    );
  }
}

