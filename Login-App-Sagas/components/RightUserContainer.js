import React, {PropTypes} from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";
import InviteBox from "./InviteBox";

const propTypes = {
  renderUserList: PropTypes.func.isRequired
};

function RightUserContainer({renderUserList, currentUserIsAdmin}) {
  if (currentUserIsAdmin) {
    return (
      <div styleName="right-user-container">
        <InviteBox/>

        <hr styleName="seperator"/>

        <div styleName="user-container">
          {renderUserList()}
        </div>
      </div>
    );
  } else {
    return (
      <div styleName="right-user-container">
        <div styleName="user-container">
          {renderUserList()}
        </div>
      </div>
    );
  }
}

RightUserContainer.propTypes = propTypes;

export default cssModules(RightUserContainer, styles);
