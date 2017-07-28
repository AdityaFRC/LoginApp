// @flow

// This file was not fixed with the new code style rules as the feature has been removed

import React from "react";
import styles from "../styles/EventListItem.css";
import CSSModules from "react-css-modules";

const EventListItem = (props: any) =>
  <div styleName="event" data-user-id={props.eventId}>
    <div styleName="event-date-container">
      <div styleName="event-month">{props.eventMonth}</div>
      <div styleName="event-day">{props.eventDay}</div>
    </div>

    <div styleName="event-details-container">
      <div styleName="event-title">{props.eventTitle}</div>
      <div styleName="event-date">{props.eventDate}</div>
    </div>

    <div styleName="comment-icon">{props.commentCount > 0 ? props.commentCount : "+"}</div>
  </div>;

export default CSSModules(EventListItem, styles);
