import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './CourseDetailsModal.scss'
import { useEffect, useState } from "react";


const CourseDetailsModal = ({ show, onClose, course, onBook, userDetails }) => {
    const [booked, setBooked] = useState('')

    useEffect(() => {
        if (course && userDetails?.courses) {
            const matchedCourse = userDetails.courses.find((c) => c._id === course._id);

            if (matchedCourse) {

                setBooked(matchedCourse.status || "booked");

            }
        }
    }, [course, userDetails]);

    if (!course) return null;

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton >
                <Modal.Title>{course.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="course-details-modal">
                    {booked ? (
                        course.link ? (
                            <video src={course.link} controls poster={course.img} />
                        ) : (
                            <div>
                                <p>This course has not been recorded</p>
                                <img src={course.img} alt={course.name} />
                            </div>
                        )
                    ) : (
                        <>
                        <p className="not-booked-label noti1" >
                            You need to book this course to watch the video
                             
                        </p>
                        <img src={course.img} alt={course.name} />
                        </>
                    )}

                    {booked && (
                        <p className="booked-label"><i className="fas fa-check"></i> {booked}</p>
                    )}

                    <p><strong>Course Price:</strong> {course.price} $</p>
                    <p className="mt-3"><strong>Course Date:</strong> {course.date} / {`(${course.time}) - (${course.endtime})`}</p>
                    {/* <p><strong>Registered Users:</strong> {course.bookedUsers.length}</p> */}
                    <p><strong>Course Description:</strong> {course.description}</p>
                    <p><strong>Course Categories:</strong> {course.categories.join(', ')}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                {booked === '' &&
                    <Button variant="primary" onClick={() => onBook(course.name, course.price, course._id)}>
                        Book
                    </Button>
                }

            </Modal.Footer>
        </Modal>
    );
};

export default CourseDetailsModal;
