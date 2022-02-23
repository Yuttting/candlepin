import { Component, ReactElement } from 'react';
import './App.css';

export interface AppState { }

export class App extends Component<{}, AppState> {
  render(): ReactElement {
    return (
      <div>
        <h1>Candlepin!</h1>
      </div>
    );
  }
}

export default App;
