import React, {Component, PropTypes} from "react";
import styles from "../styles/CreateChatOrClass.css";
import cssModules from "react-css-modules";
import ChatPrivacyToggle from "../components/ChatPrivacyToggle";
import {createChat, createSubchat} from "../actions/chats";
import {createClass} from "../actions/classes";
import {changeNewChatName} from "../actions/ui/left-panel";
import {changeNewClassName, changeNewClassCode} from "../actions/ui/left-panel";
import {connect} from "react-redux";
import {inviteNewFromParent} from "../actions/active-chat";
import ref from "../helpers/ref";

@connect(state => ({
  chatCreationPending: state.ui.leftPanel.chatCreationPending,
  classCreationPending: state.ui.leftPanel.classCreationPending,
  newChatName: state.ui.leftPanel.newChatName,
  newClassName: state.ui.leftPanel.newClassName,
  newClassCode: state.ui.leftPanel.newClassCode,
  activeChatId: state.activeChat.id,
  parentChatId: state.activeChat.parentId,
  ifInviteNewFromParent: state.activeChat.ifInviteNewFromParent
}), {
  createChat,
  createSubchat,
  createClass,
  changeNewChatName,
  changeNewClassName,
  changeNewClassCode
})
@cssModules(styles)
export default class CreateChatOrClass extends Component {
  constructor() {
    super();
    this.changeCreatedChatName = this.changeCreatedChatName.bind(this);
    this.togglePrivacy = this.togglePrivacy.bind(this);
    this.createChat = this.createChat.bind(this);
    this.createClass = this.createClass.bind(this);
    this.createSubchat = this.createSubchat.bind(this);
    this.changeCreatedClassName = this.changeCreatedClassName.bind(this);
    this.changeCreatedClassCode = this.changeCreatedClassCode.bind(this);
    this.subchatAnonymousChange = this.subchatAnonymousChange.bind(this);
  }

  static propTypes = {
    newChatName: PropTypes.string.isRequired,
    newClassName: PropTypes.string.isRequired,
    newClassCode: PropTypes.string.isRequired,

    chatOrClass: PropTypes.any.isRequired, // FIXME Wasn't sure what type this actually was
    activeChatId: PropTypes.number.isRequired,

    chatCreationPending: PropTypes.bool.isRequired,
    classCreationPending: PropTypes.bool.isRequired,

    createClass: PropTypes.func.isRequired,
    createChat: PropTypes.func.isRequired,
    createSubchat: PropTypes.func.isRequired,
    changeNewChatName: PropTypes.func.isRequired,
    changeNewClassName: PropTypes.func.isRequired,
    changeNewClassCode: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    ifInviteNewFromParent: PropTypes.bool.isRequired
  };

  state = {
    newChatNameEmpty: false,
    newClassInfoEmpty: false,
    isPrivacyActive: true,
    isPrivacyStateChanged: false,
    isSubchatAnonymous: false,
    picture_object: null,
    toggleChangedPicture: false,
    previewSrc: null

  };

  createChat() {
    // chats can have empty names so we don't check for that
    if (this.props.chatCreationPending) {
      return;
    }
    this.props.createChat(this.props.newChatName, !this.state.isPrivacyActive, this.state.picture_object);
  }

  createClass() {
    if(!/\S/.test(this.props.newClassName) || !/\S/.test(this.props.newClassCode)) {
      this.setState({newClassInfoEmpty: true});
      return;
    }
    if (this.props.newClassInfoEmpty || this.props.classCreationPending) {
      return;
    }
    this.props.createClass(this.props.newClassName, this.props.newClassCode,
      !this.state.isPrivacyActive, this.state.picture_object);
  }

  createSubchat() {
    if(!/\S/.test(this.props.newChatName)) {
      this.setState({newChatNameEmpty: true});
      return;
    }
    if (this.props.newChatNameEmpty || this.props.chatCreationPending
        || !this.props.activeChatId) {
      return;
    }

    const parentChatId = this.props.activeChatId;
    if (parentChatId) {
      this.props.createSubchat(this.props.newChatName, parentChatId,
      !this.state.isPrivacyActive, this.state.isSubchatAnonymous);
    }
  }

