import { useState } from 'react';
import './Header.scss';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/img.jpg';
import { useBetween } from 'use-between';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const state = useSelector((state) => state.data);
  const { userDetails, setUserDetails, setLoading } = useBetween(state.useShareState);
  const { id, img } = userDetails;

  const navigate = useNavigate();

  const navItems = [
    { id: 1, label: 'home' },
    { id: 2, label: 'courses' },
    { id: 3, label: 'about' },
    { id: 4, label: 'contact' },
  ];

  const myProfileDropDown = [
    { id: 1, label: 'profile' },
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
      });

      localStorage.removeItem("user");
      navigate('/');
      setLoading(false);
    }, 2000);
  };

  return (
    <header className={`Header bg-[#F8F3E8] fixed top-0 left-0 w-full z-50 shadow-md text-xl`}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 md:flex md:items-center md:gap-12 ">
            <NavLink to="/home" className="block text-teal-800">
              <img src={logo} alt="Made for Manners logo" className="logo" />
            </NavLink>
          </div>

          {/* Navigation */}
          <div className="md:flex md:items-center md:gap-12">
            <nav
              aria-label="Global"
              className={`${menuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none`}
            >
              <ul className="flex flex-col md:flex-row items-center gap-4 pb-2 bg-[#F8F3E8] ">
                {navItems.map((item) => (

                  <li key={item.id}>
                    <NavLink
                      className="text-333-500 transition hover:text-gray-500/75"
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
                      className="rounded-md bg-[#C6A662] px-3 py-2 font-medium text-white shadow-sm"
                      to="login"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </NavLink>

                    <NavLink
                      className="rounded-md bg-white px-3 py-2 font-medium text-[#C6A662]"
                      to="Register"
                      onClick={() => setMenuOpen(false)}
                    >
                      Register
                    </NavLink>
                  </>
                ) : (
                  <button
                    className="rounded-md bg-[#C6A662] px-3 py-2 font-medium text-white shadow-sm"
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

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                {id !== '' && (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as="div"
                      className="no-arrow border-0 bg-transparent p-0 m-0 cursor-pointer"
                      id="dropdown-custom"
                    >
                      <img
                        src={img}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                  
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item style={{ color: 'rgb(155, 155, 155)', borderBottom: '1px solid rgb(155, 155, 155) ' }}>{userDetails.name}</Dropdown.Item>
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

              {/* Hamburger button */}
              <div className="block md:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="rounded-sm bg-white p-2 text-gray-600 transition hover:text-gray-600/75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: '#C6A662' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
