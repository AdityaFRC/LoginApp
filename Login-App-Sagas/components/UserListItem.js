// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/UserListItem.css";
import cssModules from "react-css-modules";
import User from "../records/user";

@cssModules(styles)
export default class UserListItem extends PureComponent {
  static propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    openUserPopup: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool
  };

  static defaultProps = {
    isAdmin: false,
    isTA: false
  };

  openProfile = () => this.props.openUserPopup(this.props.user.id);

  render() {
    const {user, isAdmin, isTA} = this.props;

    return (
      <button
          styleName="user-profile-button"
          onClick={this.openProfile}
          title={`View ${user.first_name}'s profile`}
      >
        <div styleName="user" data-user-id={user.id} >
          <span
              styleName="user-profile-button"
          >
            <img styleName="user-img" src={user.picture_file.url} alt={user.first_name}/>
          </span>
          <div styleName="user-details-container">
            <div styleName="user-name">{user.first_name} {user.last_name}</div>
            {isAdmin && <div styleName="admin">Admin</div>}
            {isTA && <div styleName="ta">TA</div>}
          </div>
        </div>
      </button>
    );
  }
}
