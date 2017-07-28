import React, {PropTypes} from "react";
import styles from "../styles/MainPanel.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";

const propTypes = {
  mainHeaderType: PropTypes.string.isRequired,
  chat: PropTypes.instanceOf(Chat),
  chatParent: PropTypes.instanceOf(Chat),
  rightPanelActive: PropTypes.bool,
  toggleRightPanel: PropTypes.func.isRequired
};

const defaultProps = {
  chat: null,
  chatParent: null,
  rightPanelActive: false
};

const MainHeader = ({mainHeaderType, chat, chatParent, rightPanelActive, toggleRightPanel}) =>
  <div className={mainHeaderType} styleName="main-header">
    {chat &&
      <div styleName="chat-details-container">
        <img styleName="chat-img" src={chat.picture_file.url} alt=""/>
        {mainHeaderType === "edit" ?
          chatParent ?
            <div styleName="chat-details">
              <div styleName="chat-title">
                {chatParent.name}
              </div>
              <div className="chat-name-input" styleName="subchat-input" contentEditable="true">
                {chat.name}
              </div>
            </div>
            :
            <div styleName="chat-details">
              <div className="chat-name-input" styleName="chat-input" contentEditable="true">
                {chat.name}
              </div>
              {/* It might be possible to remove this div */}
              <div className="subchat-name" styleName="subchat-title"/>
            </div>
          :
          chatParent ?
            <div styleName="chat-details">
              <div styleName="chat-title">
                {chatParent.name}
              </div>
              <div className="subchat-name" styleName="subchat-title">
                {chat.name}
              </div>
            </div>
            :
            <div styleName="chat-details">
              <div styleName="chat-title-only">
                {chat.name}
              </div>
              {/* It might be possible to remove this div */}
              <div className="subchat-name" styleName="subchat-title"/>
            </div>
        }

        {rightPanelActive ?
          <button
              styleName="toggle-right-panel toggle-right-panel__active"
              onClick={toggleRightPanel}
          >
            <img
                src="img/fill-64.svg"
                alt="toggle right panel"
                title="Toggle the right panel"
            />
          </button>
          :
          <button styleName="toggle-right-panel" onClick={toggleRightPanel}>
            <img
                src="img/toggle-right-panel-white.svg"
                alt="toggle right panel"
                title="Toggle the right panel"
            />
          </button>
        }
      </div>
    }

    {(chat && mainHeaderType === "bio") &&
      <div styleName="chat-desc">{chat.description}</div>
    }

    {(chat && mainHeaderType === "edit") &&
      <div className="chat-desc-input" styleName="chat-desc-textarea" contentEditable="true">
        {chat.description}
      </div>
    }
  </div>;

MainHeader.propTypes = propTypes;
MainHeader.defaultProps = defaultProps;

export default cssModules(MainHeader, styles, {allowMultiple: true});
