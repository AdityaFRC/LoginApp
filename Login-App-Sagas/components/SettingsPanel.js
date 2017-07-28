import React, {Component, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";
import bindSate from "../helpers/bind-state";
import ref from "../helpers/ref";

@cssModules(styles, {allowMultiple: true})
/* eslint-disable react/no-set-state */
export default class SettingsPanel extends Component {
  static propTypes = {
    activeChat: PropTypes.instanceOf(Chat),
    changeChatDetails: PropTypes.func.isRequired,
    admins: ImmutablePropTypes.setOf(PropTypes.number),
    currentUserId: PropTypes.number.isRequired,
    leaveChat: PropTypes.func.isRequired
  };

  static defaultProps = {
    admins: null,
    activeChat: null
  };

  constructor(props) {
    super(props);
    const {activeChat} = props;

    this.state = {
      isEditingName: false,
      isEditingDesc: false,
      newChatName: activeChat.name,
      newChatDesc: activeChat.description
    };
  }

  _toggleEditName = () => {
    const {activeChat, changeChatDetails} = this.props;
    const {isEditingName, newChatName} = this.state;

    if (isEditingName) {
      // Whenever the user closes the editing panel, we send the data in the form to
      // the api(same thing happens to description)
      changeChatDetails(activeChat.id, newChatName, activeChat.description);
      this.setState({isEditingName: false});
    } else {
      this.setState({isEditingName: true});
    }
  };

  _toggleEditDesc = () => {
    const {changeChatDetails, activeChat} = this.props;
    const {isEditingDesc, newChatName, newChatDesc} = this.state;

    if(isEditingDesc) {
      this.setState({isEditingDesc: false});
      changeChatDetails(activeChat.id, newChatName, newChatDesc);
    } else {
      this.setState({isEditingDesc: true});
    }
  }

  _updateChatDesc = (e) => this.setState({newChatDesc: e.target.value});

  _leaveChat = () => this.props.leaveChat(this.props.activeChat.id, this.props.currentUserId);

  uploadChatPicture = () => {
    const {uploadChatPicture} = this.props;

    const picture = this.fileUpload.files[0];
    uploadChatPicture(picture, "Lucas2");
  };

  render() {
    const {admins, currentUserId, activeChat, isUploadingChatPicture} = this.props;
    const {isEditingName, isEditingDesc} = this.state;

    return (
      <div styleName="right-event-container">
        <div styleName="chat-settings">
          { /* <img src={activeChat.picture_file.url}
           alt="change chat logo" styleName="chat-picture"/> */}
          <div styleName="chat-image-upload">
            <label htmlFor="chat-pic-input">
              {isUploadingChatPicture ?
                <img src="img/ring.gif" alt="uploading chat"/>
                :
                <div>
                  <img
                      styleName="chat-picture"
                      src={activeChat.picture_file.url}
                      alt="change chat logo"
                  />
                </div>
              }
            </label>
            <input
                id="chat-pic-input"
                type="file"
                ref={ref(this, "fileUpload")}
                onChange={this.uploadChatPicture}
            />
          </div>
          <h3 styleName="chat-settings-name">
            {isEditingName ?
              <input
                  type="text"
                  styleName="chat-details-form"
                  {...bindSate(this, "newChatName")}
                  onKeyPress={this._sendNewName}
              />
              :
              activeChat.name
            }
            {admins.has(currentUserId) &&
              <button styleName="edit-settings-btn" onClick={this._toggleEditName}>
                <img src="img/pencil-icon.svg" alt="edit name"/>
              </button>
            }
          </h3>

          <hr styleName="name-desc-line"/>
          <p styleName="chat-settings-desc">
            {isEditingDesc ?
              <textarea
                  styleName="chat-details-form"
                  {...bindSate(this, "newChatDesc")}
                  cols="20" rows="7"
                  onKeyPress={this._updateChatDesc}
              />
              :
              activeChat.description
            }

            {admins.has(currentUserId) &&
              <button styleName="edit-settings-btn" onClick={this._toggleEditDesc}>
                <img src="img/pencil-icon.svg" alt="edit description"/>
              </button>
            }
          </p>
        </div>
        { /*
        <hr styleName="notification-line"/>
        <button styleName="notification-link">
          Notification
          <img src="img/drop-down-icon.svg" alt="" styleName="notification-icon"/>
        </button>
        <hr styleName="notification-line"/> */
        }
        <div styleName="chat-leave-archive">
          {admins.has(currentUserId)
          // &&
          //   <button styleName="archive-btn">Archive Chat</button>
          }
          <button
              styleName="archive-btn leave-btn"
              onClick={this._leaveChat}
          >
            Leave Chat
          </button>
        </div>
      </div>
    );
  }
}
