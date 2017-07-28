import React, {PropTypes} from "react";
import styles from "../styles/CreateChatOrClass.css";
import cssModules from "react-css-modules";

const propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  togglePrivacy: PropTypes.func.isRequired,
  isPrivacyChanged: PropTypes.bool,
  thisChatType: PropTypes.string.isRequired
};

const defaultProps = {
  isPrivacyChanged: false
};

const ChatPrivacyToggle = ({isPrivate, togglePrivacy, isPrivacyChanged, thisChatType}) => {
  return (
    <div styleName="chat-privacy-selection-box">
      <p styleName="chat-privacy-title">Choose Privacy</p>
      {isPrivate ?
        <button
            styleName="chat-privacy-button chat-privacy-button--private"
            onClick={togglePrivacy}
        >
          <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Private
          </span>
          <span styleName="chat-privacy-button__text">Public</span>
        </button>
        :
        <button
            styleName="chat-privacy-button chat-privacy-button--public"
            onClick={togglePrivacy}
        >
          <span styleName="chat-privacy-button__text">Private</span>
          <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Public
          </span>
        </button>
      }
      {isPrivate ?
        <p styleName="chat-privacy-desc">
          The {thisChatType.toLowerCase()} can only be joined or viewed by invite only
        </p>
        :
        <p styleName="chat-privacy-desc">
          The {thisChatType.toLowerCase()} can be joined or viewed without invitation
        </p>
      }
    </div>
  );
};

ChatPrivacyToggle.propTypes = propTypes;
ChatPrivacyToggle.defaultProps = defaultProps;

export default cssModules(ChatPrivacyToggle, styles, {allowMultiple: true});
