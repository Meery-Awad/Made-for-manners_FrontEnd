import React, { useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import JoinLeaveButtons from "./JoinLeaveButtons";
import "./VideoCallPage.scss";
import { useLocation } from "react-router-dom";
import { useBetween } from "use-between";
import { useSelector } from "react-redux";

const VideoCallPage = () => {
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, admin } = useBetween(state.useShareState);
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const location = useLocation();
  const course = location.state?.course;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="VideoCall">
      <div className="recommended">
        <p className="topic">Video Call - {course.name}</p>
        <div className="line-container">
          <span className="line"></span>
          <i className="fas fa-video"></i>
        </div>
      </div>

      <JoinLeaveButtons
        joined={joined}
        setJoined={setJoined}
        localTracks={localTracks}
        setLocalTracks={setLocalTracks}
        course={course}
        userDetails={userDetails}
        admin={admin}
        usersMap={usersMap}
        setUsersMap={setUsersMap}
        setUserDetails={setUserDetails}
      />

      <VideoContainer
        joined={joined}
        usersMap={usersMap}
        localTracks={localTracks}
        course={course}
        admin={admin}
      />
    </div>

  );
};

export default VideoCallPage;
