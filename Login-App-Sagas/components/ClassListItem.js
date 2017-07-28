// @flow

import React from 'react';
import styles from '../styles/ChatListItem.css';
import CSSModules from 'react-css-modules';

const ClassListItem = (props: any) =>
  <div styleName={props.isOpen ? "active-chat" : "chat"}
      onClick={() => props.openChat(props.chatId, null)}>
    <div styleName="chat-details">
      <img styleName="chat-img"
          src={props.chatImage}
          alt={props.chatName}/>
      <div styleName="chat-main-details">
        <div styleName="chat-name">{props.chatName}</div>
        {!props.isOpen && props.lastMessage ?
          <div styleName="chat-last-message">
            {props.firstName(props.lastMessage.user)}
            {props.lastMessage.text}
          </div> : ''
        }
      </div>
      <div styleName="chat-right-details">
        {props.lastMessage ?
          <div styleName="chat-message-time">{props.created}
          </div> : ''
        }
      </div>
    </div>
    {(props.isOpen && props.subchats) &&
      <div styleName="extra-container">
        <div styleName="bot-container"
            role="button"
            onClick={e => { e.stopPropagation(); props.openBotPanel(); }}>
          <img styleName="bot-icon" src={props.botPanelActive ? "img/left_panel/bot-active-icon.svg"
                                              : "img/left_panel/bot-icon.svg"} alt=""/>
          <div styleName={props.botPanelActive ? "bot-active" : "bot"}>
            <span styleName={props.botPanelActive ? "bot-active-text" : "bot-text"}>Bot</span>
          </div>
        </div>

        <div styleName="create-subchat-container"
            role="button"
            onClick={props.toggleSubchatCreation}>
          <img styleName="create-subchat-icon"
              src="img/left_panel/create-subchat-icon.svg"
              alt=""/>
          <div>Create New Subchat</div>
        </div>

        <div styleName="create-subchat-container">
          <img styleName="create-subchat-icon" src="img/left_panel/see-more-icon.svg" alt=""/>
          <div>See More</div>
        </div>
      </div>
    }
  </div>;

export default CSSModules(ClassListItem, styles);
