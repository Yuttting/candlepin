import { ReactElement, useRef } from 'react';

export interface PlayerSelectionProps {
  onPlay(players: string[]): void;
}

export default function PlayerSelection({ onPlay }: PlayerSelectionProps): ReactElement {
  const formRef = useRef<HTMLFormElement>() as {
    current: HTMLFormElement & {
      elements: HTMLFormControlsCollection
    }
  };

  function start(): void {
    if (typeof onPlay === 'function') {
      const names = [];
      for (const input of formRef.current.elements as HTMLCollectionOf<HTMLInputElement>) {
        names.push(input.value);
      }
      onPlay(names.filter(name => !!name));
    }
  }

  return (
    <div>
      <form ref={formRef} onSubmit={(event) => event.preventDefault()}>
        <input type="text" name="player" />
        <input type="text" name="player2" />
        <input type="text" name="player3" />
        <input type="text" name="player4" />
        <input type="text" name="player5" />
        <input type="text" name="player6" />
        <input type="text" name="player7" />
        <input type="text" name="player8" />
        <button type="submit" onClick={start}>Start</button>
      </form>
    </div>
  );
}