import EventEmitter from './EventEmitter';
import { FakeServer, FakeServerSchema } from './FakeServer';
import { Mark } from './model';

export namespace ClientEventData {
  export interface Activate {
    lane: number;
  }

  export interface Update {
    player: string;
    frame: number;
    downed: number;
    ball: number;
    mark: Mark;
    complete: boolean;
    active: boolean;
  }
}

export interface ApiClientEventEmitter {
  on(event: 'activate', callback: (event: ClientEventData.Activate) => void): void;
  on(event: 'update', callback: (event: ClientEventData.Update) => void): void;
}

export class ApiClient extends EventEmitter implements ApiClientEventEmitter {
  #url: string = '';

  static create(url: string, fakeServer: FakeServer): ApiClient {
    return new ApiClient(url, fakeServer);
  }

  get url(): string {
    return this.#url;
  }

  set url(url: string) {
    this.#url = url;
  }

  constructor(url: string, fakeServer: FakeServer) {
    super();
    this.url = url;
    fakeServer.attach();
    fakeServer.on('activate', this.emit.bind(this, 'activate'));
    fakeServer.on('update', this.emit.bind(this, 'update'));
  }

  start(playerNames: string[]) {
    return this.#fetch('/start', { method: 'post', body: JSON.stringify({ players: playerNames } as FakeServerSchema.StartRequest) });
  }

  #fetch(url: string, ...args: any[]) {
    return window.fetch(`${this.url}/${url}`.replace(/\/+/g, '/'), ...args);
  }
}