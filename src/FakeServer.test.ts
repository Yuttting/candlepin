import { ClientEventData } from './ApiClient';
import { FakeServer } from './FakeServer';
import { Frame } from './model';

describe('Fake Server', () => {
  const server = new FakeServer();
  const updates: ClientEventData.Update[] = [];
  server.on('update', (event: ClientEventData.Update) => updates.push(event));
  it('should track a whole game', async () => {
    await server.fetch('/start', { body: JSON.stringify({ players: ['Jessica', 'Chris'] }) });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 2 }) });
    // frame 1
    expect(updates.shift()).toEqual({
      ball: 1,
      frame: 0,
      complete: false,
      active: true,
      downed: 2,
      mark: null,
      player: 'Jessica'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 5 }) });
    expect(updates.shift()).toEqual({
      ball: 2,
      frame: 0,
      complete: false,
      active: true,
      downed: 7,
      mark: null,
      player: 'Jessica'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 0 }) });
    expect(updates.shift()).toEqual({
      ball: 3,
      frame: 0,
      complete: true,
      active: false,
      downed: 7,
      mark: null,
      player: 'Jessica'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 6 }) });
    expect(updates.shift()).toEqual({
      ball: 1,
      frame: 0,
      complete: false,
      active: true,
      downed: 6,
      mark: null,
      player: 'Chris'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 4 }) });
    expect(updates.shift()).toEqual({
      ball: 2,
      frame: 0,
      complete: true,
      active: false,
      downed: 10,
      mark: 'spare',
      player: 'Chris'
    });
    // frame 2
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 10 }) });
    expect(updates.shift()).toEqual({
      ball: 1,
      frame: 1,
      complete: true,
      active: false,
      downed: 10,
      mark: 'strike',
      player: 'Jessica'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 4 }) });
    expect(updates.shift()).toEqual({
      ball: 1,
      frame: 1,
      complete: false,
      active: true,
      downed: 4,
      mark: null,
      player: 'Chris'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 4 }) });
    expect(updates.shift()).toEqual({
      ball: 2,
      frame: 1,
      complete: false,
      active: true,
      downed: 8,
      mark: null,
      player: 'Chris'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 1 }) });
    expect(updates.shift()).toEqual({
      ball: 3,
      frame: 1,
      complete: true,
      active: false,
      downed: 9,
      mark: null,
      player: 'Chris'
    });
    // frame 3
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 7 }) });
    expect(updates.shift()).toEqual({
      ball: 1,
      frame: 2,
      complete: false,
      active: true,
      downed: 7,
      mark: null,
      player: 'Jessica'
    });
    await server.fetch('/game/active/roll', { body: JSON.stringify({ downed: 3 }) });
    expect(updates.shift()).toEqual({
      ball: 2,
      frame: 2,
      complete: true,
      active: false,
      downed: 10,
      mark: 'spare',
      player: 'Jessica'
    });
  });
});