  changeCreatedChatName(e) {
    this.setState({newChatNameEmpty: false});
    const chatName = e.target.value;
    this.props.changeNewChatName(chatName);
  }

  onPasswordChange = (e) => {
    const {actions} = this.props;

    actions.changePassword(e.target.value);
    this.setState({userPassword: e.target.value});
  };

  changeCreatedClassName(e) {
    if (this.state.newClassInfoEmpty !== false) {
      this.setState({newClassInfoEmpty: false});
    }
    const thisClassName = e.target.value;
    this.props.changeNewClassName(thisClassName);
  }

  changeCreatedClassCode(e) {
    if (this.state.newClassInfoEmpty !== false) {
      this.setState({newClassInfoEmpty: false});
    }
    const thisClassCode = e.target.value;
    this.props.changeNewClassCode(thisClassCode);
  }

  togglePrivacy() {
    if (!this.state.isPrivacyStateChanged) {
      this.setState({isPrivacyStateChanged: true});
    }
    this.setState({isPrivacyActive: !this.state.isPrivacyActive});
  }

  storeChatPicture = () => {
    const reader = new FileReader();
    const picture = this.fileUpload.files[0];
    this.setState({picture_object: picture});
    this.setState({toggleChangedPicture: true});

    reader.onload = e => {
      const data = e.target.result;
       this.setState({previewSrc: data});
     };

    reader.readAsDataURL(picture);
  };


  renderChatCreation() {
    const {previewSrc} = this.state;
    return (
      <div styleName="chat-creation-popup__body">
        <input
          styleName="icon-create-chat-input"
          type="file"
          id="create-chat-photo"
          ref={ref(this, "fileUpload")}
          onChange={this.storeChatPicture}
        />
        <label htmlFor="create-chat-photo">
           <img
             styleName="preview-src-pic"
             src={this.state.toggleChangedPicture ? previewSrc : "img/upload-chat.svg"}
             alt="upload chat icon"
           />

        </label>
        {this.props.chatOrClass !== "Chat" &&
        <p
            styleName="empty-chat-error"
            style={{visibility: this.state.newChatNameEmpty ? "visible" : "hidden"}}
        >
          {this.props.chatOrClass} name cant be empty!
        </p>}

        <input styleName="chat-name-input"
            type="text"
            placeholder={`${this.props.chatOrClass} name`}
            onChange={this.changeCreatedChatName}
        />

        <ChatPrivacyToggle isPrivate={this.state.isPrivacyActive}
            isPrivacyChanged={this.state.isPrivacyStateChanged}
            thisChatType={this.props.chatOrClass}
            togglePrivacy={this.togglePrivacy}
        />
        <button
            styleName={"active-chat-creation-next-button"}
            onClick={this.createChat}
        >
          {this.props.chatCreationPending ?
            <img styleName="chat-creation-spinner"
                src="img/ring.gif"
                alt={`creating ${this.props.chatOrClass}`}
            />
            :
            "Next"
          }
        </button>
      </div>
    );
  }

  renderClassCreation() {
    const {previewSrc} = this.state;
    return (
      <div styleName="chat-creation-popup__body">
        <input
          styleName="icon-create-chat-input"
          type="file"
          id="create-chat-photo"
          ref={ref(this, "fileUpload")}
          onChange={this.storeChatPicture}
        />
        <label htmlFor="create-chat-photo">
          <img
            styleName="preview-src-pic"
            src={this.state.toggleChangedPicture ? previewSrc : "img/upload-chat.svg"}
            alt="upload chat icon"
          />

        </label>

        <p styleName="empty-chat-error"
            style={{visibility: this.state.newClassInfoEmpty ? "visible" : "hidden"}}
        >
          {this.props.chatOrClass} name or code cant be empty!
        </p>
        <input styleName="chat-name-input"
            type="text"
            placeholder={`Class name*`}
            onChange={this.changeCreatedClassName}
        />

        <input styleName="chat-name-input"
            type="text"
            placeholder={`Class code*`}
            onChange={this.changeCreatedClassCode}
        />

        <ChatPrivacyToggle isPrivate={this.state.isPrivacyActive}
            isPrivacyChanged={this.state.isPrivacyStateChanged}
            thisChatType={this.props.chatOrClass}
            togglePrivacy={this.togglePrivacy}
        />

        <button
            styleName={!/\S/.test(this.props.newClassName) || !/\S/.test(this.props.newClassCode)
            ? "chat-creation-next-button"
            : "active-chat-creation-next-button"}
            onClick={this.createClass}
        >
          {this.props.classCreationPending ?
            <img styleName="chat-creation-spinner"
                src="img/ring.gif"
                alt={`creating ${this.props.chatOrClass}`}
            />
            :
            "Next"
          }
        </button>
      </div>
    );
  }

