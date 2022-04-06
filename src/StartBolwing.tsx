import { useGlobalContext } from './context';
import { Player } from './model';
import Modal from './modal';

const StartBolwing = () => {
  const { players, showModal, setShowModal } = useGlobalContext();

  const allPlayers = players.map((player: Player) => {
    return (
      <th scope="col" key={player.name}>
        {player.name}
      </th>
    );
  });

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <div>lane3</div>
        <div>Elapsed 00:00</div>
      </div>
      <div className="container border">
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">
                  <button type="button" onClick={() => setShowModal(true)}>
                    &#x21bb;
                  </button>
                </th>
                {allPlayers}
              </tr>
            </thead>
          </table>
          {showModal && <Modal />}
        </div>
      </div>
    </div>
  );
};

export default StartBolwing;
