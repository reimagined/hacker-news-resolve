import React, { Component } from 'react';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import actions from '../actions/stories';
import '../styles/submit.css';

export class Submit extends Component {
  state = {
    title: '',
    url: '',
    text: ''
  };

  handleChange(event, name) {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit() {
    this.props.onAddStory({
      userId: this.props.userId,
      title: this.state.title,
      text: this.state.text,
      link: this.state.url
    });
  }

  render() {
    if (this.props.createdStoryId) {
      return (
        <Redirect push to={`/storyDetails?id=${this.props.createdStoryId}`} />
      );
    }

    return (
      <div className="submit">
        <table border="0">
          <tbody>
            <tr>
              <td>title</td>
              <td>
                <input
                  type="text"
                  value={this.state.title}
                  onChange={e => this.handleChange(e, 'title')}
                  size="50"
                />
              </td>
            </tr>
            <tr>
              <td>url</td>
              <td>
                <input
                  type="text"
                  value={this.state.url}
                  onChange={e => this.handleChange(e, 'url')}
                  size="50"
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <b>or</b>
              </td>
            </tr>
            <tr>
              <td>text</td>
              <td>
                <textarea
                  name="text"
                  rows="4"
                  cols="49"
                  value={this.state.text}
                  onChange={e => this.handleChange(e, 'text')}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td />
            </tr>
            <tr>
              <td />
              <td>
                <button onClick={() => this.handleSubmit()}>submit</button>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <p>
                  Leave url blank to submit a question for discussion. If there
                  is no url, the text (if any) will appear at the top of the
                  thread.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    userId: state.user.id,
    createdStoryId: state.ui.createdStoryId
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    onAddStory({ userId, title, text, link }) {
      return dispatch(
        actions.createStory(uuid.v4(), {
          title,
          text,
          link,
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
