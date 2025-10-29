import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

export const useWatch = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const navigate = useNavigate();
  const state = useSelector((state) => state.data);
  const { userDetails } = useBetween(state.useShareState);

  const handleWatch = async (course) => {

    const now = new Date();
    const [year, month, day] = course.date.split("-").map(Number);
    const [hour, minute] = course.time.split(":").map(Number);
    const courseDateTime = new Date(year, month - 1, day, hour, minute);

    if (isNaN(courseDateTime.getTime())) {
      setModalMsg("Invalid course date/time");
      setShowModal(true);
      return;
    }
    if (now < courseDateTime) {
      setModalMsg(
        "The course is not available yet. Please wait until the scheduled date and time."
      );
      setShowModal(true);
      return;
    }
    const courseId = course._id;

    navigate(`/videoCall/${courseId}`, { state: { course } });

  };

  return { handleWatch, showModal, setShowModal, modalMsg, setModalMsg };
};
