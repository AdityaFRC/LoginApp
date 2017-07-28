import React, {Component} from "react";
// import styles from "../styles/ChangeLog.css";
// import CSSModules from "react-css-modules";

// @CSSModules(styles)
export default class ChangeLog extends Component {
  render() {
    return (<div styleName="changeLog-container">
      <ul> First batch of changes...
        <li> test 1</li>
        <li> test 2</li>
      </ul>
    </div>);
  }
}

