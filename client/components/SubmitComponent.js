import React, { Component } from 'react';
import uuid from 'uuid';
import { connect } from 'react-redux';
import actions from '../actions/news';

class SubmitComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      url: '',
      text: ''
    };
  }

  handleChange(event, name) {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit() {
    this.props.onAddNews({
      userId: this.props.userId,
      title: this.state.title,
      text: this.state.text,
      link: this.state.url
    });
    this.setState({
      title: '',
      url: '',
      text: ''
    });
  }

  render() {
    return (
      <div className="App__form">
        <table border="0">
          <tbody>
            <tr>
              <td>Title</td>
              <td>
                <input
                  type="text"
                  value={this.state.title}
                  onChange={e => this.handleChange(e, 'title')}
                />
              </td>
            </tr>
            <tr>
              <td>Url</td>
              <td>
                <input
                  size="50"
                  type="text"
                  value={this.state.url}
                  onChange={e => this.handleChange(e, 'url')}
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
              <td>Text</td>
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
                <button onClick={() => this.handleSubmit()}>Submit</button>
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

function mapStateToProps(state) {
  return {
    userId: state.user.id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddNews({ userId, title, text, link }) {
      return dispatch(
        actions.createNews(uuid.v4(), {
          title,
          text,
          link,
          userId
        })
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitComponent);
