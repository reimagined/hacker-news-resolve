import React from 'react'
import uuid from 'uuid'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import urlLib from 'url'
import styled from 'styled-components'

import actions from '../actions/storiesActions'
import '../styles/submit.css'

const Wrapper = styled.div`
  padding-left: 3em;
  padding-right: 1.25em;
  margin-top: 1em;
  margin-bottom: 0.5em;
`

const Label = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  padding: 5px 0;
`

const Content = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const ErrorMessage = styled.div`color: red;`

export class Submit extends React.PureComponent {
  state = {
    title: '',
    url: '',
    text: ''
  }

  handleChange = (event, name) => this.setState({ [name]: event.target.value })

  handleSubmit = () => {
    const { title, url, text } = this.state

    if (!title || (!text && !url)) {
      return this.props.history.push('/error?text=Enter submit data')
    }

    if (url && !urlLib.parse(url).hostname) {
      return this.props.history.push('/error?text=Enter valid url')
    }

    return this.props.createStory({
      userId: this.props.userId,
      title,
      text,
      link: url
    })
  }

  render() {
    if (this.props.createdStoryId) {
      return <Redirect push to={`/storyDetails/${this.props.createdStoryId}`} />
    }

    if (!this.props.userId) {
      return <Redirect to="/login?redirect=/submit" />
    }

    return (
      <Wrapper>
        <Label>title</Label>
        <Content>
          <input
            type="text"
            value={this.state.title}
            onChange={e => this.handleChange(e, 'title')}
            size="50"
          />
        </Content>
        <br />
        <Label>url</Label>
        <Content>
          <input
            type="text"
            value={this.state.url}
            onChange={e => this.handleChange(e, 'url')}
            size="50"
          />
        </Content>
        <br />
        <Label />
        <Content>
          <b>or</b>
        </Content>
        <br />
        <Label>text</Label>
        <Content>
          <textarea
            name="text"
            rows="4"
            cols="49"
            value={this.state.text}
            onChange={e => this.handleChange(e, 'text')}
          />
        </Content>
        <br />
        <Label />
        <Content>
          <ErrorMessage>
            {this.props.storyCreationError ? this.props.storyCreationError : ''}
          </ErrorMessage>
        </Content>
        <br />
        <Label />
        <button onClick={this.handleSubmit} disabled={this.props.storyCreation}>
          submit
        </button>
        <br />
        <br />
        Leave url blank to submit a question for discussion. If there is no url,
        the text (if any) will appear at the top of the thread.
      </Wrapper>
    )
  }
}

export const mapStateToProps = ({ user, ui }) => ({
  userId: user.id,
  storyCreation: ui.storyCreation,
  storyCreationError: ui.storyCreationError,
  createdStoryId: ui.createdStoryId
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createStory: ({ userId, title, text, link }) =>
        actions.createStory(uuid.v4(), {
          title,
          text,
          link,
          userId
        })
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Submit)
