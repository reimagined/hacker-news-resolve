import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import { gqlConnector, withViewModel } from 'resolve-redux'
import styled from 'styled-components'

import viewModel from '../../common/view-models/storyDetails'
import Story from '../containers/Story'
import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'

const StoryDetailsRoot = styled.div`
  padding: 1em 1.25em 0 1.75em;
  margin-bottom: 1em;
`

const Reply = styled.div`
  padding: 1em 1.25em 0 1.25em;
  margin-bottom: 1em;
`

export class StoryDetails extends React.PureComponent {
  saveComment = () => {
    this.props.commentStory({
      text: this.textarea.value,
      parentId: this.props.story.id
    })

    this.textarea.value = ''
  }

  render() {
    const { data: { me }, story } = this.props
    const loggedIn = !!me

    if (!story) {
      return null
    }

    return (
      <StoryDetailsRoot>
        <Story showText story={story} userId={me && me.id} />
        {loggedIn ? (
          <Reply>
            <textarea
              ref={element => (this.textarea = element)}
              name="text"
              rows="6"
              cols="70"
            />
            <div>
              <button
                ref={element => (this.submit = element)}
                onClick={this.saveComment}
              >
                add comment
              </button>
            </div>
          </Reply>
        ) : null}
        <ChildrenComments
          storyId={story.id}
          comments={story.comments}
          parentId={story.id}
        />
      </StoryDetailsRoot>
    )
  }
}

export const mapStateToProps = (state, props) => ({
  story: state.viewModels[viewModel.name][props.match.params.storyId],
  viewModel: viewModel.name,
  aggregateId: props.match.params.storyId
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      commentStory: ({ parentId, text }) =>
        actions.commentStory(parentId, {
          text,
          parentId,
          commentId: uuid.v4()
        }),
      loadStory: storyId => ({
        type: 'LOAD_STORY',
        storyId
      })
    },
    dispatch
  )

export default gqlConnector(
  `
    query {
      me {
        id
      }
    }
  `,
  {
    options: ({ match: { params: {} } }) => ({})
  }
)(connect(mapStateToProps, mapDispatchToProps)(withViewModel(StoryDetails)))
