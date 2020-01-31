import React from 'react';
import { BrowserRouter as Router} from "react-router-dom";

import ReactDOM from 'react-dom';
import { render } from 'react-testing-library';
import Header from '../Header';

it('renders Header without crashing', () => {
  const div = document.createElement('div');
  let TEST_USERNAME = "testusername"
  
  const {queryByText} = render(
    <Router>
      <Header username={TEST_USERNAME} />
    </Router>,
    div
  );

  expect(queryByText(TEST_USERNAME)).toBeInstanceOf(HTMLElement);
  expect(queryByText("Contact")).toBeInstanceOf(HTMLElement);

  ReactDOM.unmountComponentAtNode(div);
});
