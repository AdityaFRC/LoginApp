import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/InviteBox.css";
import cssModules from "react-css-modules";
import User from "../records/user";

const propTypes = {
  addUserToInviteList: PropTypes.func.isRequired,
  inviteAutoCompleteList: ImmutablePropTypes.listOf(PropTypes.instanceOf(User)).isRequired
  // usersListInActiveChat: PropTypes.any
};

const InviteAutoComplete = ({addUserToInviteList, inviteAutoCompleteList, usersListInActiveChat
  }) => {
  function isUserAlreadyIn(user, userListInActiveChat) {
    if (!user.id) {
      return false;
    }
    for (const eachUserID of userListInActiveChat) {
      if (eachUserID === user.id) {
        return true;
      }
    }
    return false;
  }

  return (
    <div styleName="invite-autocomple">
      {inviteAutoCompleteList.map((user) => {
        if (!isUserAlreadyIn(user, usersListInActiveChat)) {
          return (
            <button
                styleName="invite-autocomple__item"
                key={user.id}
              onClick={() => addUserToInviteList(user)} // eslint-disable-line
            >
              <img styleName="user-img" src={user.picture_file.url} alt=""/>
              <div styleName="user-name">{user.first_name} {user.last_name}</div>
              <br />
              <div styleName="user-email">{user.email}</div>
            </button>
          );
        } else {
          return (
            <button
                styleName="disable-invite"
                key={user.id}
            >
              <img styleName="user-img" src={user.picture_file.url} alt=""/>
              <div styleName="user-name">{user.first_name} {user.last_name}</div>
              <br />
              <div styleName="user-email">{user.email}</div>
              <div styleName="user-message">this user has been invited</div>
            </button>
          );
        }
      }
    )}
    </div>
  );
};

InviteAutoComplete.propTypes = propTypes;

export default cssModules(InviteAutoComplete, styles);
