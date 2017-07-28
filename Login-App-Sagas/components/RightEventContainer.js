import React from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";

const RightEventContainer = (props) =>
  <div styleName="right-event-container">
    <div styleName="add-container">
      <img styleName="add-icon" src="img/right_panel/add-people.svg" alt=""/>
      <div styleName="add-text">Create Event</div>
    </div>

    <div styleName="event-container">
      {props.renderEventList()}
    </div>
  </div>;

export default cssModules(RightEventContainer, styles);
