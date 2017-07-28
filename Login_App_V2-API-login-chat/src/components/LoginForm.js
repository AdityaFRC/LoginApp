import React from "react";

const LoginForm = (props) =>
    <form>
          <p>
            Email:
            <input type="text" onChange={props.updateUserEmail}/>
          </p>
          <p>
            Password:
            <input type="password" onChange={props.updatePassword}/>
          </p>
          <input type="submit" onClick={props.login}/>
    </form>

export default LoginForm;
