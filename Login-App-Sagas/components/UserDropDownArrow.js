import React, {Component, PropTypes} from "react";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";
import {toggleUserDropDownMenu} from "../actions/ui/left-panel";
import connect from "../helpers/connect-with-action-types";
import ref from "../helpers/ref";
import {onEnterKey} from "../helpers/events";

/**
 * This component is used in the left-panel header.
 */
@connect(state => ({
  userDropDownMenuActive: state.ui.leftPanel.userDropDownMenuActive
}), {
  toggleUserDropDownMenu
})
@cssModules(styles)
export default class UserDropDownArrow extends Component {
  static propTypes = {
    userDropDownMenuActive: PropTypes.bool.isRequired,
    source: PropTypes.string.isRequired
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
    const {userDropDownMenuActive, actions} = this.props;

    if (!userDropDownMenuActive) {
      // if this menu is already closed, then no need to check if click outside
      return;
    }
    // check if this dropDownRef exists and if the click is on
    // any target other than this component(or its children)
    if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
      // click outside => close this dropdown menu for better user experience
      actions.toggleUserDropDownMenu(false);
    }
  }

  toggle = () => this.props.actions.toggleUserDropDownMenu(!this.props.userDropDownMenuActive);

  render() {
    return (
      <div
          styleName="drop-down-list"
          onClick={this.toggle}
          onKeyDown={onEnterKey(this.toggle)}
          role="button"
          tabIndex="0"
          ref={ref(this, "dropDownRef")}
      >
        <img styleName="user-image" src={this.props.source} alt="user profile"/>
        <img
            styleName="down-arrow-image"
            src="img/left_panel/down-arrow.svg"
            alt="toggle message menu"
        />
      </div>
    );
  }
}
