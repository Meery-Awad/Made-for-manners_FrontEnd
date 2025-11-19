import React, { useState, useEffect, useRef } from 'react';
import './Login.scss';
import { useBetween } from 'use-between';
import { useSelector } from 'react-redux';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import icon from '../../images/icon.png';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const LoginPage = () => {
  const state = useSelector((state) => state.data);
  const { websiteTitle, userDetails, setUserDetails, setLoading, setUpdatedData, serverUrl, loginKeyWords, registerKeyWords, pageKeywords } =
    useBetween(state.useShareState);
  const { email, password } = userDetails;
  const [erorr, setErorr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname.toLowerCase().includes('register');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErorr('');
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails(prev => ({ ...prev, img: URL.createObjectURL(file) }));
    }
  };

  const handleRemoveImage = () => {
    setUserDetails((prev) => ({ ...prev, img: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  };
  const handleSubmit =  async (e) => {
    setLoading(true);
    e.preventDefault();

    if (isRegister) {
      const formData = new FormData();
      formData.append("name", userDetails.name);
      formData.append("email", userDetails.email);
      formData.append("password", userDetails.password);
      formData.append("confirmPassword", userDetails.confirmPassword);

      if (fileInputRef.current?.files[0]) {
        formData.append("img", fileInputRef.current.files[0]);
      } else {
        const defaultImageFile = await urlToFile(icon, "default.png", "image/png");
        formData.append("img", defaultImageFile);
      }
    
      axios.post(`${serverUrl}/api/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {

          setLoading(false);
          navigate("/Login");
        })
        .catch((err) => {
          setErorr(err.response?.data?.message);
          setLoading(false);
        });
    } else {
      axios
        .post(`${serverUrl}/api/users/login`, { email, password })
        .then((res) => {
          const newUser = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            password: res.data.password,
            img: res.data.img,
            courses: res.data.courses,
            notifications: res.data.notifications
          };
          setUpdatedData(newUser);
          setUserDetails(newUser);
          setLoading(false);
          localStorage.setItem('userID', JSON.stringify({ id: res.data.id }));
          navigate('/Home');
        })
        .catch((err) => {
          setErorr(err.response?.data?.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setUserDetails({ id: '', name: '', email: '', password: '', confirmPassword: '', img: '', courses: [], notifications: [] });
    setErorr('');
  }, [location]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const RegContent = "Register an account at The Manor of Manners to access online etiquette courses and learn proper manners and social skills.";
  const loginContent = "Login to your account at The Manor of Manners to access your online etiquette courses and continue learning social skills."

  return (
    <div className="login-page">
      <Helmet>
        <link rel="canonical" href="https://madeformanners.com/login" />
        <title>Login -Register |{websiteTitle}</title>
        <meta
          name="description"
          content={isRegister
            ? { RegContent }
            : { loginContent }}
        />
        <meta name="keywords" content={`${pageKeywords} ${loginKeyWords} ${registerKeyWords} `} />
      </Helmet>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {erorr && <div className='error'>{erorr}</div>}

            {isRegister && (
              <>
                <label>Full Name <span className="required"> *</span></label>
                <input type="text" name="name" value={userDetails.name || ''} onChange={handleChange} required placeholder="Enter your full name" />
              </>
            )}

            <label>Email <span className="required"> *</span></label>
            <input type="email" name="email" value={userDetails.email || ''} onChange={handleChange} required placeholder="Enter your email" />

            <label>Password <span className="required"> *</span></label>
            <div className="password-field">
              <input type={showPassword ? 'text' : 'password'} name="password" value={userDetails.password || ''} onChange={handleChange} required placeholder="Enter your password" />
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} onClick={() => setShowPassword(!showPassword)}></i>
            </div>

            {!isRegister && (
              <p className="text-center mt-3">
                <NavLink to="/forgot-password" className="text-600 underline" >
                  Forgot your password?
                </NavLink>
              </p>
            )}

            {isRegister && (
              <>
                <label>Confirm Password <span className="required"> *</span></label>
                <div className="password-field">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={userDetails.confirmPassword || ''} onChange={handleChange} required placeholder="Confirm your password" />
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                </div>

                <label>Upload Image <span className="description">(optional)</span></label>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />

                {userDetails.img && (
                  <div className="img">
                    <button type="button" className="delete-img-btn deleteImgBtn" onClick={handleRemoveImage}>
                      x
                    </button>
                    <img src={userDetails.img} alt="Preview" />

                  </div>
                )}
              </>
            )}
          </div>

          <button type="submit" className="login-btn">{isRegister ? 'Register' : 'Login'}</button>

          {!isRegister && (

            <p className="text-center mt-4">
              Don't have an account? <NavLink to="/Register" className="text-600 underline" >Register here</NavLink>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;