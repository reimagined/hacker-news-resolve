import React from 'react';
import { shallow } from 'enzyme';

import Paginator from '../../client/components/Paginator';

it('Page 0 renders correctly', () => {
  const markup = shallow(<Paginator page={0} hasNext={true} location="news" />);

  expect(markup).toMatchSnapshot();
});

it('Page 1 renders correctly', () => {
  const markup = shallow(
    <Paginator page={1} hasNext={false} location="news" />
  );

  expect(markup).toMatchSnapshot();
});

it('Page 2 renders correctly', () => {
  const markup = shallow(<Paginator page={2} hasNext={true} location="news" />);

  expect(markup).toMatchSnapshot();
});

it('Page 3 renders correctly', () => {
  const markup = shallow(
    <Paginator page={3} hasNext={false} location="news" />
  );

  expect(markup).toMatchSnapshot();
});

it('Page Default renders correctly', () => {
  const markup = shallow(<Paginator hasNext={false} location="news" />);

  markup.instance().scrollUp();

  expect(markup).toMatchSnapshot();
});
