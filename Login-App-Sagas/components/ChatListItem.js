// @flow

import React, {PureComponent, PropTypes} from "react";
import moment from "moment";
import ImmutablePropTypes from "react-immutable-proptypes";

import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import SubchatList from "./SubchatList";
import {onEnterKey, withPropagationStopped} from "../helpers/events";
import Chat from "../records/chat";

@cssModules(styles)
export default class ChatListItem extends PureComponent {
  static propTypes = {
    openChat: PropTypes.func.isRequired,
    requestLoadSubchats: PropTypes.func.isRequired,
    chat: PropTypes.instanceOf(Chat).isRequired,
    isOpen: PropTypes.bool.isRequired,
    getFirstName: PropTypes.func.isRequired,
    subchats: ImmutablePropTypes.listOf(PropTypes.instanceOf(Chat)).isRequired,
    // openBotPanel: PropTypes.func.isRequired,
    toggleSubchatCreation: PropTypes.func.isRequired,
    activeId: PropTypes.number.isRequired,
    // botPanelActive: PropTypes.bool,
    isCreating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    allSubchatsLoaded: PropTypes.bool.isRequired,
    rightPanelActive: PropTypes.bool.isRequired,
    closeRightPanel: PropTypes.func.isRequired
  };

  static defaultProps = {
    // botPanelActive: false,
    isCreating: false
  };

  openChat = () => {
    this.props.openChat(this.props.chat.id, null);
    if (this.props.rightPanelActive) {
      this.props.closeRightPanel();
    }
  }

  requestLoadSubchats = () => this.props.requestLoadSubchats();

  renderUnreadMsgsBubble = (chatId, unreadMessages = "") => {
    /* if(unreadMessages)
      return <p>N: {unreadMessages.unreadMessages[chatId.toString()].unreadMsgsCount}</p>;
    else
      return <p>N: unreadMessages</p>;*/
  }

  render() {
    const {
      openChat,
      requestLoadSubchats,
      chat,
      isOpen,
      getFirstName,
      subchats,
      // openBotPanel,
      toggleSubchatCreation,
      activeId,
      // botPanelActive,
      isCreating,
      allSubchatsLoaded,
      unreadMessages
    } = this.props;
    console.log(unreadMessages);
    /*
    let unreadMsgsCount = undefined;
    if(unreadMessages) {
      console.log("old life", unreadMessages);
      unreadMsgsCount = unreadMessages[chat.id.toString()].unreadMsgsCount;
    } */

    return (
      <div
          styleName={isOpen ? "active-chat" : "chat"}
          onClick={this.openChat}
          role="listitem"
          tabIndex="0"
          onKeyDown={onEnterKey(this.openChat)}
      >
        <div styleName="chat-details">
          {this.renderUnreadMsgsBubble(chat.id, unreadMessages)}
          <img
              styleName="chat-img"
              src={chat.picture_file && chat.picture_file.url}
              alt={chat.chat_name}
              style={{borderColor: `${chat.color && chat.color.hexcode}`}}
          />
          <div styleName="chat-main-details">
            <div styleName="chat-name">{chat.name}</div>
            {(!isOpen && chat.most_recent_message) &&
              <div styleName="chat-last-message">
                {getFirstName(chat.most_recent_message.user)}: {chat.most_recent_message.text}
              </div>
            }
          </div>
          <div styleName="chat-right-details">
            {chat.most_recent_message &&
              <div styleName="chat-message-time">
                {moment(chat.most_recent_message.created).fromNow()}
              </div>
            }
          </div>
        </div>
        <div styleName="dropdown-arrow-inactive">
          <img
              src="img/left_panel/dropdown-arrow.svg"
              alt=""
          />
        </div>
        {(isOpen && subchats) &&

          <div styleName="extra-container">
            <div styleName="dropdown-arrow-active">
              <img
                  src="img/left_panel/dropdown-arrow.svg"
                  alt=""
              />
            </div>
            {/* <div
                styleName="bot-container"
                role="button"
                onClick={withPropagationStopped(openBotPanel)}
                onKeyDown={onEnterKey(withPropagationStopped(openBotPanel))}
                tabIndex="0"
            >
              <img
                  styleName="bot-icon"
                  src={botPanelActive ?
                    "img/left_panel/bot-active-icon.svg" :
                    "img/left_panel/bot-icon.svg"}
                  alt=""
              />
              <div styleName={botPanelActive ? "bot-active" : "bot"}>
                <span styleName={botPanelActive ? "bot-active-text" : "bot-text"}>Bot</span>
              </div>
            </div>*/}
            <div styleName="announcements-container">Announcements</div>
            <div
                styleName="create-subchat-container"
                role="button"
                onClick={withPropagationStopped(toggleSubchatCreation)}
                tabIndex="0"
                onKeyDown={onEnterKey(withPropagationStopped(toggleSubchatCreation))}
            >
              <img
                  styleName="create-subchat-icon"
                  src="img/group-9.svg"
                  alt=""
              />
              <div styleName="textField">
                Create New Subchat
              </div>
            </div>
            <SubchatList
                subchats={subchats}
                activeId={activeId}
                openChat={openChat}
                requestLoadSubchats={requestLoadSubchats}
                allSubchatsLoaded={allSubchatsLoaded}
            />
          </div>
        }
      </div>
    );
  }
}
