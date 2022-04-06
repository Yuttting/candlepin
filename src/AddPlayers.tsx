import { useRef } from 'react';
import { Player } from './model';
import { Link } from 'react-router-dom';
import { useGlobalContext } from './context';

export interface bolwingPlayer {
  player: Player;
}

const AddPlayers = () => {
  const { players, playername, setName, setPlayers } = useGlobalContext();
  const nameValue = useRef(null);
  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (playername !== '') {
      setPlayers([...players, new Player(playername)]);
      setName('');
    } else {
      alert('Name can not be empty');
    }
  };

  const allPlayers = players.map((player: Player) => {
    return (
      <div className="col-3" key={player.name}>
        {player.name}
      </div>
    );
  });

  const startButton = (
    <Link to="/start" className="btn btn-outline-dark btn-lg">
      start
    </Link>
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <div>lane3</div>
        <div>Elapsed 00:00</div>
      </div>
      <div className="container border">
        <form onSubmit={handleSubmit}>
          <div className="input-group my-3">
            <button className="plus"></button>
            <div className="col-sm-3 inline-block">
              <input
                type="text"
                className="form-control"
                placeholder="player's name"
                onChange={handleChange}
                value={playername}
                ref={nameValue}
              />
            </div>
          </div>
        </form>
        <div className="row">{allPlayers}</div>
        <div className="d-flex justify-content-center my-5">
          {allPlayers.length > 0 && startButton}
        </div>
      </div>
    </div>
  );
};

export default AddPlayers;
