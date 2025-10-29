import React, { useEffect } from "react";

const VideoContainer = ({ joined, usersMap }) => {
  useEffect(() => {
    if (!joined) {
      const container = document.getElementById("video-container");
      if (container) container.innerHTML = "";
    }
  }, [joined, usersMap]);

  return <div id="video-container" className="video-container"></div>;
};

export default VideoContainer;
