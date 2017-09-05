import React from 'react';
import { shallow } from 'enzyme';

import ChildrenComments from '../../client/components/ChildrenComments';

it('renders correctly', () => {
  const comments = {
    replyId: {
      id: 'SomeId',
      text: 'SomeText',
      replies: [],
      createdAt: new Date(0),
      createdBy: 'SomeUser'
    }
  };
  const users = {
    SomeUser: {
      name: 'SomeUser'
    }
  };

  const markup = shallow(
    <div>
      <ChildrenComments
        replies={['replyId']}
        level={10}
        comments={comments}
        users={users}
      />
    </div>
  );
  expect(markup).toMatchSnapshot();
});
