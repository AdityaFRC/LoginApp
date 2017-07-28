// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/FileListItem.css";
import cssModules from "react-css-modules";
import moment from "moment";

import Message from "../records/message";
import {onEnterKey} from "../helpers/events";

@cssModules(styles)
export default class FileListItem extends PureComponent {
  static propTypes = {
    message: PropTypes.instanceOf(Message).isRequired,
    setFilePreview: PropTypes.func.isRequired
  };

  setFilePreview = () => this.props.setFilePreview(this.props.message);

  render() {
    const {message} = this.props;
    return (
      <div
          styleName="file"
          onClick={this.setFilePreview}
          onKeyDown={onEnterKey(this.setFilePreview)}
          role="link"
          tabIndex="0"
      >
        <div styleName="file-container">
          <div styleName="file-extension">{message.file.extension}</div>
        </div>

        <div styleName="file-details-container">
          <div styleName="file-title">{message.file.name}</div>
          <div styleName="file-date">{moment(message.created).format("MMMM Do YYYY")}</div>
        </div>

        <div styleName="comment-icon">
          {message.comment_count > 0 ? message.comment_count : "+"}
        </div>
      </div>
    );
  }
}
