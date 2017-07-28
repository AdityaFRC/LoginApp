import React, {Component} from 'react';
import {connect} from "react-redux";

@connect((store) => {
  return {email: store.email};
})

export default class Greeting extends Component {
  render() {
    return (
      <h1>Hello, {this.state.email}! Welcome to Edu.Chat!</h1>
    );
  }
}
