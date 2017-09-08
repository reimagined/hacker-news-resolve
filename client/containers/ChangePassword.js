import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from '../actions/userActions'
import '../styles/changePassword.css'

export class ChangePassword extends React.PureComponent {
  state = {
    newPassword: '',
    currentPassword: ''
  }

  savePassword = () => {
    this.props.changePassword(
      this.state.newPassword,
      this.state.currentPassword,
      this.props.user.id
    )
    this.setState({ newPassword: '', currentPassword: '' })
  }

  onChangeCurrentPassword = event =>
    this.setState({ currentPassword: event.target.value })

  onChangeNewPassword = event =>
    this.setState({ newPassword: event.target.value })

  render() {
    return (
      <div className="change-password">
        <p>
          First, please put a valid email address in your profile. Otherwise you
          could lose your account if you mistype your new password.
        </p>
        <table>
          <tbody>
            <tr>
              <td>Current Password:</td>
              <td>
                <input
                  onChange={this.onChangeCurrentPassword}
                  value={this.state.currentPassword}
                  type="password"
                />
              </td>
            </tr>
            <tr>
              <td>New Password:</td>
              <td>
                <input
                  onChange={this.onChangeNewPassword}
                  value={this.state.newPassword}
                  type="password"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={this.savePassword}>change</button>
      </div>
    )
  }
}

export const mapStateToProps = ({ user }) => ({ user })

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePassword: (newPassword, currentPassword, userId) =>
        actions.changePassword(userId, { newPassword, currentPassword })
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
