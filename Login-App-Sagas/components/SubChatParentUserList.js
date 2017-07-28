// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/UserListItem.css";
import cssModules from "react-css-modules";
import User from "../records/user";

@cssModules(styles)
export default class SubChatParentUserList extends PureComponent {
  static propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool,
    checkboxState: PropTypes.bool.isRequired,
    changeCheckState: PropTypes.func.isRequired
  };

  static defaultProps = {
    isAdmin: false,
    isTA: false
  };

  state = {
    currentStateOfCheckbox: false
  }

  changeCheckState = () => this.props.changeCheckState(this.props.user.id);

  render() {
    const {user, isAdmin, isTA} = this.props;
    // const labelId = "check" + user.id;

    return (
      <div
          styleName="user-profile-button"
          title={`View ${user.first_name}'s profile`}
      >
        <div styleName="user" data-user-id={user.id} >
          <span
              styleName="user-profile-button"
          >
            <img styleName="user-img" src={user.picture_file.url} alt={user.first_name}/>
          </span>
          <div styleName="user-details-container">
            <div styleName="user-information">
              <div styleName="user-name">{user.first_name} {user.last_name}</div>
              {isAdmin && <div styleName="admin">Admin</div>}
              {isTA && <div styleName="ta">TA</div>}
            </div>
            <form styleName="parent-user-checkbox">
              <div>
                <input type="checkbox"
                    styleName="subchat-checkbox"
                    id={"check" + user.id}
                    checked={this.props.checkboxState}
                    onChange={this.changeCheckState}
                />
                {/* <input
                     type="checkbox"
                     id={"check" + user.id}
                     checked={this.props.checkboxState}
                     onChange={this.changeCheckState}
                 />
                 <label htmlFor={labelId}>
                   <span/>
                 </label>*/}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
