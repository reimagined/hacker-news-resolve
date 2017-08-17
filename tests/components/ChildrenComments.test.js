import React from 'react';
import { shallow } from 'enzyme';

import ChildrenComments, {
  getChilrenCallback
} from '../../client/components/ChildrenComments';

it('renders correctly', () => {
  const markup = shallow(
    <div>
      {ChildrenComments(
        { replies: ['replyId'], level: 10 },
        {
          replyId: {
            id: 'SomeId',
            text: 'SomeText',
            replies: [],
            createdAt: new Date(0),
            createdBy: 'SomeUser'
          }
        },
        {
          SomeUser: {
            name: 'SomeUser'
          }
        }
      )}
    </div>
  );
  getChilrenCallback(
    {
      replyId: {
        id: 'SomeId',
        text: 'SomeText',
        replies: [],
        createdAt: new Date(0),
        createdBy: 'SomeUser'
      }
    },
    {
      SomeUser: {
        name: 'SomeUser'
      }
    }
  )({ replies: ['replyId'], level: 10 });

  expect(markup).toMatchSnapshot();
});