  subchatAnonymousChange() {
    this.setState({isSubchatAnonymous: !this.state.isSubchatAnonymous});
  }

  renderSubchatCreation() {
    const {ifInviteNewFromParent} = this.props;
    return (
      <div styleName="subchat-creation-popup__body">
        <p styleName="empty-chat-error"
            style={{visibility: this.state.newChatNameEmpty ? "visible" : "hidden"}}
        >
          {this.props.chatOrClass} name cant be empty!
        </p>

        <input styleName="chat-name-input"
            type="text"
            placeholder={`${this.props.chatOrClass} name`}
            onChange={this.changeCreatedChatName}
        />

        <div styleName="anonymous-selection">
          <input type="checkbox"
              styleName="subchat-checkbox"
              onChange={this.subchatAnonymousChange}
          />
          <p styleName="anonymous-selection-hint">Anonymous Messaging</p>
        </div>

        <div styleName="invite-all-selection">
          <input type="checkbox"
              styleName="invite-all-checkbox"
              // checked={ifInviteNewFromParent}
              onChange={this.inviteNewFromParent}
           // onClick={this.ifInviteEveryone(ifInviteNewFromParent)}
          />
          <p styleName="invite-all-selection-hint">Add new users from parent chat</p>
        </div>

        <ChatPrivacyToggle isPrivate={this.state.isPrivacyActive}
            isPrivacyChanged={this.state.isPrivacyStateChanged}
            thisChatType={this.props.chatOrClass}
            togglePrivacy={this.togglePrivacy}
        />
        <button
            styleName={!/\S/.test(this.props.newChatName)
            ? "chat-creation-next-button"
            : "active-chat-creation-next-button"}
            onClick={this.createSubchat}
        >
          {this.props.chatCreationPending ?
            <img styleName="chat-creation-spinner"
                src="img/ring.gif"
                alt={`creating ${this.props.chatOrClass}`}
            />
            :
            "Next"
          }
        </button>
      </div>
    );
  }

  render() {
    if (this.props.chatOrClass !== "Subchat") {
      return (
        <div styleName="chat-creation-popup">
          <div styleName="popup-title">
            <h3 styleName="popup-title-text">Create {this.props.chatOrClass}</h3>
            <button styleName="popup-close-button" onClick={this.props.toggle}>
              <img styleName="close-icon"
                  alt="Closes Create Chat"
                  src="img/fill-205.svg"
              />
            </button>
          </div>
          {this.props.chatOrClass === "Class" && this.renderClassCreation()}
          {this.props.chatOrClass === "Chat" && this.renderChatCreation()}
          {this.props.chatOrClass === "Subchat" && this.renderSubchatCreation()}
        </div>
      );
    } else {
      return (
        <div styleName="subchat-creation-popup">
          <div styleName="subchat-popup-title">
            <h3 styleName="popup-title-text">Create {this.props.chatOrClass}</h3>
            <button styleName="popup-close-button" onClick={this.props.toggle}>
              <img styleName="close-icon"
                  alt="Closes Create Chat"
                  src="img/fill-205.svg"
              />
            </button>
          </div>
          {this.renderSubchatCreation()}
        </div>
      );
    }
  }
}
