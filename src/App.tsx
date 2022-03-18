import { Component, ReactElement } from 'react';
import { ApiClient } from './ApiClient';
import './App.css';
import { FakeServer } from './FakeServer';

export interface AppState { }

export class App extends Component<{}, AppState> {
  #apiClient?: ApiClient;
  #fakeServer?: FakeServer;

  componentDidMount() {
    this.#fakeServer = FakeServer.create();
    this.#apiClient = ApiClient.create('', this.#fakeServer);
    // wraps window.fetch
    this.#fakeServer.attach();
  }

  render(): ReactElement {
    return (
      <div>
        <h1>Candlepin!</h1>
      </div>
    );
  }
}

export default App;
