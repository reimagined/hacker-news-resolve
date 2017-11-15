import React from 'react'
import { shallow } from 'enzyme'

import Stories from '../../../client/components/Stories'

it('Stories first page renders correctly', () => {
  const items = [
    {
      id: 'story-id',
      type: 'story',
      title: 'title',
      link: 'https://google.com',
      commentCount: 0,
      votes: [],
      createdAt: new Date(0),
      createdBy: 'user-id',
      createdByName: 'user'
    }
  ]
  const wrapper = shallow(<Stories items={items} type={'story'} />)

  expect(wrapper).toMatchSnapshot()
})

it('Stories second page renders correctly', () => {
  const stories = []
  for (let i = 0; i < 50; i++) {
    stories.push({
      id: 'story-id' + i,
      type: 'story',
      title: 'title' + i,
      link: 'https://google.com',
      commentCount: 0,
      votes: [],
      createdAt: new Date(0),
      createdBy: 'user-id',
      createdByName: 'user'
    })
  }
  const wrapper = shallow(<Stories items={stories} page={2} type={'story'} />)

  expect(wrapper).toMatchSnapshot()
})

it('Stories page renders with error', () => {
  const stories = []

  const wrapper = shallow(
    <Stories items={stories} page="text" type={'story'} />
  )

  expect(wrapper).toMatchSnapshot()
})

it('Stories calls refresh on lastVotedStory change', () => {
  let callCount = 0
  const refetch = () => {
    callCount++
  }

  const wrapper = shallow(
    <Stories lastVotedStory={{}} items={[]} refetch={refetch} />
  )

  expect(callCount).toEqual(0)

  wrapper.setProps({ lastVotedStory: {} })
  expect(callCount).toEqual(1)
})

it('Stories does not call refresh if the lastVotedStory is not changed', () => {
  let callCount = 0
  const refetch = () => {
    callCount++
  }
  const lastVotedStory = {}

  const wrapper = shallow(
    <Stories lastVotedStory={lastVotedStory} items={[]} refetch={refetch} />
  )

  wrapper.setProps({ lastVotedStory })
  expect(callCount).toEqual(0)
})
