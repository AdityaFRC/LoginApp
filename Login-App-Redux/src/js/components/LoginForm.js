import React from "react";
import {updateEmail} from "../actions/counterActions";

const LoginForm = (props) => <form>
  <h1>Login Form</h1>
  <p>
    Email:
    <input type="text" onChange={props.updateUserEmail}/>
  </p>
  <p>
    Password:
    <input type="password"/>
  </p>
  <input type="submit" onClick={props.setLoggedInTrue}/>
</form>

export default LoginForm;
