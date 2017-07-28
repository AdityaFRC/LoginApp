// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/Message.css";
import cssModules from "react-css-modules";
import moment from "moment";

import Message from "../records/message";
import User from "../records/user";
import {onEnterKey} from "../helpers/events";

@cssModules(styles)
export default class File extends PureComponent {
  static propTypes = {
    // styleOfMessage: PropTypes.oneOf(["current_user_message", "other_user_message"]).isRequired,
    message: ({message: msg}) => { // eslint-disable-line react/require-default-props
      if (msg === undefined) return new Error("message prop in File component is required");
      if (!(msg instanceof Message))
        return new Error("message prop in File component must be a Message record");
      if (msg.file === null)
        return new Error("message record passed to File component must have a non-null file");
      return null;
    },
    user: PropTypes.instanceOf(User).isRequired,
    setFilePreview: PropTypes.func.isRequired
  };

  setFilePreview = () => this.props.setFilePreview(this.props.message);

  render() {
    const {message, user} = this.props;
    return (
      // <div styleName="message" data-message-id={message.id} data-style={styleOfMessage}>
      <div styleName="message" data-message-id={message.id}>
        <div className="user-image-container">
          <img
              styleName="message-image"
              src={user.picture_file && user.picture_file.url}
              alt={user.first_name}
          />
        </div>

        <div styleName="message-detail-container" title={moment(message.created).calendar()}>
          <div styleName="message-username">{user.first_name}</div>
          <div styleName="message-textarea">
            <div
                styleName="file-ext-container"
                onClick={this.setFilePreview}
                onKeyDown={onEnterKey(this.setFilePreview)}
                role="link"
                tabIndex="0"
            >
              {message.file.extension}
            </div>

            <div styleName="file-details-container">
              <div styleName="file-message">Uploaded a file</div>
              <div styleName="file-title">{message.file.name}</div>
              <div styleName="file-size">{(message.file.filesize / 1024).toFixed(2)} KB</div>
            </div>

            {/* <div className="message-text">{props.text}</div>*/}
          </div>
          {/* <div className="text-comment-count comment-count">{props.commentCount}</div>*/}
        </div>
      </div>
    );
  }
}
