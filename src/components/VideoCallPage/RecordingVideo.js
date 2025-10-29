import axios from "axios";
import React, { useState, useRef } from "react";
import './RecordingVideo.scss'
import { useBetween } from "use-between";
import { useSelector } from "react-redux";

const ScreenRecordingControls = ({ userDetails, admin, course }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [chunks, setChunks] = useState([]);
    const mediaRecorderRef = useRef(null);
    const screenStreamRef = useRef(null);
    const state = useSelector((state) => state.data);
    const { reload, setReload, Loading, setLoading, serverUrl } = useBetween(state.useShareState);

    const handleStart = async () => {
        try {

            if (!mediaRecorderRef.current) {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
                screenStreamRef.current = stream;

                const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) setChunks((prev) => [...prev, e.data]);
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
            } else if (mediaRecorderRef.current.state === "paused") {
                mediaRecorderRef.current.resume();
            }

            setIsRecording(true);
        } catch (err) {

            alert(" Failed to start screen recording. Please make sure permissions are granted.");
        }
    };

    const handleStop = () => {
        if (!mediaRecorderRef.current) return;

        if (mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.pause();
            mediaRecorderRef.current.requestData();
            setIsRecording(false);
        }
    };

    const handleSave = async () => {
        if (!chunks.length) return alert("⚠️ No recording available");;

        const blob = new Blob(chunks, { type: "video/webm" });

        const formData = new FormData();
        formData.append("video", blob, `${course.name}-${Date.now()}`);
        formData.append("courseId", course._id);
        formData.append("userId", userDetails.id);

        setLoading(!Loading)
        try {
            await axios.post(`${serverUrl}/api/users/editUserCourses`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 0,
            });
            setReload(!reload)
            setLoading(!Loading)
            alert("✅ The video has been uploaded. The video link has been saved in the course.");
        } catch (err) {
            // const serverMessage = err.response?.data?.message || err.message || "Unknown error";
            alert(`Failed to upload the video`);
            setReload(!reload)
            setLoading(!Loading)           
        }

        setChunks([]);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
        }
        setIsRecording(false);
    };

    if (!userDetails.email || userDetails.email !== admin.email) return null;
    const userEmail = userDetails.email

    return (
        userEmail === admin.email && (<div className="recording-controls ">
            {!isRecording ? (
                <button onClick={handleStart} title="Recording">
                    <i className="fas fa-circle"></i>
                </button>
            ) : (
                <button onClick={handleStop} title="Stop">
                    <i className="fas fa-circle-pause"></i>
                </button>
            )}
            {chunks.length > 0 && (
                <button onClick={handleSave} title="Save">
                    <i className="fas fa-save"></i>
                </button>
            )}
        </div>
        )
    );
};

export default ScreenRecordingControls;
