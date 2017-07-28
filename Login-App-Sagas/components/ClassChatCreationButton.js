import React, {PureComponent, PropTypes} from "react";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";
import {toggleChatCreationDialog} from "../actions/ui/left-panel";
import connect from "../helpers/connect-with-action-types";
import ref from "../helpers/ref";
import {onEnterKey} from "../helpers/events";

/**
 * This component is used in the left-panel header.
 */
@connect(state => ({
  chatCreationDialogActive: state.ui.leftPanel.chatCreationDialogActive
}), {
  toggleChatCreationDialog
})
@cssModules(styles)
export default class ClassChatCreationButton extends PureComponent {
  static propTypes = {
    chatCreationDialogActive: PropTypes.bool.isRequired
  };

  componentDidMount() {
    window.addEventListener("click", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside, false);
  }

  /**
   * Check if the mouse clicks on anywhere other than this dropdown menu arrow.
   * When the user clicks on the menu item such as "Settings",
   *  this checking work won't be triggered since this component is unmounted already.
   */
  handleClickOutside = (event) => {
    const {chatCreationDialogActive, actions} = this.props;

    if (!chatCreationDialogActive) {
      // if this menu is already closed, then no need to check if click outside
      return;
    }
    // check if this dropDownRef exists and if the click is on
    // any target other than this component(or its children)
    if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
      // click outside => close this dropdown menu for better user experience
      actions.toggleChatCreationDialog(false);
    }
  }

  onButtonClick = () =>
    this.props.actions.toggleChatCreationDialog(!this.props.chatCreationDialogActive);

  render() {
    return (
      <img
          styleName="create-chat-icon"
          ref={ref(this, "dropDownRef")}
          src="img/left_panel/create.svg"
          alt="create chat"
          onClick={this.onButtonClick}
          // onMouseEnter={this.onButtonClick}
          onKeyDown={onEnterKey(this.onButtonClick)}
          role="button"
          tabIndex="0"
      />
    );
  }
}
