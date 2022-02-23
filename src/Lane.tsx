import { ReactElement, useState } from 'react';

export interface LaneProps {
  lane: number;
  startTime: number;
}

export default function Lane({ lane, startTime }: LaneProps): ReactElement {
  const [elapsed, setElapsed] = useState(0);
  setInterval(() => {
    setElapsed(Math.round((Date.now() - startTime) / 1000 / 60));
  }, 60 * 1000);
  return (
    <div>
      Lane: {lane}
      Elapsed: {elapsed}
    </div>
  );
}