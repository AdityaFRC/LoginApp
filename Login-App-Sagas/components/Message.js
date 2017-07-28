// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/Message.css";
import cssModules from "react-css-modules";
import moment from "moment";
import MessageRecord from "../records/message";
import User from "../records/user";

@cssModules(styles)
export default class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.instanceOf(MessageRecord).isRequired,
    openProfilePopup: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User),
    currentUserId: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool,
    isSelf: PropTypes.bool
  };

  static defaultProps = {
    user: null,
    isAdmin: false,
    isTA: false,
    isSelf: false
  };

  openProfile = () => this.props.openProfilePopup(this.props.user.id);

  renderMessageWithUser = (user, message, currentUserId, isAdmin, isSelf, isTA) => {
    return(
      <div
          styleName="message"
          data-message-id={message.id}
          data-style={user.id === currentUserId ? "current_user_message" : "other_user_message"}
      >
        <div className="user-image-container">
          {user &&
            <button styleName="user-image-btn" onClick={this.openProfile}>
              <img styleName="message-image" src={user.picture_file.url} alt={user.first_name}/>
            </button>
          }
        </div>

        <div styleName="message-detail-container" title={moment(message.created).calendar()}>
          <div styleName="user-details-container">
            <div styleName="message-username">{user && user.first_name}</div>
            {!isSelf && isAdmin && <div styleName="admin">Admin</div>}
            {!isSelf && isTA && <div styleName="ta">TA</div>}
          </div>
          <div styleName="message-textarea">
            <div className="message-text">{message.text}</div>
          </div>
          {/* <div className="text-comment-count comment-count">{props.commentCount}</div>*/}
        </div>
      </div>
    );
  }

  render() {
    const {message, currentUserId, user, isAdmin, isTA, isSelf} = this.props;
    if(user) {
      return this.renderMessageWithUser(user, message, currentUserId, isAdmin, isSelf, isTA);
    } else {
      return(
        <div styleName="message-no-user" data-style="other_user_message">
          <div styleName="message-detail-container" title={moment(message.created).calendar()}>
            <div styleName="message-textarea">
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
