import React, { useEffect, useRef, useState } from "react";
import './Modal.scss';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import noPhoto from '../../images/noImg.jpg'

const CourseModal = () => {

  const state = useSelector((state) => state.data);
  const {
    userDetails,
    courseDetails,
    setCourseDetails,
    editOrAdd,
    admin,
    setLoading,
    reload,
    setReload,
    setEditOrAdd,
    serverUrl,
    categories
  } = useBetween(state.useShareState);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const errorRef = useRef(null);

  const { 
    name, 
    description, 
    date, 
    time, 
    endtime, 
    img, 
    price, 
    recommended, 
    isNotLive = false, 
    categories: selectedCategories = [] 
  } = courseDetails;

  const initCourseModal = () => {
    setCourseDetails({
      name: '',
      description: '',
      date: '',
      time: '',
      endtime: '',
      img: null,
      price: 0,
      recommended: false,
      isNotLive: false,
      categories: [],
      bookedUsers: [],
      joinedUsers: [],
    });
    setError(false);
    setTimeError(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseDetails((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setCourseDetails(prev => ({ ...prev, img: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({ ...prev, [name]: value }));
    setError(false);
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected && !selectedCategories.includes(selected)) {
      setCourseDetails((prev) => ({
        ...prev,
        categories: [...prev.categories, selected]
      }));
    }
  };

  const removeCategory = (cat) => {
    setCourseDetails((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat)
    }));
  };

  const handleCheckboxChange = () => {
    setCourseDetails((prev) => ({ ...prev, recommended: !recommended }));
  };

  const handleNotLiveChange = () => {
    setCourseDetails(prev => ({ ...prev, isNotLive: !prev.isNotLive }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !date || !time || !endtime || selectedCategories.length === 0) {
      setError(true);
      if (errorRef.current) errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (time && endtime && time >= endtime) {
      setTimeError(true);
      if (errorRef.current) errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setTimeError(false);
    setError(false);

    const headers = { "Content-Type": "application/json;charset=UTF-8" };
    setLoading(true);

    const id = courseDetails.id;
    const courseData = {
      ...courseDetails,
      img: courseDetails.img || noPhoto
    };

    if (editOrAdd === 'Add') {
     await axios.post(`${serverUrl}/api/courses`, courseData, { headers })
        .then((res) => {
          setModalIsOpen(false);
          initCourseModal();
          setLoading(false);
          setReload(!reload);
        })
        .catch((err) => {
          alert("Error adding course, please try again later");
          setLoading(false);
        });
        await axios.post(`${serverUrl}/api/notification`, { course: courseData });
    } else {
      axios.put(`${serverUrl}/api/courses/${id}`, courseData, { headers })
        .then((res) => {
          setModalIsOpen(false);
          initCourseModal();
          setLoading(false);
          setReload(!reload);
        })
        .catch((err) => {
          console.error("Error updating course:", err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (courseDetails.name !== '') {
      setModalIsOpen(true);
    }
  }, [courseDetails]);

  return (
    <div className="Courses">
      {userDetails.email === admin.email && (
        <button
          className="Btn"
          onClick={() => {
            initCourseModal();
            setModalIsOpen(true);
            setEditOrAdd('Add');
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}

      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} className="Model">
        <Modal.Body ref={errorRef}>
          <form className="Form" onSubmit={handleSubmit}>

            {/* Checkbox at the top */}
            <div className="checkBox">
              <input 
                type="checkbox" 
                checked={isNotLive} 
                onChange={handleNotLiveChange} 
              />
              <label className="lable"> Not Live</label>
            </div>

            {error && <p className="error">Please fill out all required fields (*)</p>}

            <div>
              <label className="lable">Course Name <span className="required">*</span></label>
              <input type="text" name="name" value={name} onChange={handleChange} placeholder="Enter name" required />
            </div>

            <div>
              <label className="lable">Course Price <span className="required">*</span></label>
              <input type="number" name="price" value={price} onChange={handleChange} placeholder="Course Price" required />
            </div>

            <div>
              <label className="lable">Course Description <span className="required">*</span></label>
              <textarea name="description" value={description} onChange={handleChange} placeholder="Enter description" rows="3" required></textarea>
            </div>

            <div>
              <label className="lable">Course Date <span className="required">*</span></label>
              <input type="date" name="date" value={date} onChange={handleChange} className="form-control mb-2" />
            </div>

            <div>
              <label className="lable">Course Time <span className="required">*</span></label>
              {timeError && <p className="error">End time must be later than start time</p>}
              <p>from</p>
              <input type="time" name="time" value={time || ""} onChange={(e) => {
                setCourseDetails(prev => ({ ...prev, time: e.target.value }));
                setTimeError(false);
              }} className="form-control mb-2" />
              <p>to</p>
              <input type="time" name="endtime" value={endtime || ""} onChange={(e) => {
                setCourseDetails(prev => ({ ...prev, endtime: e.target.value }));
                setTimeError(false);
              }} className="form-control mb-2" />
            </div>

            <div>
              <label className="lable">Categories <span className="required">*</span></label>
              <select onChange={handleCategoryChange} className="form-control mb-2">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.level}>{cat.level}</option>
                ))}
              </select>
              <div className="selected-categories">
                {selectedCategories.map((cat) => (
                  <span key={cat} className="tag">
                    {cat}
                    <button type="button" onClick={() => removeCategory(cat)}>x</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="lable">Upload Image <span className="description">(optional)</span></label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {img && (
                <div className="img-container" style={{ position: 'relative', display: 'inline-block' }}>
                  <button type="button" onClick={handleDeleteImage} className="deleteImgBtn" >x</button>
                  <img src={img} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="checkBox">
              <input type="checkbox" checked={recommended} onChange={handleCheckboxChange} />
              <label className="lable"> Recommended</label>
            </div>

          </form>
        </Modal.Body>

        <Modal.Footer dir="auto">
          <Button variant="secondary" onClick={() => { initCourseModal(); setModalIsOpen(false); }}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>{editOrAdd}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseModal;
