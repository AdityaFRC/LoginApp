import React from "react";
import styles from "../styles/BotPanel.css";
import cssModules from "react-css-modules";

const BotRightPanel = () =>
  <div styleName="bot-right-panel">
    <div styleName="bot-right-panel__header">
      <button styleName="bot-right-panel__header__button" title="Search question">
        <img src="img/bot-search.svg" alt="search question"/>
      </button>
      <span styleName="bot-right-panel__header__title">Class Questions</span>
      <button styleName="bot-right-panel__header__button" title="Add question">
        <img src="img/bot-plus.svg" alt="add question"/>
      </button>
    </div>
    <button styleName="bot-right-panel__question">
      <div styleName="bot-right-panel__question__title">
        <h3>How electrons work?</h3>
        <span>10:50 PM</span>
      </div>
      <p>I read thru the pdf but still could not figure out how they work.</p>
    </button>
    <button styleName="bot-right-panel__question" tabIndex="0">
      <div styleName="bot-right-panel__question__title">
        <h3>what is cyclone in a electron?</h3>
        <span>10:50 PM</span>
      </div>
      <p>Can someone explain me the porperly.</p>
    </button>
    <button styleName="bot-right-panel__question" tabIndex="0">
      <div styleName="bot-right-panel__question__title">
        <h3>Question from lecture one</h3>
        <span>10:50 PM</span>
      </div>
      <p>What is the book page no. for the...</p>
    </button>
    <button styleName="bot-right-panel__question" tabIndex="0">
      <div styleName="bot-right-panel__question__title">
        <h3>How electrons work?</h3>
        <span>10:50 PM</span>
      </div>
      <p>I read thru the pdf but still could not figure out how they work.</p>
    </button>
  </div>;

export default cssModules(BotRightPanel, styles);

