import { useEffect, useState } from 'react';
import './Header.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/img.jpg';
import { useBetween } from 'use-between';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { io } from "socket.io-client";
import notificationSound from '../../sounds/notification.mp3'


const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, setLoading, notifications, setNotifications, admin } =
    useBetween(state.useShareState);

  const { id, img } = userDetails;
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showing, setShowing] = useState(false);

  const showToast = (noti) => {
    setToast(noti);
    setShowing(true);

    const audio = new Audio(notificationSound);
    audio.play();

    setTimeout(() => {
      setShowing(false);
      setTimeout(() => setToast(null), 500);
    }, 6000);
  };

  useEffect(() => {
    setNotifications(userDetails.notifications);

    const handleNewCourse = (data) => {
      const newNoti = {
        type: "course",
        title: data.title,
        message: data.message,
        Notidate: data.Notidate,
        date: data.date,
        time: data.time,
      };
      setNotifications(prev => [ ...prev,newNoti ]);
      showToast(newNoti);

    };
    const handleReminder = (data) => {
      const id = userDetails._id || userDetails.id || userDetails.userId
      if (data.userId === id) {
        const newNoti = {
          type: "course",
          title: data.title,
          message: data.message,
          date: data.date,
          time: data.time,
          Notidate: data.Notidate,
        };
        setNotifications(prev =>[ ...prev,newNoti ]);
        showToast(newNoti);

      }
    };

    const handleContact = (data) => {
      if (userDetails.email === admin.email) {
        const newNoti = {
          type: "contact",
          title: data.title,
          message: data.message,
          date: data.date,
          Notidate: data.Notidate,
        };
        setNotifications(prev => [ ...prev, newNoti ]);
        showToast(newNoti);
      }

    };

    socket.on("new_course", handleNewCourse);
    socket.on("course_reminder", handleReminder);
    socket.on("contact_message", handleContact);

    return () => {
      socket.off("new_course", handleNewCourse);
      socket.off("course_reminder", handleReminder);
      socket.off("contact_message", handleContact);
    };
  }, [userDetails]);
 

  const navItems = [
    { id: 1, label: 'home' },
    { id: 2, label: 'courses' },
    { id: 3, label: 'about' },
    { id: 4, label: 'contact' },
  ];

  const myProfileDropDown = [
    { id: 1, label: 'Profile' },
    { id: 2, label: 'Log Out' },
  ];

  const handelLogOut = () => {
    setLoading(true);
    setTimeout(() => {
      setUserDetails({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        img: '',
        courses: [],
        notifications: [],
      });
      setNotifications([]);
      localStorage.removeItem("userID");
      navigate('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <header className="Header bg-[#F8F3E8] fixed top-0 left-0 w-full z-50 shadow-md text-xl">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">

            <div className="flex-1 md:flex md:items-center md:gap-12">
              <NavLink to="/home">
                <img src={logo} alt="Made for Manners logo" className="logo" />
              </NavLink>
            </div>

            {id !== '' && (
              <div>

                {notifications.length > 0 &&
                  <div className='notificationMarks'>{notifications.length}</div>
                }
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="no-arrow cursor-pointer">
                    <i className="fa-solid fa-bell"></i>

                  </Dropdown.Toggle>
                  <Dropdown.Menu className='NotiContaner'>
                    {notifications.length === 0 && <div className="px-3 py-2 text-gray-500">No notifications</div>}
                    {notifications.slice().reverse().map((noti, index) => (
                      <Dropdown.Item key={index} className='notification'
                        onClick={() => {
                          if (noti.type == "course") navigate("/courses");
                          if (noti.type == "contact") navigate("/contact");
                        }}>
                        <strong>{noti.title}</strong>
                        <div className='date'>{noti.Notidate}</div>
                        <div>{noti.message}</div>

                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}

            <div className="md:flex md:items-center md:gap-12">
              <nav
                aria-label="Global"
                className={`${menuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto shadow-md md:shadow-none`}
              >
                <ul className="flex flex-col md:flex-row items-center gap-4 pb-2 bg-[#F8F3E8]">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        to={item.label}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                      </NavLink>
                    </li>
                  ))}

                  {id === '' ? (
                    <>
                      <NavLink
                        className="rounded-md bg-[#C6A662] px-3 py-2 text-white shadow-sm"
                        to="login"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </NavLink>

                      <NavLink
                        className="rounded-md bg-white px-3 py-2 text-[#C6A662]"
                        to="Register"
                        onClick={() => setMenuOpen(false)}
                      >
                        Register
                      </NavLink>
                    </>
                  ) : (
                    <button
                      className="rounded-md bg-[#C6A662] px-3 py-2 text-white shadow-sm"
                      onClick={() => {
                        handelLogOut();
                        setMenuOpen(false);
                      }}
                    >
                      Log Out
                    </button>
                  )}
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  {id !== '' && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="div"
                        className="no-arrow cursor-pointer"
                      >
                        <img src={img} alt="Profile" className="profileImg" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item style={{ color: '#999', borderBottom: '1px solid #999' }}>{userDetails.name}</Dropdown.Item>
                        {myProfileDropDown.map((item) => (
                          <div key={item.id}>
                            {item.label !== "Log Out" ? (
                              <Dropdown.Item
                                as={NavLink}
                                to={item.label}
                                onClick={() => setMenuOpen(false)}
                              >
                                {item.label}
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item
                                as="button"
                                onClick={() => {
                                  handelLogOut();
                                  setMenuOpen(false);
                                }}
                              >
                                {item.label}
                              </Dropdown.Item>
                            )}
                          </div>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>

                <div className="block md:hidden">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rounded-sm p-2 text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: '#C6A662' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>
      {/* Toast Notifications */}
      {toast && (

        <div className={`toast-container ${showing ? 'fade-in' : 'fade-out'}`}>
          <div className="toast1">
            <div className="toast-content1">
              <strong>{toast.title}</strong>
              <p>{toast.message}</p>
              <span>{toast.Notidate}</span>
            </div>
            <button
              className="close-btn"
              onClick={() => setShowing(false)}
            >
              &times;
            </button>
          </div>
        </div>


      )}

    </>
  );
};

export default Header;
