// @flow

import React, { Component } from 'react';
import styles from './styles.scss';

type User = {
  login: string;
  avatar_url: string;
};

type Fetch = {
  json: () => Promise<User>;
  status: number;
  statusText: string;
}

export default class App extends Component {
  props: {};
  state: { user: false | User; };
  input: HTMLInputElement;

  constructor(props: {}) {
    super(props);
    this.state = {
      user: false,
    };
  }

  onClick = (e: Event): void => {
    e.preventDefault();
    const { user } = this.state;

    if (!user) {
      const { value } = this.input;
      this.getUserInfo(value)
        .catch(() => this.setState({ user: false }));
    } else {
      this.setState({ user: false });
    }
  };

  getUserInfo = (username: string): Promise<void> => fetch(`https://api.github.com/users/${username}`)
    .then(({ json, status, statusText }: Fetch) => {
      if (status === 200) return json();
      throw new Error(`${status}: ${statusText}`);
    })
    .then((user) => this.setState({ user }));

  render() {
    const { user } = this.state;

    if (!user) {
      return (
        <div className={styles.container}>
          <input type="text" className={styles.input} ref={(ref) => (this.input = ref)} />
          <button
            className={styles.button}
            onClick={this.onClick}
          >
            Search for GitHub user
          </button>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <h1 className={styles.header}>
          {user.login}
          <button onClick={this.onClick}>Clear</button>
        </h1>
        <img className={styles.image} src={user.avatar_url} alt={`Gravatar for ${user.login}`} />
        <pre className={styles.code}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    );
  }
}
