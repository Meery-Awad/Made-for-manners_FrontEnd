import { Modal, Button } from "react-bootstrap";
import './ModalMessage.scss'
import { useNavigate } from "react-router-dom";
import './ModalMessage.scss'

const ModalMessage = ({ show, onClose, message, title = "Alert" }) => {
const navigate = useNavigate();
  return (
    <Modal show={show} onHide={onClose} centered className="ModalMassage">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {message =='Please log in to book and watch the videos' && <Button variant="primary" onClick={()=>navigate('/Login')}>Log in </Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMessage;
