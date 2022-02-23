import { Component, ReactElement } from 'react';
import ApiClient, { ClientEventData } from './ApiClient';
import './App.css';
import Game from './Game';
import Lane from './Lane';
import { Frame, Player } from './model';
import PlayerSelection from './PlayerSelection';

export interface AppState {
  started?: boolean;
  active?: boolean;
  lane?: number;
  startTime?: number;
  players?: Player[]
}

export class App extends Component<{}, AppState> {
  state: AppState = {
    started: false,
    active: false,
    lane: 0,
    startTime: 0,
    players: []
  };

  componentDidMount() {
    ApiClient.on('activate', (event: ClientEventData.Activate) => {
      this.setState({
        active: true,
        lane: event.lane,
        startTime: Date.now()
      });
    });
    ApiClient.on('update', (event: ClientEventData.Update) => {
      const frame = this.state.players?.find(({ name }) => name === event.player)?.frames[event.frame];
      Object.assign(frame, {
        complete: event.complete,
        downed: event.downed,
        mark: event.mark
      } as Frame);
      this.setState({
        players: this.state.players?.slice(0)
      });
    });
    ApiClient.on('end', () => {
      console.log('game ended');
    });
  }

  startGame(playerNames: string[]): void {
    this.setState({
      players: playerNames.map(Player.create),
      started: true
    });
    ApiClient.start(playerNames);
  }

  restart(event: MouseEvent) {
    this.setState({
      players: [],
      started: false
    });
  }

  render(): ReactElement {
    if (this.state.active) {
      return (
        <div className="App">
          { /* render the Lane metadata only when the lane is active */}
          <Lane lane={this.state.lane as number} startTime={this.state.startTime as number} />
          {this.state.started ? (
            <Game players={this.state.players as Player[]} client={ApiClient} onRestart={this.restart.bind(this)} />
          ) : (
            <PlayerSelection onPlay={this.startGame.bind(this)} />
          )}
        </div>
      );
    }

    return <div />;
  }
}

export default App;
