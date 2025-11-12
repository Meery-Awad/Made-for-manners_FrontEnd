import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useEffect } from "react";

export const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const updateStatusIcons = (uid, type, enabled) => {
  const el = document.getElementById(`${uid}-${type}`);
  if (el) {
    if (type === "audio") el.className = enabled ? "fa fa-microphone" : "fa fa-microphone-slash";
    if (type === "video") el.className = enabled ? "fa fa-video" : "fa fa-video-slash";
  }
};

// ======================
// Hamburger Control
// ======================
export const initAdminControls = (userDetails) => {
  let hamburger = document.getElementById("admin-hamburger");
  if (!hamburger) {
    hamburger = document.createElement("button");
    hamburger.id = "admin-hamburger";
    hamburger.innerHTML = "<";
    document.body.append(hamburger);
  }

  let menu = document.getElementById("admin-menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "admin-menu";
    menu.style.display = "none";
    menu.style.zIndex = "1000";
    document.body.append(menu);
  }

  const currentUseremail = userDetails.email;

  hamburger.onclick = () => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
    if (typeof window.renderAdminMenu === "function") {
      window.renderAdminMenu(window.globalUsersMap || {});
    }
  };

  window.renderAdminMenu = (usersMap) => {
    window.globalUsersMap = usersMap;
    menu.innerHTML = "";
    const info = document.createElement("div");
    info.innerText = "This menu shows all users. You can control them (but changes will only appear for you).";
    info.style.marginBottom = "15px";
    menu.append(info);
    Object.entries(usersMap).forEach(([uid, user]) => {
      if (user.email == currentUseremail) return;

      const row = document.createElement("div");
      row.style.marginBottom = "8px";

      const name = document.createElement("span");
      name.innerText = user.name || `User ${uid}`;
      name.style.marginRight = "10px";

      const cardLabel = document.querySelector(`#card-${uid} .video-label`);
      if (cardLabel) cardLabel.innerText = user.name || `User ${uid}`;

      const remoteUser = client.remoteUsers.find(ru => ru.uid == uid);
      const audioEnabled = remoteUser?.audioTrack?.isPlaying ?? false;
      const videoEnabled = !!remoteUser?.videoTrack;

      const micBtn = document.createElement("button");
      micBtn.innerHTML = `<i class="fa ${audioEnabled ? "fa-microphone" : "fa-microphone-slash"}"></i>`;
      micBtn.style.marginRight = "5px";
      micBtn.onclick = () => {
        if (!remoteUser || !remoteUser.audioTrack) return;
        if (remoteUser.audioTrack.isPlaying) {
          remoteUser.audioTrack.stop();
          updateStatusIcons(uid, "audio", false);
          micBtn.innerHTML = '<i class="fa fa-microphone-slash"></i>';
        } else {
          remoteUser.audioTrack.play();
          updateStatusIcons(uid, "audio", true);
          micBtn.innerHTML = '<i class="fa fa-microphone"></i>';
        }
      };

      const camBtn = document.createElement("button");
      camBtn.innerHTML = `<i class="fa ${videoEnabled ? "fa-video" : "fa-video-slash"}"></i>`;
      camBtn.onclick = () => {
        if (!remoteUser || !remoteUser.videoTrack) return;
        const box = document.getElementById(`video-${uid}`);
        if (!box) return;
        if (box.childNodes.length > 0) {
          box.innerHTML = "";
          updateStatusIcons(uid, "video", false);
          camBtn.innerHTML = '<i class="fa fa-video-slash"></i>';
        } else {
          remoteUser.videoTrack.play(box);
          updateStatusIcons(uid, "video", true);
          camBtn.innerHTML = '<i class="fa fa-video"></i>';
        }
      };

      row.append(name, micBtn, camBtn);
      menu.append(row);
    });
  };
};

