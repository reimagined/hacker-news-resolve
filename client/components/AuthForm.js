import React from 'react'

import '../styles/login.css'

const AuthForm = ({ title, action, buttonText }) => (
  <div className="auth-form">
    <h2>{title}</h2>
    <form method="POST" action={action}>
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
  </div>
)

export default AuthForm
