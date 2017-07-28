import React, {PureComponent, PropTypes} from "react";
import styles from "../styles/FilePreview.css";
import cssModules from "react-css-modules";
import Message from "../components/Message";
import ImmutablePropTypes from "react-immutable-proptypes";

import {
  setFilePreview,
  requestLoadComments,
  receiveComment,
  sendComment,
  sendFileComment
} from "../actions/active-chat";
import {openUserProfile} from "../actions/ui/main-panel";
import MessageRecord from "../records/message";
import CommentsRecord from "../records/comments-record";
import User from "../records/user";
import ref from "../helpers/ref";
import {onEnterKey} from "../helpers/events";

import ChatInput from "../components/ChatInput";

import connect from "../helpers/connect-with-action-types";
import moment from "moment";

const COMMON_IMAGE_TYPES = Object.freeze([
  "bmp", "png", "jpg", "jpeg", "gif", "svg"
]);

const COMMON_TEXT_TYPES = Object.freeze([
  "txt", "html", "css", "js", "sql", "json", "py"
]);

function previewFileRenderType(ext: string): string {
  // SUPPORTED_IMAGE_TYPES.indexOf(fileExtension) !== -1
  if (COMMON_IMAGE_TYPES.indexOf(ext) !== -1) {
    return "image_viewer";
  } else if (COMMON_TEXT_TYPES.indexOf(ext) !== -1) {
    return "text_viewer";
  } else if (ext === "pdf") {
    return "pdf_viewer";
  } else {
    return "google_viewer";
  }
}

@connect(state => {
  const filePreview = state.activeChat.filePreview;
  return {
    filePreview,
    fileComments: state.activeChat.getIn(["comments", filePreview.id]),
    users: state.users,
    currentUserId: state.currentUser.id,
    renderType: previewFileRenderType(filePreview.file.extension),
    fileUser: state.users.get(filePreview.user)
  };
}, {
  setFilePreview,
  requestLoadComments,
  receiveComment,
  sendComment,
  sendFileComment,
  openUserProfile
})
@cssModules(styles)
export default class FilePreview extends PureComponent {
  static propTypes = {
    filePreview: PropTypes.instanceOf(MessageRecord).isRequired,
    fileComments: PropTypes.instanceOf(CommentsRecord).isRequired,
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number).isRequired,
    currentUserId: PropTypes.number.isRequired,
    renderType: PropTypes.oneOf(["image_viewer", "text_viewer", "pdf_viewer", "google_viewer"])
                  .isRequired,
    fileUser: PropTypes.instanceOf(User).isRequired
  };

  scrollWrapper;

  componentDidMount() {
    const {filePreview, actions} = this.props;
    actions.requestLoadComments(filePreview.id);
  }

  componentDidUpdate(oldProps) {
    const {filePreview, actions} = this.props;
    if (filePreview !== oldProps.filePreview) {
      actions.requestLoadComments(filePreview.id);
    }

    this.scrollToBottomOfContainer();
  }

  getGoogleUrl() {
    const {filePreview} = this.props;
    return `https://docs.google.com/gview?url=${filePreview.file.url}&embedded=true`;
  }

  scrollToBottomOfContainer() {
    this.scrollWrapper.scrollTop = this.scrollWrapper.scrollHeight;
  }

  sendComment = (msg) =>
    this.props.actions.sendComment(this.props.filePreview.id, msg);

  sendFile = (file, title, extension, text) =>
    this.props.actions.sendFileComment(this.props.filePreview.id, file, title, extension, text);

  close = () => this.props.actions.setFilePreview(null);

  renderMessages() {
    const {fileComments, users, actions, currentUserId} = this.props;
    return (
      !fileComments ?
        <img src="img/ring.gif" alt="loading chats" styleName="loading-icon"/>
        :
        <div>
          {fileComments.confirmed.map(message =>
            <Message
                key={message.id}
                message={message}
                user={users.get(message.user)}
                currentUserId={currentUserId}
                openProfilePopup={actions.openUserProfile}
            />
          )}
        </div>
    );
  }

  renderPreview() {
    const {renderType, filePreview} = this.props;

    switch (renderType) {
      case "text_viewer":
        return <iframe styleName="file" src={filePreview.file.url}/>;
      case "pdf_viewer":
        return (
          <object styleName="adobe_file" type="application/vnd.adobe.pdfxml">
            <iframe styleName="iframe" src={filePreview.file.url}/>
          </object>
        );
      case "image_viewer":
        return <img styleName="file" src={filePreview.file.url} alt={filePreview.text}/>;
      case "google_viewer":
      default:
        return <iframe styleName="iframe" src={this.getGoogleUrl()}/>;
    }
  }

  render() {
    const {filePreview, fileUser} = this.props;
    return (
      <div styleName="file-preview-popup">
        <div styleName="file-preview-wrapper">
          <div styleName="file-preview-header">
            <div styleName="header-left-container">
              <div styleName="file-extension">{filePreview.file.extension}</div>
              <div styleName="file-name">{filePreview.file.name}</div>
            </div>
            <div styleName="header-right-container">
              <a download href={filePreview.file.url}>
                <img
                    styleName="download-icon"
                    src="img/file_preview/download-icon.svg"
                    alt="Download"
                />
              </a>
              <img
                  styleName="close-icon"
                  src="img/file_preview/close-icon.svg"
                  onClick={this.close}
                  onKeyDown={onEnterKey(this.close)}
                  alt="Close"
                  tabIndex="0"
                  role="button"
              />
            </div>
          </div>

          <div styleName="file-preview-container">
            <div styleName="file-chat-wrapper">
              <div styleName="file-chat-header">
                <div styleName="file-details-wrapper">
                  <img
                      styleName="file-creator-img"
                      src={fileUser.picture_file.url}
                      alt={fileUser.first_name}
                  />
                  <div styleName="user-details-container">
                    <div styleName="user-full-name">
                      {`${fileUser.first_name} ${fileUser.last_name}`}
                    </div>
                    <div styleName="file-created">
                      {moment(filePreview.file.created).format("MMMM Do YYYY")}
                    </div>
                  </div>
                </div>

                <div styleName="file-description">{filePreview.text}</div>

              </div>

              <div styleName="file-chat-container">
                <div
                    className="comment-scroll-wrapper"
                    styleName="comment-scroll-wrapper"
                    ref={ref(this, "scrollWrapper")}
                >
                  {this.renderMessages()}
                </div>

                <ChatInput commentInput sendMessage={this.sendComment} sendFile={this.sendFile}/>
              </div>
            </div>

            <div styleName="file-wrapper">
              <div styleName="file-container">
                {this.renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