export const createVideoCard = (uid, username, adminEmail, userEmail, controls = false, localTracksRef) => {
  const cardId = `card-${uid}`;
  const videoId = `video-${uid}`;

  if (document.getElementById(cardId)) return document.getElementById(videoId);

  const isAdmin = userEmail === adminEmail;
  const card = document.createElement("div");
  card.id = cardId;
  card.className = isAdmin ? "video-card admin-card admin-card-large" : "video-card";

  const label = document.createElement("div");
  label.className = "video-label";
  label.innerText = username || `User ${uid}`;

  const videoBox = document.createElement("div");
  videoBox.id = videoId;
  videoBox.className = "video-box";

  card.append(label, videoBox);

  const shouldShowControls = controls && localTracksRef;

  if (shouldShowControls) {
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "video-controls";

    const micBtn = document.createElement("button");
    micBtn.style.color = "green";
    micBtn.innerHTML = localTracksRef.current?.[0]?.enabled
      ? '<i class="fa fa-microphone"></i>'
      : '<i class="fa fa-microphone-slash"></i>';
    micBtn.onclick = async () => {
      const micTrack = localTracksRef.current?.[0];
      if (!micTrack) return;
      const enabled = micTrack.enabled;
      await micTrack.setEnabled(!enabled);
      if (!enabled) await client.publish([micTrack]);
      else await client.unpublish([micTrack]);
      micBtn.innerHTML = enabled ? '<i class="fa fa-microphone-slash"></i>' : '<i class="fa fa-microphone"></i>';
    };

    const camBtn = document.createElement("button");
    camBtn.style.color = "green";
    camBtn.innerHTML = localTracksRef.current?.[1]?.enabled
      ? '<i class="fa fa-video"></i>'
      : '<i class="fa fa-video-slash"></i>';
    camBtn.onclick = async () => {
      const camTrack = localTracksRef.current?.[1];
      if (!camTrack) return;
      const screenTrack = localTracksRef.current?.[2];
      if (screenTrack) {
        await client.unpublish([screenTrack]);
        screenTrack.stop();
        localTracksRef.current[2] = null;
      }
      const enabled = camTrack.enabled;
      await camTrack.setEnabled(!enabled);
      const box = document.getElementById(videoId);
      box.innerHTML = "";
      if (!enabled) {
        await client.publish([camTrack]);
        camTrack.play(box);
      } else {
        await client.unpublish([camTrack]);
      }
      camBtn.innerHTML = enabled ? '<i class="fa fa-video-slash"></i>' : '<i class="fa fa-video"></i>';
    };

    const screenBtn = document.createElement("button");
    screenBtn.style.color = "orange";
    screenBtn.innerHTML = '<i class="fa fa-desktop"></i>';
    screenBtn.onclick = async () => {
      const box = document.getElementById(videoId);
      const camTrack = localTracksRef.current?.[1];
      let screenTrack = localTracksRef.current?.[2];
      try {
        if (!screenTrack) {
          screenTrack = await AgoraRTC.createScreenVideoTrack();
          localTracksRef.current[2] = screenTrack;
        }
        if (camTrack && camTrack.enabled) {
          await client.unpublish([camTrack]);
          camTrack.stop();
          await camTrack.setEnabled(false);
        }
        if (screenTrack.playing) {
          await client.unpublish([screenTrack]);
          screenTrack.stop();
          if(screenBtn.stop >1)
            console.log('video add successfly')
        }
        box.innerHTML = "";
        await client.publish([screenTrack]);
        screenTrack.play(box);
        screenTrack.on("track-ended", async () => {
          await client.unpublish([screenTrack]);
          localTracksRef.current[2] = null;
          if (camTrack) {
            await camTrack.setEnabled(true);
            await client.publish([camTrack]);
            camTrack.play(box);
          }
        });
      } catch (err) {
        console.warn("Screen share canceled or denied by user", err);
        localTracksRef.current[2] = null;
        if (camTrack) {
          await camTrack.setEnabled(true);
          await client.publish([camTrack]);
          camTrack.play(box);
        }
      }
    };

    controlsDiv.append(micBtn, camBtn, screenBtn);
    card.append(controlsDiv);
  } else {
    const statusDiv = document.createElement("div");
    statusDiv.className = "video-status";
    const micStatus = document.createElement("i");
    micStatus.id = `${uid}-audio`;
    micStatus.className = "fa fa-microphone-slash";
    const camStatus = document.createElement("i");
    camStatus.id = `${uid}-video`;
    camStatus.className = "fa fa-video-slash";
    statusDiv.append(micStatus, camStatus);
    card.append(statusDiv);
  }

  const container = document.getElementById("video-container");
  if (!container) return videoBox;

  if (isAdmin) container.prepend(card);
  else {
    let othersGrid = document.getElementById("others-grid");
    if (!othersGrid) {
      othersGrid = document.createElement("div");
      othersGrid.id = "others-grid";
      othersGrid.className = "others-grid";
      container.append(othersGrid);
    }
    othersGrid.append(card);
  }

  
  const totalUsers = container.querySelectorAll(".video-card").length;
  if (totalUsers === 1) {
    card.classList.add("single-user");
    container.classList.add("single-user");
  } else {
    container.classList.remove("single-user");
    document.querySelectorAll(".video-card").forEach(c => c.classList.remove("single-user"));
  }

  return videoBox;
};

