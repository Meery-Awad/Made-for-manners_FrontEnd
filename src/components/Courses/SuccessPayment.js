import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import { useNavigate } from "react-router-dom";
import "./SuccessPayment.scss";

const SuccessPayment = () => {
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, courseValid, reload, setReload, serverUrl, setLoading } = useBetween(state.useShareState);
  const navigate = useNavigate();
  const addedRef = useRef(false);
  const [course, setCourse] = useState({});

  useEffect(() => {
    setLoading(true)
    const addCourse = async () => {
      if (addedRef.current) return;

      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get("courseId");

      if (!courseId || !userDetails.id) return;

      const isAlreadyBooked = userDetails.courses.some(c => c._id === courseId);
      if (isAlreadyBooked) return;

      try {

        const response = await axios.post(
          `${serverUrl}/api/payments/UserCoursesStatus`,
          { userId: userDetails.id, courseId, userImg: userDetails.img, key: "1" }
        );

        const { course1 } = response.data;

        if (course1) {
          setUserDetails(prev => ({
            ...prev,
            courses: [...prev.courses, { ...course1, status: "booking" }]
          }));

          const courseDay = new Date(course1.date);
          const sevenDaysLater = new Date(courseDay);
          sevenDaysLater.setDate(courseDay.getDate() + 7);

          const day = sevenDaysLater.getDate();
          const month = sevenDaysLater.getMonth() + 1;
          const year = sevenDaysLater.getFullYear();

          const formattedDate = `${year}-${month}-${day}`;
          const courseWithValidDate = { ...course1, ValidDate: formattedDate };
          setCourse(courseWithValidDate);

          // تخزين البيانات مؤقتًا قبل الريلود
          sessionStorage.setItem(
            "recentCourse",
            JSON.stringify({
              name: course1.name,
              date: course1.date,
              ValidDate: sevenDaysLater
            })
          );

          addedRef.current = true;
          setReload(!reload)
          if(course.ValidDate)
          setLoading(false)

        }
      } catch (err) {

        alert(" Error adding course, please try again");
      }
    };

    addCourse();
  }, [userDetails.id, userDetails.courses, setUserDetails]);


  useEffect(() => {
    const savedCourse = sessionStorage.getItem("recentCourse");
    if (savedCourse) {
      setCourse(JSON.parse(savedCourse));
    }
  }, []);


  const handleNavigation = (path) => {
    sessionStorage.removeItem("recentCourse");
    navigate(path);
  };

  return (
    <>
      {course.ValidDate && <div className="successCont">
         <div className="card simple">
        <h2>✅ Payment Successful</h2>
        <p>Your course has been added with booking status!</p>
        {course.date && course.ValidDate && (
          <p style={{ color: "rgb(243, 98, 98)" }}>
            {`${courseValid || course.name} (${course.date}) - (${course.ValidDate})`}
          </p>
        )}
        <div className="buttons">
          <button className="backBtn" onClick={() => handleNavigation("/Courses")}>
            Back to Courses
          </button>
          <button className="backBtn" onClick={() => handleNavigation("/Profile")}>
            Go to Profile
          </button>
        </div>
        </div>
      </div>
      }
    </>
  );
};

export default SuccessPayment;
