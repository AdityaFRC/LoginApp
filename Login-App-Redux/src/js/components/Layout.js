import React from "react"
import {connect} from "react-redux"
import {updateEmail} from "../actions/counterActions"
import {Greeting} from "./Greeting";
import {LoginForm} from "./LoginForm";

@connect((store) => {
  return {email: store.email};
})
export default class Layout extends React {

  constructor() {
    super();
    this.state = {
      email: "",
      isLoggedIn: false
    };
    this.updateEmail1 = this.updateEmail1.bind(this);
  };

  updateEmail1(e) {
    this.setState({email: e.target.value});
    console.log(this.state.email);
    localStorage.setItem("Email", this.state.email);

  }

  cons = () => {
    this.setState({isLoggedIn: true});
    this.state = {
      email: "",
      isLoggedIn: true
    };
    this.props.dispatch(updateEmail());
  };

  render(props) {
    return (
      <div className="Layout">

        {this.state.isLoggedIn
          ? <Greeting/>

          : <LoginForm updateUserEmail={this.updateEmail1} setLoggedInTrue={this.cons}/>}
      </div>
    );

  }
}
