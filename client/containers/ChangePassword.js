import React, { Component } from 'react';
import { connect } from 'react-redux';

import actions from '../actions/userActions';
import '../styles/changePassword.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPassword: '',
      currentPassword: ''
    };
  }

  onPasswordChange() {
    this.props.changePassword(
      this.state.newPassword,
      this.state.currentPassword,
      this.props.user.id
    );
    this.setState({ newPassword: '', currentPassword: '' });
  }

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
                  onChange={e =>
                    this.setState({ currentPassword: e.target.value })}
                  value={this.state.currentPassword}
                  type="password"
                />
              </td>
            </tr>
            <tr>
              <td>New Password:</td>
              <td>
                <input
                  onChange={e => this.setState({ newPassword: e.target.value })}
                  value={this.state.newPassword}
                  type="password"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={() => this.onPasswordChange()}>change</button>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = dispatch => ({
  changePassword: (newPassword, currentPassword, userId) =>
    dispatch(actions.changePassword(userId, { newPassword, currentPassword }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
