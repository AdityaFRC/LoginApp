import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/InviteBox.css";
import cssModules from "react-css-modules";
import User from "../records/user";

const propTypes = {
  removeUserFromInviteList: PropTypes.func.isRequired,
  inviteList: ImmutablePropTypes.orderedSetOf(PropTypes.instanceOf(User)).isRequired
};

const InviteUserList = ({removeUserFromInviteList, inviteList}) => {
  return (
    <div styleName="invited-user-list">
      {inviteList.map(user => {
        if (user.first_name) {
          const userName = `${user.first_name} ${user.last_name}`;
          return (
            <button
                key={user.id}
                onClick={() => removeUserFromInviteList(user)} // eslint-disable-line
            >
              {userName}
            </button>
          );
        } else {
          return (
            <button
                key={user.email}
                onClick={() => removeUserFromInviteList(user)} // eslint-disable-line
            >
              {user.email}
            </button>
          );
        }
      })}
    </div>
  );
};

InviteUserList.propTypes = propTypes;

export default cssModules(InviteUserList, styles);
