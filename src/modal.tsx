import { useGlobalContext } from './context';

const Modal = () => {
  const { handleCancel } = useGlobalContext();

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <p>Are you sure that you want to restart the game?</p>
        </div>
        <div className="modal-footer justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-success">
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