export const joinCallHandler = async (course, userDetails, admin, setJoined, setLocalTracks, usersMap, setUsersMap, localTracksRef, options = { mic: true, cam: true },
  setLoading
) => {
  const userId = userDetails.id || userDetails._id;
  const { name, email } = userDetails;
  try {
    setLoading(true)
    const res = await axios.get("https://madeformanners-backend.onrender.com/api/agora/agora-token", { params: { courseId: course._id, uid: userId } });
    const { token, appID, channelName } = res.data;
    client.removeAllListeners();
    await client.join(appID, channelName, token, userId);

    const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await micTrack.setEnabled(options.mic);
    const camTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: "720p_1", facingMode: "user" });
    await camTrack.setEnabled(options.cam);

    localTracksRef.current = [micTrack, camTrack, null];
    setLocalTracks([micTrack, camTrack]);

    const tracksToPublish = [];
    if (micTrack.enabled) tracksToPublish.push(micTrack);
    if (camTrack.enabled) tracksToPublish.push(camTrack);
    if (tracksToPublish.length) await client.publish(tracksToPublish);
    const localVideoBox = createVideoCard(userId, name, admin.email, email, true, localTracksRef);
    if (camTrack.enabled) camTrack.play(localVideoBox);
    setJoined(true);
    initAdminControls(userDetails);
    
    if (typeof window.renderAdminMenu === "function") {
      window.renderAdminMenu({ [userId]: { name, email } });
    }
    setUsersMap(prev => ({ ...prev, [userId]: { name, email } }));

    const { data: joinedUsers } = await axios.get(`https://madeformanners-backend.onrender.com/api/courses/${course._id}/joinedUsers`);

    joinedUsers.forEach(u => {
      if (u.userId !== userId && u._id != userId && !document.getElementById(`card-${u._id}`) && !document.getElementById(`card-${u.userId}`)) {
        createVideoCard(u.userId, u.name, admin.email, u.email, false, localTracksRef);
        setUsersMap(prev => ({ ...prev, [u.userId]: { name: u.name, email: u.email } }));
      }
    });

    if (typeof window.renderAdminMenu === "function") {
      window.renderAdminMenu({
        ...usersMap,
        ...Object.fromEntries(joinedUsers.map(u => [u.userId, { name: u.name, email: u.email }]))
      });
    }

  
    client.remoteUsers.forEach(async (remoteUser) => {
      if (remoteUser.uid === userId) return;

      await client.subscribe(remoteUser, "video").catch(() => { });
      await client.subscribe(remoteUser, "audio").catch(() => { });

      const videoBox = document.getElementById(`video-${remoteUser.uid}`) || createVideoCard(
        remoteUser.uid,
        usersMap[remoteUser.uid]?.name || `User ${remoteUser.uid}`,
        admin.email,
        usersMap[remoteUser.uid]?.email || "",
        false,
        localTracksRef
      );
      if (remoteUser.videoTrack) remoteUser.videoTrack.play(videoBox);
      if (remoteUser.audioTrack) remoteUser.audioTrack.play();
      updateStatusIcons(remoteUser.uid, "video", !!remoteUser.videoTrack);
      updateStatusIcons(remoteUser.uid, "audio", !!remoteUser.audioTrack);
    });

    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);

      const { data: joinedUsers } = await axios.get(`https://madeformanners-backend.onrender.com/api/courses/${course._id}/joinedUsers`);
      const u = joinedUsers.find(x => x.userId === remoteUser.uid || x._id === remoteUser.uid);
      const userName = u?.name || `User ${remoteUser.uid}`;
      const userEmail = u?.email || "";

      const videoBox = document.getElementById(`video-${remoteUser.uid}`) || createVideoCard(remoteUser.uid, userName, admin.email, userEmail, false, localTracksRef);

      if (mediaType === "video" && remoteUser.videoTrack) remoteUser.videoTrack.play(videoBox);
      if (mediaType === "audio" && remoteUser.audioTrack) remoteUser.audioTrack.play();
      
      setUsersMap(prev => {
        const updated = { ...prev, [remoteUser.uid]: { name: userName, email: userEmail } };
        if (typeof window.renderAdminMenu === "function") {
          window.renderAdminMenu(updated);
        }
        return updated;
      });

      updateStatusIcons(remoteUser.uid, mediaType, true);
    });

    client.on("user-unpublished", (remoteUser, mediaType) => {
      updateStatusIcons(remoteUser.uid, mediaType, false);
    });

    client.on("user-left", (remoteUser) => {
      const card = document.getElementById(`card-${remoteUser.uid}`);
      if (card) card.remove();
      setUsersMap(prev => {
        const newMap = { ...prev };
        delete newMap[remoteUser.uid];
        if (typeof window.renderAdminMenu === "function") {
          window.renderAdminMenu(newMap);
        }
        return newMap;
      });

      
      const currentUserId = userDetails.id;
      if (remoteUser.uid == currentUserId) {
        const hamburger = document.getElementById("admin-hamburger");
        const menu = document.getElementById("admin-menu");
        if (hamburger) hamburger.remove();
        if (menu) menu.remove();
      }
    });

    window.localTracksRef = localTracksRef;
    window.currentCourse = course;
    window.currentUser = userDetails;

    const handleLeave = async () => {
      if (window.leavingRef) return;
      window.leavingRef = true;
      await leaveCallHandler(window.localTracksRef, window.currentCourse, window.currentUser, setUsersMap, setJoined, setLoading);
      window.leavingRef = false;
    }

    window.addEventListener("beforeunload", handleLeave);
    window.addEventListener("unload", handleLeave);

    if (window.history && window.history.pushState) {
      const pushState = window.history.pushState;
      window.history.pushState = function () {
        handleLeave();
        return pushState.apply(this, arguments);
      };
    }
    setLoading(false);
    
  } catch (err) {
    alert(" Server error while joining the call, please try again");
  }
};

