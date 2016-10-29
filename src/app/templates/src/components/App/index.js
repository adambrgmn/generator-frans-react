// @flow

import React, { Component } from 'react';
import styles from './styles.scss';

type User = {
  login: string;
  avatar_url: string;
};

type Data = {
  json: () => Promise<User>;
  status: number;
  statusText: string;
}

export default class App extends Component {
  props: {};
  state: {
    user: false | User;
    input: string;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      user: false,
      input: '',
    };
  }

  onChange = ({ target }: { target: HTMLInputElement; }): void => {
    this.setState({ input: target.value });
  };

  onClick = (e: SyntheticEvent): void => {
    e.preventDefault();
    const { user, input } = this.state;
    if (!user) {
      this.getUser(input)
        .catch(() => this.setState({ user: false }));
    } else {
      this.setState({ user: false, input: '' });
    }
  };

  getUser = (username: string): Promise<void> => fetch(`https://api.github.com/users/${username}`)
    .then((data: Data) => {
      if (data.status !== 200) throw new Error(`${data.status}: ${data.statusText}`);
      return data.json();
    })
    .then((user) => this.setState({ user, input: '' }));

  renderForm(input: string): React$Element<any> {
    return (
      <form>
        <input
          type="text"
          className={styles.input}
          value={input}
          onChange={this.onChange}
        />
        <button
          type="submit"
          className={styles.button}
          onClick={this.onClick}
        >
          Search for GitHub user
        </button>
      </form>
    );
  }

  renderUser(user: User): React$Element<any> {
    return (
      <div>
        <h1 className={styles.header}>
          {user.login}
          <button onClick={this.onClick}>Clear</button>
        </h1>
        <img className={styles.image} src={user.avatar_url} alt={`Gravatar for ${user.login}`} />
        <pre className={styles.code}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    );
  }

  render() {
    const { user, input } = this.state;

    return (
      <div className={styles.container}>
        {user ? this.renderUser(user) : this.renderForm(input)}
      </div>
    );
  }
}
