import React, { Component } from 'react';
import { ApiClient } from './ApiClient';
import Frame from './Frame';
import { Player } from './model';

export interface GameProps {
  players: Player[];
  client: ApiClient;
  onRestart(event: any): void;
}

export interface GameState {
  active?: Player;
}

export default class Game extends Component<GameProps> {
  state: GameState = {};

  get #gridRows(): React.ReactNode[] {
    const rows: React.ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      rows.push((
        <tr>
          <td id={`frame_${i}`}>{i}</td>
          {this.props.players.map(player => (
            <td id={`${player.name}_${i}_downed`}>
              <Frame {...player.frames[i]} />
              <span id={`${player.name}_${i}_score`}>{player.frames.slice(0, i + 1).reduce((acc, { downed }) => acc + downed, 0)}</span>
            </td>
          ))}
        </tr>
      ));
    }

    return rows;
  }

  render(): React.ReactNode {
    return (
      <table>
        <thead>
          <tr>
            <th><button onClick={this.props.onRestart}>Restart</button></th>
            {this.props.players.map(({ name }) => (<th>{name}</th>))}
          </tr>
        </thead>
        <tbody>
          {this.#gridRows}
        </tbody>
      </table>
    );
  }
}