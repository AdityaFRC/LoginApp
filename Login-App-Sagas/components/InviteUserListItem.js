// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/InviteUserListItem.css";
import cssModules from "react-css-modules";
import User from "../records/user";
import {onEnterKey} from "../helpers/events";

@cssModules(styles)
export default class UserListItem extends PureComponent {
  static propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    addUser: PropTypes.func.isRequired
  };

  onClick = () =>
    this.props.addUser(this.props.user.id, this.props.user.first_name, this.props.user.last_name);

  render() {
    const {user} = this.props;

    return (
      <div
          styleName="invite-user-item"
          data-userId={user.id}
          onClick={this.onClick}
          onKeyDown={onEnterKey(this.onClick)}
          role="listItem"
          tabIndex="0"
      >
        <img
            styleName="user-img"
            src={user.picture_file && user.picture_file.url}
            alt={user.first_name}
        />
        <div styleName="user-details-container">
          <div styleName="user-name">{user.first_name} {user.last_name}</div>
          <div styleName="user-email">{user.email}</div>
        </div>
      </div>
    );
  }
}
