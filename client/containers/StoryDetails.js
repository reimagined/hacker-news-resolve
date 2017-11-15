import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import uuid from 'uuid'
import { gqlConnector } from 'resolve-redux'
import styled from 'styled-components'

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
      parentId: this.props.data.story.id,
      userId: this.props.data.me.id
    })

    this.textarea.disabled = true
    this.submit.disabled = true
  }

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.lastCommentedStory === this.props.lastCommentedStory &&
      (nextProps.lastVotedStory === this.props.lastVotedStory ||
        nextProps.lastVotedStory.id !== this.props.data.story.id)
    ) {
      return
    }

    const { data: { me, refetch }, match: { params: { storyId } } } = this.props

    const isStoryCommentedByMe =
      nextProps.lastCommentedStory.id === storyId &&
      nextProps.lastCommentedStory.userId === me.id

    const isStoryVotedByMe =
      nextProps.lastVotedStory.id === storyId &&
      nextProps.lastVotedStory.userId === me.id

    if (isStoryCommentedByMe || isStoryVotedByMe) {
      refetch()
    }

    if (isStoryCommentedByMe) {
      this.textarea.disabled = false
      this.submit.disabled = false
      this.textarea.value = ''
    }
  }

  render() {
    const { data: { story, me } } = this.props
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

export const mapStateToProps = ({
  ui: { lastCommentedStory, lastVotedStory }
}) => ({
  lastCommentedStory,
  lastVotedStory
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      commentStory: ({ parentId, text, userId }) =>
        actions.commentStory(parentId, {
          text,
          parentId,
          userId,
          commentId: uuid.v4()
        })
    },
    dispatch
  )

export default gqlConnector(
  `
    query($id: ID!) {
      story(id: $id) {
        id
        type
        title
        text
        link
        comments {
          id
          parentId
          text
          createdAt
          createdBy
          createdByName
          level
        }
        votes
        createdAt
        createdBy
        createdByName
      }
      me {
        id
      }
    }
  `,
  {
    options: ({ match: { params: { storyId } } }) => ({
      variables: {
        id: storyId
      },
      fetchPolicy: 'network-only'
    })
  }
)(connect(mapStateToProps, mapDispatchToProps)(StoryDetails))
