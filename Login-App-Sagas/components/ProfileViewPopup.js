import React, {Component, PropTypes} from "react";
import styles from "../styles/ProfileViewPopup.css";
import connect from "../helpers/connect-with-action-types";
import cssModules from "react-css-modules";
import {closeUserProfile} from "../actions/ui/main-panel";
import {uploadProfilePicture,
  changeGraduationYear,
  changeAreaOfStudy,
  changeAccountInfo
} from "../actions/current-user";
import {createOneToOneChat} from "../actions/chats";
import User from "../records/user";
import ref from "../helpers/ref";
import bindState from "../helpers/bind-state";
import AddTagsToUserProfile from "../components/AddTagsToUserProfile";
import AddAreasOfStudyToUserProfile from "../components/AddAreasOfStudyToUserProfile";

function getUserType(userCode) {
  switch(userCode) {
    case "a":
      return "Edu.Chat Team";
    case "p":
      return "Professor";
    case "s":
      return "Student";
    case "b":
      return "Bot";
    default:
      return "Other";
  }
}

@connect(state => ({
  userData: state.ui.mainPanel.userProfilePopupData,
  yourId: state.currentUser.id,
  isUploadingPicture: state.currentUser.isUploadingPicture,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  university: PropTypes.any,
  accountType: PropTypes.any,
  school: PropTypes.any,
  department: PropTypes.any,
  yearOfGraduation: state.currentUser.yearOfGraduation,
  areaOfStudy: state.currentUser.areaOfStudy
}), {
  closeUserProfile,
  uploadProfilePicture,
  createOneToOneChat,
  changeGraduationYear,
  changeAreaOfStudy,
  changeAccountInfo
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class ProfileViewPopup extends Component {
  static propTypes = {
    userData: PropTypes.instanceOf(User).isRequired,
    yourId: PropTypes.number.isRequired,
    isUploadingPicture: PropTypes.bool.isRequired,
    yearOfGraduation: PropTypes.any,
    areaOfStudy: PropTypes.any
  };

  state = {
    isEditingProfile: false,
    isAddingNewTag: false,
    addTagsPopupWindow: false,
    addAreaOfStudyPopupWindow: false,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    email: this.props.email,
    university: this.props.university,
    accountType: this.props.accountType,
    school: this.props.school,
    department: this.props.department,
    yearOfGraduation: this.props.yearOfGraduation,
    areaOfStudy: this.props.areaOfStudy
  };

  closePopup = () => this.props.actions.closeUserProfile();

  isitYourOwnProfile = () => this.props.userData.id === this.props.yourId;

  toggleEditProfile = () => {
    if(this.isitYourOwnProfile()) {
      this.setState({isEditingProfile: !this.state.isEditingProfile});
    }
  };

  uploadProfilePicture = () => {
    const {actions} = this.props;

    const picture = this.fileUpload.files[0];
    actions.uploadProfilePicture(picture, "Lucas");
  };

  _createOneToOneChat = () => {
    const {actions} = this.props;
    actions.createOneToOneChat(this.props.userData);
  };

  openAddTagsPopupWindow = () => {
    this.setState({addTagsPopupWindow: true});
  };

  closeAddTagsPopupWindow = () => {
    this.setState({addTagsPopupWindow: false});
  };

  openAddAreaOfStudyWindow = () => {
    this.setState({addAreaOfStudyPopupWindow: true});
  };

  closeAddAreaOfStudyWindow = () => {
    this.setState({addAreaOfStudyPopupWindow: false});
  };

  onAreaOfStudyChange = (e) => {
    const {actions} = this.props;
    actions.changeAreaOfStudy(e.target.value);
  };

  onSaveSubmit = () => {
    this.toggleEditProfile();
    this.onSubmit();
  };

  onSubmit = () => {
    const {actions, yourId} = this.props;

    this.setState({yearOfGraduation: this.state.yearOfGraduation});

    const {
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      department,
      yearOfGraduation,
      areaOfStudy
    } = this.state;

    actions.changeAccountInfo(
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      department,
      yearOfGraduation,
      yourId
    );
  };


  render() {
    const {userData, isUploadingPicture} = this.props;
    const {isEditingProfile} = this.state;

    return (
      <div>
        <div styleName="profile-view-popup">
          <button onClick={this.closePopup} styleName="close-popup-btn">
            <img src="img/file_preview/close-icon.svg"/>
          </button>
          <div styleName="image-upload">
            <label htmlFor="profile-pic-input">
              {isUploadingPicture ?
                <img src="img/ring.gif" alt="uploading profile"/>
                :
                /* <UploadProfileImage data={userData.picture_file.url}/> */
                <div>
                  <img
                      styleName="profile-img-hoverable"
                      src={userData.picture_file.url}
                      alt=""
                  />
                  <img styleName="upload-img" src="img/change-profile-pic-icon.svg" alt=""/>
                </div>
              }
            </label>
            {this.state.addTagsPopupWindow &&
              <AddTagsToUserProfile
                  closeAddTagsPopupWindow={this.closeAddTagsPopupWindow}
                  userData={this.props.userData}
              />
            }
            {this.state.addAreaOfStudyPopupWindow &&
              <AddAreasOfStudyToUserProfile
                closeAddTagsPopupWindow={this.closeAddAreaOfStudyWindow}
                userData={this.props.userData}
              />
            }
            <input
                id="profile-pic-input"
                type="file"
                ref={ref(this, "fileUpload")}
                onChange={this.uploadProfilePicture}
            />
          </div>
          <p styleName="profile-name">
            {userData.first_name} {userData.last_name}
          </p>
          <p styleName="graduation-year">
            Class of {userData.year_of_graduation}
          </p>
          {/* this.state.isEditingProfile ?
            <div>
              <p styleName="area-of-study_header">Area of Study</p>
              <div styleName = "input-container">
                <input
                  styleName="area-of-study_input"
                  type="text"
                  onChange={this.onAreaOfStudyChange}
                  placeholder={this.state.areaOfStudy}
                />
              </div>
            </div>
            :
            <div>
              <p styleName="area-of-study_header">Area of Study</p>
              <ul styleName ="area-of-study__list">
                <li styleName="area-of-study__item">{getUserType(userData.type)}</li>
                {userData.tags.map((tag, index) =>
                  <li styleName="profile-tag__item" key={index}>{tag.tag}</li>
                )}
                {this.isitYourOwnProfile() &&
                <li
                  styleName="profile-tag__item"
                  onClick={this.openAddTagsPopupWindow}
                  onKeyDown={this.openAddTagsPopupWindow}
                  role="button"
                  tabIndex="0"
                >
                  +
                </li>
                }
              </ul>
              <p styleName="area-of-study_value">{this.state.areaOfStudy}</p>
            </div>
          */}
          <p styleName="profile-tags__header">Area of Study</p>
          <ul styleName="area-of-study__list">
            {this.isitYourOwnProfile() &&
            <div styleName="add-tag-button"
                onClick={this.openAddAreaOfStudyWindow}
                onKeyDown={this.openAddAreaOfStudyWindow}
                role="button"
                alt="add-tag-button"
                tabIndex="0"
            >
              <img src="img/adding-tags.svg"/>
            </div>
            }
            {userData.areas_of_study.map((tag) =>
              <li styleName="profile-tag__item" key={tag}>
                <div styleName="profile-tag__content">
                  {tag}{<div styleName="delete-tag-button"><img src="img/removing-tags.svg"/></div>}
                </div>
              </li>
            )}
          </ul>
          <div styleName="profile-separator"/>
          {/* ------------------------------------------------------------------------------- */}
          <p styleName="profile-tags__header">Tags</p>
          <ul styleName="profile-tags__list">
            {this.isitYourOwnProfile() &&
            <div styleName="add-tag-button"
                onClick={this.openAddTagsPopupWindow}
                onKeyDown={this.openAddTagsPopupWindow}
                role="button"
                alt="add-tag-button"
                tabIndex="0"
            >
              <img src="img/adding-tags.svg"/>
            </div>
            }
            <li styleName="profile-tag__item">
              <div styleName="profile-tag__content">{getUserType(userData.type)}</div>
            </li>
            {userData.tags.map((tag, index) =>
              <li styleName="profile-tag__item" key={index}>
                <div styleName="profile-tag__content">
                  {tag.tag}{<div styleName="delete-tag-button"><img src="img/removing-tags.svg"/></div>}
                </div>
              </li>
            )}
          </ul>
          <div styleName="profile-separator"/>
          <p styleName="profile-tag-info">Academic and professional interests and skills</p>
          {this.isitYourOwnProfile() ?
            <div>
              <button
                  styleName="profile-send-msg-button"
                  onClick={this.onSaveSubmit}
              >
                Save </button>
            </div>
            :
            <button
                styleName="profile-send-msg-button"
                onClick={this._createOneToOneChat}
            >
              Send Message
            </button>
          }
        </div>
        {/* eslint-disable */}
        <div styleName="background" onClick={this.closePopup}/>
        {/* eslint-enable */}
      </div>
    );
  }
}
