import React from "react";
import { shallow } from "enzyme";

import LoginForm from "../../client/components/LoginForm";

it("renders correctly", () => {
  const markup = shallow(
    <LoginForm title="Title" action="/auth" buttonText="login" />
  );

  expect(markup).toMatchSnapshot();
});
