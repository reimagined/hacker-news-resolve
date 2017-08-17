import React from 'react';

import '../styles/login.css';

const LoginForm = ({ title, action, buttonText }) =>
  <div className="login">
    <h1>
      {title}
    </h1>
    <form method="GET" action={action}>
      <table>
        <tbody>
          <tr>
            <td>username:</td>
            <td>
              <input type="text" name="name" />
            </td>
          </tr>
          <tr>
            <td>password:</td>
            <td>
              <input type="password" name="password" />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <input type="submit" value={buttonText} />
    </form>
  </div>;

export default LoginForm;
