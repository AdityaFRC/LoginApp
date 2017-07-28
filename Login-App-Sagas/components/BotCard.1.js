import React from "react";
import styles from "../styles/BotPanel.css";
import cssModules from "react-css-modules";
import UserTypeIcon from "./UserTypeIcon";

const BotCard1 = () =>
  <div styleName="bot-card-alt">
    <p styleName="bot-card__title">How electrons work?</p>
    {/* <hr styleName="bot-card__separator" />*/}
    <div styleName="bot-card__body">
      <div styleName="user-info">
        <img src="img/team/sarth.jpg"alt="" styleName="user-info__img"/>
        <span styleName="user-info__name">Sarth Desai</span>
        <UserTypeIcon userType={"teacher"}/>
      </div>
      <p styleName="bot-card__text">
        An atom that gains electrons has more negative particles and is negatively charge…
      </p>
    </div>
    {/* <hr styleName="bot-card__separator" />*/}
    <div styleName="read-more__container">
      <button styleName="read-more-btn">Read more</button>
    </div>
  </div>;

export default cssModules(BotCard1, styles);
