import React from 'react'
import { shallow } from 'enzyme'

import ChildrenComments from '../../client/components/ChildrenComments'

it('ChildrenComments renders correctly', () => {
  const story = {
    id: 'story-id',
    comments: [
      {
        id: 'comment-id',
        parentId: 'story-id',
        text: 'comment',
        createdAt: new Date(0),
        createdBy: 'user-id',
        createdByName: 'SomeUser'
      },
      {
        id: 'reply-id',
        parentId: 'comment-id',
        text: 'reply',
        createdAt: new Date(0),
        createdBy: 'user-id',
        createdByName: 'SomeUser'
      }
    ]
  }

  const markup = shallow(
    <ChildrenComments
      storyId={story.id}
      parentId={story.id}
      comments={story.comments}
      level={0}
    />
  )
  expect(markup).toMatchSnapshot()
})

it('Empty renders correctly', () => {
  const story = {
    id: 'story-id',
    comments: []
  }

  const markup = shallow(
    <ChildrenComments
      storyId={story.id}
      parentId={story.id}
      comments={story.comments}
      level={0}
    />
  )
  expect(markup).toMatchSnapshot()
})
