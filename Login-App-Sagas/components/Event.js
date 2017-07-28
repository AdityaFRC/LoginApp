// @flow

// This file was not fixed with the new style guide rules as the feature has been removed

import React from 'react';
import styles from '../styles/Message.css';
import CSSModules from 'react-css-modules'

const Event = (props: any) =>
  <div styleName="message" data-message-id={props.messageId} data-style={props.styleOfMessage}>
    <div className="user-image-container">
      <img styleName="message-image" src={props.userImage} alt={`${props.firstName}`}/>
    </div>

    <div styleName="message-detail-container">
      <div styleName="message-username">{props.firstName}</div>
        <div styleName="message-textarea">
          <div styleName="event-date-container">
            <div styleName="event-month">{props.eventMonth}</div>
            <div styleName="event-day">{props.eventDay}</div>
          </div>
          <div styleName="event-details-container">
            <div styleName="event-message">Created an Event</div>
            <div styleName="event-title">{props.eventTitle}</div>
            <div styleName="event-timestamp">{props.eventTimeFrame}</div>
          </div>
          <div styleName="message-timestamp">{props.created}</div>
        </div>

      {/*<div className="text-comment-count comment-count">{props.commentCount}</div>*/}
    </div>
  </div>;

export default CSSModules(Event, styles);
