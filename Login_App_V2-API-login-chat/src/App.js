import React, {Component} from 'react';
import LoginForm from "./components/LoginForm";
import {login} from "./ecapi";
import {getChat} from "./ecapi";
import DisplayChats from "./components/DisplayChatNames.js";
import Greeting from "./components/Greeting";
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      user: {}
    };
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateEmail(e) {
    this.setState({email: e.target.value});
  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  login = (event) => {
    event.preventDefault();
    const {email} = this.state;
    const {password} = this.state;
    login(email, password).then((response) => {
      const {user} = response.data.results;
      const {token} = response.data.results;
      localStorage.setItem('Token', token);
      this.setState({isLoggedIn: true, user});
      getChat();
    }).catch((error) => {
      console.log("Login didn't work " + error);

    });
  }

  render() {
    return (
      <div className="App">
        {this.state.isLoggedIn
          ? <Greeting user={this.state.user}/> &&  <DisplayChats chats={this.state.chats} />
          : <LoginForm login={this.login} updateUserEmail={this.updateEmail} updatePassword={this.updatePassword}/>
}
      </div>
    );
  }
}
