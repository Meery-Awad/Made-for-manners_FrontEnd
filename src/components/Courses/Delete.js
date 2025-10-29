import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Delete = ({ index, setIndexDelete, onDelete , text }) => {
  const state = useSelector((state) => state.data);

  const { } = useBetween(state.useShareState);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (index !== -1) {
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  }, [index]);

  return (
    <div className="Delete">
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} className="Model">
        <Modal.Body>
          <div>
            Are you sure you want to delete this task?
          </div>
        </Modal.Body>

        <Modal.Footer dir="auto">
          <Button
            onClick={() => { onDelete(index); setIndexDelete(-1); }}
          >
            Delete
          </Button>

          <Button
            variant="secondary"
            className="btn btn-calendar-modal-cancel"
            onClick={() => { setModalIsOpen(false); setIndexDelete(-1); }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Delete;
