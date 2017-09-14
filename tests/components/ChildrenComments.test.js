import React from 'react'
import { shallow } from 'enzyme'

import ChildrenComments from '../../client/components/ChildrenComments'

it('renders correctly', () => {
  const comments = [
    {
      id: 'SomeId',
      text: 'SomeText',
      createdAt: new Date(0),
      createdBy: 'SomeUser'
    }
  ]

  const markup = shallow(
    <div>
      <ChildrenComments
        comments={comments}
        parentId={comments[0].id}
        level={10}
      />
    </div>
  )
  expect(markup).toMatchSnapshot()
})
