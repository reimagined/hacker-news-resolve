import React from 'react';
import { shallow } from 'enzyme';

import Comment from '../../client/components/Comment';

it('Comment Level 0 renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={0}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );

  expect(markup).toMatchSnapshot();
});

it('Comment Level 1 renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={1}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );

  expect(markup).toMatchSnapshot();
});

it('Comment Level 20 renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={20}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );

  expect(markup).toMatchSnapshot();
});

it('Comment Level 20 renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={20}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );

  expect(markup).toMatchSnapshot();
});

it('Comment with state.expanded=false renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={1}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );
  markup.instance().expand();

  expect(markup).toMatchSnapshot();
});

it('Comment without childrens renders correctly', () => {
  const markup = shallow(
    <Comment
      id="SomeId"
      level={1}
      content="SomeContent"
      user="SomeUser"
      date={new Date(0)}
      showReply={true}
      parent="news"
      root={{ id: 'SomeId', title: 'SomeTitle' }}
    />
  );

  expect(markup).toMatchSnapshot();
});
