import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import axios from "axios";
import "./CoursesCont.scss";
import Delete from "./Delete";
import { useWatch } from "./Watch";
import ModalMessage from "./AlertModal/ModalMessage";
import CourseDetailsModal from "./CourseDetailsModal";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import BookedUsersModal from "./bookedUserModal";


const CoursesContaner = ({ type = "all" }) => {

  const state = useSelector((state) => state.data);
  const {
    courses,
    userDetails,
    admin,
    setCourseDetails,
    setEditOrAdd,
    reload,
    setReload,
    setLoading, showDetails, setShowDetails, selectedCourse, setSelectedCourse,
    serverUrl, pageDescription, pageKeywords, coursesKeyWords,
    websiteTitle
  } = useBetween(state.useShareState);

  const [showBookedUsers, setShowBookedUsers] = useState(false);
  const [bookedUsersList, setBookedUsersList] = useState([]);

  const openBookedUsers = (users) => {
    setBookedUsersList(users);
    setShowBookedUsers(true);
  };

  const closeBookedUsers = () => setShowBookedUsers(false);

  const [indexDelete, setIndexDelete] = useState(-1);
  const { handleWatch, showModal, setShowModal, modalMsg, modalTitle, setModalMsg } = useWatch();
  useEffect(() => {

    window.scrollTo(0, 0);
  }, []);
  const location = useLocation();

  const openDetails = (course) => {

    setSelectedCourse(course);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedCourse(null);
    setShowDetails(false);
  };

  const deleteCourse = (index) => {
    setLoading(true);
    const CourseToDelete = courses[index]._id;
    axios
      .delete(`${serverUrl}/api/courses/${CourseToDelete}`)
      .then(() => {
        setReload(!reload);
        setLoading(false);
      })
      .catch((error) => {
        alert(" Error while deleting the course, please try again.");
      });
  };

  const editCourse = (index) => {
    const CourseToEdit = courses[index];
    if (CourseToEdit) {
      setEditOrAdd("Edit");
      setCourseDetails({ ...CourseToEdit, id: CourseToEdit._id });
    }
  };


  const handleCheckout = async (courseName, price, courseId) => {

    if (!userDetails.id) {
      setModalMsg('Please log in to book and watch the videos')
      setShowModal(true);
      return;

    }

    try {
      const res = await axios.post(`${serverUrl}/api/payments/create-checkout-session`, {
        courseName,
        price,
        courseId,
        userName: userDetails.name
      });

      window.location.href = res.data.url;
    } catch (err) {

      alert("Error creating checkout session please try again");
    }

  };

  const playCoursesList = () => {

    const displayedCourses =
      type === "recommended"
        ? courses.filter((course) => course.recommended)
        : courses;
    if (displayedCourses.length === 0) return <p className="NoCourses"> No {type == "recommended" ? 'recommended' : ''} courses available.`</p>;

    return displayedCourses.map((item, index) => {

      const isAlreadyBooked = userDetails.courses.some((c) => c._id === item._id);
      const uniqueUsers = item.bookedUsers
        ? item.bookedUsers.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.email === user.email)
        )
        : [];
      return (
        <div
          className="CourseItem"
          key={item._id || index}
          onClick={() => openDetails(item)}
          style={{ cursor: "pointer" }}
        >
          <div className="imageWrapper">
            <img src={item.img} alt="Course" />
            <span className="particNum"
              style={{ background: userDetails.email == admin.email ? '#C6A662' : '#ACABAD' }}
              onClick={(e) => {
                if (userDetails.email == admin.email) {
                  e.stopPropagation();
                  openBookedUsers(item.bookedUsers);
                }

              }}>
              <i className="fas fa-user"></i> {uniqueUsers.length}
            </span>
          </div>
          <div className="details">
            <div className="bottomRow">
              <div className="price">{item.price} £ {item.price==0 && <p> (Free)</p>}</div> 
              {userDetails.email === admin.email && type !== "recommended" && (
                <div
                  className="icons "
                  onClick={(e) => e.stopPropagation()}
                >

                  <i
                    className="fas fa-edit"
                    onClick={() => editCourse(index)}
                    title="Edit"
                  ></i>
                  <i
                    className="fas fa-trash"
                    onClick={() => setIndexDelete(index)}
                    title="Delete"
                  ></i>
                </div>
              )}
            </div>
            <div className="name">{item.name}</div>
            <div className="date">
              <span><i className="fas fa-calendar-alt"></i>{" "}{item.date} </span>
              <span ><i className="fas fa-clock"></i> {" "} {`(${item.time}) - (${item.endtime})`}</span>

            </div>
            <div className="description">{item.description}</div>

            {isAlreadyBooked || userDetails.email == admin.email ? (
              <button
                className="courseBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  const now = new Date();

                  const courseDate = new Date(item.date);

                  const [endHour, endMinute] = item.endtime.split(":");
                  const endDateTime = new Date(courseDate);
                  endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

                  if (now > endDateTime) {
                    openDetails(item);


                  } else {
                    handleWatch(item);
                  }

                }}
              >
                Join
              </button>
            ) : (
              <button
                className="courseBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout(item.name, item.price, item._id);
                }}
              >
                Book
              </button>
            )}
          </div>
        </div>
      );
    });
  };
  return (
    <div className="itemsContaner">
      {location.pathname === "/courses" && (
        <Helmet>
          <link rel="canonical" href="https://madeformanners.com/courses" />
          <title>Courses | {websiteTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={`${pageKeywords} ${coursesKeyWords} `} />
          <meta property="og:title" content={`Courses - ${websiteTitle}`} />
          <meta property="og:description" content={pageDescription} />
        </Helmet>)}

      <div className="mainContaner">
        {Array.isArray(courses) ? (
          playCoursesList()
        ) : (
          <p className="NoCourses">Loading...</p>
        )}
      </div>

      <Delete index={indexDelete} setIndexDelete={setIndexDelete} onDelete={deleteCourse} />

      <ModalMessage
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMsg}
        title={modalTitle}
      />

      <CourseDetailsModal
        show={showDetails}
        onClose={closeDetails}
        course={selectedCourse}
        userDetails={userDetails}
        onBook={handleCheckout}
        onWatch={handleWatch}
      />
      <BookedUsersModal
        show={showBookedUsers}
        onClose={closeBookedUsers}
        users={bookedUsersList}
        userDetails={userDetails}
        admin={admin}
      />
    </div>

  );
};
export default CoursesContaner;