export const leaveCallHandler = async (localTracksRef, course, userDetails, setUsersMap, setJoined, setLoading) => {
  try {
    setLoading(true)
    const tracks = Array.isArray(localTracksRef.current) ? localTracksRef.current : [];
    for (const track of tracks) { if (track?.stop) track.stop(); if (track?.close) track.close(); }
    try { const toUnpublish = tracks.filter(t => t?.enabled); if (toUnpublish.length) await client.unpublish(toUnpublish); } catch { }
    localTracksRef.current = [];
    await client.leave();
    await axios.post(`https://madeformanners-backend.onrender.com/api/courses/${course._id}/leave`, { userId: userDetails.id || userDetails._id });
    setJoined(false);
    const container = document.getElementById("video-container");
    if (container) container.innerHTML = "";

    
    const hamburger = document.getElementById("admin-hamburger");
    const menu = document.getElementById("admin-menu");
    if (hamburger) hamburger.remove();
    if (menu) menu.remove();

    const response = await axios.get(`https://madeformanners-backend.onrender.com/api/courses/${course._id}/joinedUsers`);
    const joinedUsers = response.data;

    const usersObject = {};
    joinedUsers.forEach(u => {
      usersObject[u.userId] = { name: u.name, email: u.email };
    });

    setUsersMap(usersObject);
    setLoading(false);
   
  } catch (err) {
    alert("Server error while leaving the video, please try again");
  }
};