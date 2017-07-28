import React, {PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";
import {withPropagationStopped, onEnterKey} from "../helpers/events";

const propTypes = {
  subchats: ImmutablePropTypes.listOf(PropTypes.instanceOf(Chat)).isRequired,
  activeId: PropTypes.number.isRequired,
  openChat: PropTypes.func.isRequired,
  requestLoadSubchats: PropTypes.func.isRequired,
  allSubchatsLoaded: PropTypes.bool.isRequired
};

const SubchatList = ({subchats, activeId, openChat, requestLoadSubchats, allSubchatsLoaded}) =>
  <div>
    <div styleName="subchat-wrapper">
      <div styleName="subchat-line"/>

      <div styleName="subchat-container">
        <ul styleName="subchat-list">
          {subchats && subchats.map(subchat =>
            <li
                key={subchat.id}
                styleName={activeId === subchat.id ? "active" : ""}
                onClick={withPropagationStopped(() => openChat(subchat.id, subchat.parent))}
                onKeyDown={onEnterKey(withPropagationStopped(() =>
                  openChat(subchat.id, subchat.parent)
                ))}
                role="listItem"
                tabIndex="0"
            >
              {subchat.name}
            </li>)}
        </ul>
      </div>
    </div>
    {!allSubchatsLoaded ?
      <div
          styleName="create-subchat-container"
          onClick={requestLoadSubchats}
          onKeyDown={requestLoadSubchats}
          role="Button"
          tabIndex="0"
      >
        <img styleName="create-subchat-icon" src="img/left_panel/see-more-icon.svg" alt=""/>
        <div>See More</div>
      </div>
      :
      <div styleName="create-subchat-container">
        {/* <p>{ openChat ? "" : "already loaded all subchats"}</p>*/}
      </div>
    }
  </div>;

SubchatList.propTypes = propTypes;
export default cssModules(SubchatList, styles);
