import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import ChatListItem from "./ChatListItem";
import cssModules from "react-css-modules";
import styles from "../styles/LeftPanel.css";
import Chat from "../records/chat";

const propTypes = {
  chats: ImmutablePropTypes.orderedMapOf(PropTypes.instanceOf(Chat)),
  findUserFirstNameById: PropTypes.func.isRequired,
  openChat: PropTypes.func.isRequired,
  requestLoadSubchats: PropTypes.func.isRequired,
  parentId: PropTypes.number,
  activeChatId: PropTypes.number,
  allSubchatsLoaded: PropTypes.bool,
  openBotPanel: PropTypes.func.isRequired,
  toggleSubchatCreation: PropTypes.func.isRequired,
  botPanelActive: PropTypes.bool,
  isCreating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  rightPanelActive: PropTypes.bool,
  closeRightPanel: PropTypes.func.isRequired
};

const defaultProps = {
  botPanelActive: false,
  isCreating: false,
  chats: null,
  parentId: null,
  activeChatId: 0,
  allSubchatsLoaded: false,
  rightPanelActive: false
};

const ChatList = ({chats, findUserFirstNameById, openChat, requestLoadSubchats, parentId,
                  activeChatId, allSubchatsLoaded, openBotPanel,
                  toggleSubchatCreation, botPanelActive, isCreating,
                  rightPanelActive, closeRightPanel, unreadMessages}) =>
  // eslint-disable-next-line
  <div>
    {chats.toArray().map((chat) =>
      !chat.parent &&
        <ChatListItem
            key={chat.id}
            chat={chat}
            getFirstName={findUserFirstNameById}
            openChat={openChat}
            requestLoadSubchats={requestLoadSubchats}
            isOpen={(parentId || activeChatId) === chat.id}
            activeId={activeChatId || -1}
            allSubchatsLoaded={allSubchatsLoaded}
            subchats={chat.subchats.map(id => chats.get(id))}
            openBotPanel={openBotPanel}
            toggleSubchatCreation={toggleSubchatCreation}
            botPanelActive={botPanelActive}
            isCreating={isCreating}
            rightPanelActive={rightPanelActive}
            closeRightPanel={closeRightPanel}
            unreadMessages={unreadMessages}
        />
    )}
  </div>;

ChatList.propTypes = propTypes;
ChatList.defaultProps = defaultProps;

export default cssModules(ChatList, styles);
