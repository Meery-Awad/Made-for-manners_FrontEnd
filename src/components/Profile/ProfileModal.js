import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./ProfileModal.scss";
import axios from "axios";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

const ProfileModal = ({ show, handleClose, userDetails, setUserDetails }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('')
  const state = useSelector((state) => state.data);
  const { serverUrl, setLoading } = useBetween(state.useShareState);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        id: userDetails.id || userDetails._id || "",
        name: userDetails.name || "",
        email: userDetails.email || "",
        password: userDetails.password || "",
        confirmPassword: userDetails.password || "",
        img: userDetails.img || "",
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    setError('')
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${serverUrl}/api/users/${formData.id}`,
        formData
      );
      setUserDetails(res.data.user);
      handleClose();
      setLoading(false);
    } catch (err) {

      setError(err.response?.data?.message)
      setLoading(false);
    }

  };

  return (
    <Modal show={show} onHide={handleClose} className="ProfileModal" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error != '' && <p className="noti">{error}</p>}
        <div className="form-group mb-2">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Password */}
        <div className="form-group mb-2 position-relative">
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          <i
            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"
              } eye-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-2 position-relative">
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
          />
          <i
            className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              } eye-icon`}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          ></i>
        </div>

        <div className="form-group mb-2">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>
        {formData.img && (
          <img
            src={formData.img}
            alt="Preview"
            className="img-preview mt-2"
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
