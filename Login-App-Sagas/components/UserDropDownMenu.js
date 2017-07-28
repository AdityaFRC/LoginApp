import React, {PropTypes} from "react";
import styles from "../styles/UserDropDownMenu.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";

const propTypes = {
  toggleProfileCreation: PropTypes.func.isRequired,
  toggleSettingsCreation: PropTypes.func.isRequired,
  toggleHelpCreation: PropTypes.func.isRequired,
  toggleReportAProblemCreation: PropTypes.func.isRequired,
  toggleLogOutCreation: PropTypes.func.isRequired,
  showReportDialog: PropTypes.func.isRequired
};

// created in the left-panel
const UserDropDownMenu = ({toggleProfileCreation, toggleSettingsCreation,
                           toggleHelpCreation, toggleReportAProblemCreation,
                           toggleLogOutCreation, showReportDialog}) =>
  // eslint-disable-next-line
  <div styleName="user-drop-down-menu" role="menu">
    <ul styleName="user-drop-down-menu-list">
      <li
          styleName="user-drop-down-menu-list-item"
          onClick={toggleProfileCreation}
          onKeyDown={onEnterKey(toggleProfileCreation)}
          role="menuItem"
          tabIndex="0"
      >
        Profile
      </li>
      <li
          styleName="user-drop-down-menu-list-item"
          onClick={toggleSettingsCreation}
          onKeyDown={onEnterKey(toggleSettingsCreation)}
          role="menuItem"
          tabIndex="0"
      >
        Settings
      </li>
      <li
          styleName="user-drop-down-menu-list-item"
          onClick={toggleReportAProblemCreation && showReportDialog}
          onKeyDown={onEnterKey(toggleReportAProblemCreation) && showReportDialog}
          role="menuItem"
          tabIndex="0"
      >
        Report a problem
      </li>
    </ul>
  </div>;

UserDropDownMenu.propTypes = propTypes;

export default cssModules(UserDropDownMenu, styles);
