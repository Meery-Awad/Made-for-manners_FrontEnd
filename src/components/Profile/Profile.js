import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import ProfileModal from "./ProfileModal";
import { useWatch } from "../Courses/Watch";
import ModalMessage from "../Courses/AlertModal/ModalMessage";
import CourseDetailsModal from '../Courses/CourseDetailsModal';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Profile = () => {
  const state = useSelector((state) => state.data);

  const { userDetails, setUserDetails, showDetails, setShowDetails, selectedCourse, setSelectedCourse,
    serverUrl, courseValid, setUpdatedData, setLoading, websiteTitle , pageDescription } = useBetween(state.useShareState);
  const { name, img, courses, email } = userDetails;
  const [watchedCourseLeng, setWatchedCourseLeng] = useState(0);
  const [bookedCourseLeng, setBookedCourseLeng] = useState(0)

  const [activeTab, setActiveTab] = useState("watched");
  const [watchedCourses, setWatchedCourses] = useState([]);
  const [bookingCourses, setBookingCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { handleWatch, showModal, setShowModal, modalMsg } = useWatch();
  const navigate = useNavigate();


  const closeDetails = () => {
    setSelectedCourse(null);
    setShowDetails(false);
  };

  useEffect(() => {
    if (courses && courses.length > 0) {
      const watched = courses.filter((course) => course.status === "watched" && course.link);
      setWatchedCourses(watched);
      setBookingCourses(courses);
    }
  }, [userDetails]);

  useEffect(() => {
    if (watchedCourses) {
      setWatchedCourseLeng([...new Map(watchedCourses.map((c) => [c._id, c])).values()].length);
    }
  }, [watchedCourses]);

  useEffect(() => {
    if (bookingCourses) {
      setBookedCourseLeng([...new Map(bookingCourses.map((c) => [c._id, c])).values()].length);
    }
  }, [bookingCourses]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderVideos = (coursesArray) => {
    const uniqueCourses = [...new Map(coursesArray.map((c) => [c._id, c])).values()];
    return (
      <div className="VideosGrid">
        {uniqueCourses.length ? (
          uniqueCourses.map((courseItem) => (
            <div key={courseItem._id} className="VideoCard"
              onClick={() => { setSelectedCourse(courseItem); setShowDetails(true) }}>
              <img src={courseItem.img} alt={courseItem.name} />
              <h3>{courseItem.name}</h3>
            </div>
          ))
        ) : (
          <div className="NoCourses">No Courses Yet!!</div>
        )}
      </div>
    );
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${serverUrl}/api/users/deleteUser/${userDetails.id}`);
      setTimeout(() => {
        setUserDetails({
          id: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          img: '',
          courses: [],
        });

        localStorage.removeItem("user");
        navigate('/');
        setLoading(false);
      })
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting account");
      setLoading(false);
    }
  };

  return (
    <div className="ProfilePage">

      <Helmet>
        <title>Profile | {websiteTitle}</title>
        <link rel="canonical" href="https://madeformanners.com/profile" />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="profile page" />
        <meta property="og:title" content={`Profile - ${websiteTitle}`} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <div className="ProfileHeader">
        <img src={img} alt="Profile" />
        <div className="info">
          <h2>{name}</h2>
          <i>{email}</i>
        </div>
        <button className="edit-btn" onClick={() => setModalOpen(true)}>
          <i className="fas fa-pen"></i>
        </button>
        <button className="delete-btn" onClick={() => setDeleteModal(true)}>
          <i className="fas fa-trash" style={{ color: 'rgb(243, 98, 98)' }}></i>
        </button>
      </div>

      <div className="TabsList">
        <button
          className={activeTab === "watched" ? "active" : ""}
          onClick={() => setActiveTab("watched")}
        >
          <i className="fas fa-check"></i> Videos to watch({watchedCourseLeng})
        </button>
        <button
          className={activeTab === "registered" ? "active" : ""}
          onClick={() => setActiveTab("registered")}
        >
          <i className="fas fa-hourglass-half"></i> Booked Videos ({bookedCourseLeng})
        </button>
      </div>

      <p className='courseValid' style={{ color: 'rgb(243, 98, 98)' }}>{courseValid}</p>
      {activeTab === "watched" && renderVideos(watchedCourses)}
      {activeTab === "registered" && renderVideos(bookingCourses)}

      <ProfileModal
        show={modalOpen}
        handleClose={() => setModalOpen(false)}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        setUpdatedData={setUpdatedData}
      />

      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMsg}
        title="Course Notice"
      />

      <CourseDetailsModal
        show={showDetails}
        onClose={closeDetails}
        course={selectedCourse}
        userDetails={userDetails}
        onWatch={() => handleWatch(selectedCourse)}
      />

      {/* Delete Account Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
