import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const BookedUsersModal = ({ show, onClose, users, userDetails, admin }) => {
  const userEmail = userDetails?.email;
  const adminEmail = admin?.email;
  if (userEmail !== adminEmail) return null;


  const uniqueUsers = users
    ? users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.email === user.email)
    )
    : [];

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Booked Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {uniqueUsers.length > 0 ? (
          <ul className="booked-users-list">
            {uniqueUsers.filter((user) => user.email !== admin.email).map((user, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
    
                <img
                  src={user.img}
                  alt={user.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span>{user.name || user.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users have booked this course yet.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookedUsersModal;
