import { ClientEventData } from './ApiClient';
import EventEmitter from './EventEmitter';
import { Player } from './model';

export namespace FakeServerSchema {
  export interface StartRequest {
    players: string[]
  };

  export interface RollRequest {
    downed: number
  }

  export interface SubscribeRequest {
    event: 'string';
    callback: Function;
  }

  export interface ActivateRequest {
    lane: number;
  }

  export interface StartResponse {
    status: 204 | 500
  }
}

/** Sets up a fake server which takes over the window.fetch to handle requests */
export class FakeServer extends EventEmitter {
  #players: Player[] = [];
  #active: Player = {} as Player;
  #ball = 0;
  #frame = 1;
  #origFetch = window.fetch;

  static create(): FakeServer {
    return new FakeServer();
  }

  fetch(url: string, opts: { body: string, method?: 'post' | 'get' | 'patch' }): Promise<Response> {
    if (url === '/start') {
      this.#players = (JSON.parse(opts.body) as FakeServerSchema.StartRequest).players.map(Player.create);
      this.#start();
      return Promise.resolve(new Response(null, {
        status: 204
      }));
    } else if (url === '/reset') {
      this.#start();
      return Promise.resolve(new Response(null, {
        status: 204
      }));
    } else if (url === '/game/active/roll') {
      return this.#roll(JSON.parse(opts.body) as FakeServerSchema.RollRequest);
    } else if (url === '/game/subscribe') {
      const { event, callback } = (JSON.parse(opts.body) as FakeServerSchema.SubscribeRequest);
      this.on(event, callback);
      return Promise.resolve(new Response(null, { status: 204 }));
    } else if (url === '/lane/activate') {
      this.emit('activate', { lane: (JSON.parse(opts.body) as FakeServerSchema.ActivateRequest).lane });
      return Promise.resolve(new Response(null, { status: 204 }));
    } else {
      return Promise.reject(new Response('Not Found', {
        status: 404
      }));
    }
  }

  #start() {
    this.#ball = 0;
    this.#frame = 0;
    this.#active = this.#players[0];
    this.#players.forEach(player => player.frames.forEach(frame => frame.reset()));
    this.#active.frames[0].active = true;
  }

  #roll(request: FakeServerSchema.RollRequest): Promise<Response> {
    console.log(this.#active);
    const frame = this.#active.frames[this.#frame];
    frame.downed += (request as FakeServerSchema.RollRequest).downed;
    frame.ball = ++this.#ball;
    console.log('ball', this.#ball);
    if (frame.ball === 3 || frame.downed >= 10) {
      frame.downed = frame.downed > 10 ? 10 : frame.downed;
      frame.complete = true;
      frame.active = false;
      frame.mark = frame.downed >= 10 ? (this.#ball === 1 ? 'strike' : this.#ball === 2 ? 'spare' : null) : null;
      // emit the completed frame
      this.emit('update', {
        player: this.#active.name,
        frame: this.#frame,
        downed: frame.downed,
        ball: this.#ball,
        complete: frame.complete,
        active: frame.active,
        mark: frame.mark
      } as ClientEventData.Update);
      // move to the next player
      const index = this.#players.indexOf(this.#active);
      if (index === this.#players.length - 1) {
        // set to first player
        this.#active = this.#players[0];
        // progress frame
        this.#frame++;
        if (this.#frame > 9) {
          this.emit('end');
        }
      } else {
        this.#active = this.#players[index + 1];
      }

      this.#ball = 0;
      this.#active.frames[this.#frame].active = true;
      this.#active.frames[this.#frame].complete = false;
    } else {
      this.emit('update', {
        player: this.#active.name,
        frame: this.#frame,
        downed: frame.downed,
        ball: this.#ball,
        complete: frame.complete,
        active: frame.active,
        mark: frame.mark
      } as ClientEventData.Update);
    }

    return Promise.resolve(new Response(null, { status: 204 }));
  }

  attach() {
    /** @ts-ignore */
    window.fetch = this.fetch.bind(this);
  }

  detach() {
    window.fetch = this.#origFetch;
  }
}