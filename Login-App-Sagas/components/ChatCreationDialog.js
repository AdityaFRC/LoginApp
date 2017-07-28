import React, {PropTypes} from "react";
import styles from "../styles/EduChatDialog.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";

const propTypes = {
  toggleChatCreation: PropTypes.func.isRequired,
  toggleClassCreation: PropTypes.func.isRequired
};

const ChatCreationDialog = ({toggleChatCreation, toggleClassCreation}) =>
  <div>
    <div styleName="edu-chat-bgm">
      <div styleName="edu-chat-dialog">
        <ul styleName="edu-chat-dialog-list" role="menu">
          <li
              styleName="edu-chat-dialog-list-item"
              onClick={toggleClassCreation}
              tabIndex="0"
              role="menuitem"
              onKeyDown={onEnterKey(toggleClassCreation)}
          >
            Class
          </li>
          <li
              styleName="edu-chat-dialog-list-item"
              onClick={toggleChatCreation}
              tabIndex="0"
              role="menuitem"
              onKeyDown={onEnterKey(toggleChatCreation)}
          >
            Chat
          </li>
        </ul>
      </div>
    </div>
  </div>;

ChatCreationDialog.propTypes = propTypes;

export default cssModules(ChatCreationDialog, styles);
