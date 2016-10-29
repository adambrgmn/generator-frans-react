import test from 'blue-tape';
import React from 'react';
import { shallow } from 'enzyme';

import App from '../../src/components/App';
import styles from '../../src/components/App/styles.scss';

test('Component: <App />', (t) => {
  const wrapper = shallow(<App />);

  {
    const should = 'Should initially render an .input-tag';
    const actual = wrapper.find(`.${styles.input}`).length;
    const expected = 1;

    t.equal(actual, expected, should);
  }

  return wrapper.instance().getUser('octocat')
    .then(() => {
      const should = 'Should update state after fetching user';
      const actual = wrapper.update().state().user.login;
      const expected = 'octocat';

      return t.equal(actual, expected, should);
    })
    .then(() => {
      const should = 'Should render user info after fetching user';
      const actual = wrapper.find(`.${styles.header}`).length;
      const expected = 1;

      return t.equal(actual, expected, should);
    })
    .catch(t.end);
});
