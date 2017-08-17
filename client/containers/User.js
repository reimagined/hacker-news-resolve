import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

const User = ({ id, name, createdAt, karma }) => {
  if (!id) {
    return (
      <div>
        <h1>Error</h1>
        User not found
      </div>
    );
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>id:</td>
            <td>
              {id}
            </td>
          </tr>
          <tr>
            <td>name:</td>
            <td>
              {name}
            </td>
          </tr>
          <tr>
            <td>createdAt:</td>
            <td>
              {createdAt}
            </td>
          </tr>
          <tr>
            <td>karma:</td>
            <td>
              {karma}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = ({ user, users }, ownProps) => {
  const { location } = ownProps;

  const { id } = queryString.parse(location.search);

  if (id) {
    return users[id];
  }

  return user;
};

export default connect(mapStateToProps)(User);
