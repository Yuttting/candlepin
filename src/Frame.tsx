import { Component, ReactElement, ReactNode } from 'react';
import { Mark } from './model';

export interface FrameProps {
  downed: number;
  ball?: number;
  complete: boolean;
  mark: Mark;
  active: boolean;
}

export default class Frame extends Component<FrameProps> {
  render(): ReactNode {
    return (
      <div className={this.props.active ? 'active' : ''}>
        <span>{this.props.downed}</span>
        {this.props.mark === 'spare' ? (
          <div className='spare'></div>
        ) : this.props.mark === 'strike' ? (
          <div className='strike'></div>
        ) : null}
      </div>
    );
  }
}