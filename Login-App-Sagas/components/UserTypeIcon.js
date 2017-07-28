import React, {PropTypes} from "react";
import styles from "../styles/UserTypeIcon.css";
import cssModules from "react-css-modules";

const propTypes = {
  userType: PropTypes.string.isRequired
};

const UserTypeIcon = ({userType}) =>
  <div styleName="user-type-icon">
    <span styleName="user-type__txt">{userType.charAt(0).toUpperCase()}</span>
  </div>;

UserTypeIcon.propTypes = propTypes;

export default cssModules(UserTypeIcon, styles);
