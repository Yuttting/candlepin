import { Component, ReactElement } from 'react';
import { ApiClient } from './ApiClient';
import './App.css';
import { FakeServer } from './FakeServer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddPlayers from './AddPlayers';
import StartBolwing from './StartBolwing';

export interface AppState {}

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
      <Router>
        <Routes>
          <Route path="/" element={<AddPlayers />} />
          <Route path="/start" element={<StartBolwing />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
