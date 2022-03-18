import { useState } from 'react';
import { ClientEventData } from './ApiClient';
import { FakeServerSchema } from './FakeServer';

export interface Forms extends HTMLCollectionOf<HTMLFormElement> {
  lane: HTMLFormElement & {
    elements: HTMLFormControlsCollection & {
      laneNumber: HTMLInputElement
    }
  },
  downed: HTMLFormElement & {
    elements: HTMLFormControlsCollection & {
      downed: HTMLInputElement
    }
  }
}

export default function DevTool() {
  const [minimized, setMinimized] = useState(false);

  function activate() {
    window.fetch('/lane/activate', {
      body: JSON.stringify({
        lane: Number((document.forms as Forms).lane.elements.laneNumber.value)
      } as ClientEventData.Activate)
    });
  }

  function roll() {
    window.fetch('/game/active/roll', {
      method: 'patch',
      body: JSON.stringify({
        downed: Number((document.forms as Forms).downed.elements.downed.value)
      } as FakeServerSchema.RollRequest)
    });
  }

  return (
    <div className={`dev-tool ${minimized ? 'minimized' : ''}`}>
      <button onClick={() => setMinimized(!minimized)} type="button" className="minimize">(Min|Max)imize</button>
      <h5>DevTool</h5>
      This is a tool to "test" the application. Start by:
      <ol>
        <li>
          "activating" a lane
        </li>
        <li>
          Add players to the game
        </li>
        <li>
          Start the game
        </li>
        <li>
          "Roll" for each player. Once a frame is "done", then the it'll be the next player's turn. A frame
          is considered "done" when a player: rolls 3 balls or gets a total score of 10 for the frame.
        </li>
      </ol>
      <details open>
        <summary>
          <h6>Lane</h6>
        </summary>
        <form name="lane">
          <input type="number" name="laneNumber" />
          <button type="button" onClick={activate}>Activate Lane</button>
        </form>
      </details>
      <details open>
        <summary>
          <h6>Player</h6>
        </summary>
        <form name="downed">
          <label htmlFor="downed"></label>
          <input type="number" id="downed" min={0} max={10} />
          <button type="button" onClick={roll}>Send Roll</button>
        </form>
      </details>
    </div>
  );
}