import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Header() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogOut = () => {
    logOutUser();
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {isLoggedIn && (
        <header>
          <nav className="border-gray-200 px-4 lg:px-6 py-1 bg-[#8E7AB5]">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
              <Link to="/" className="flex items-center">
                <img
                  src="public/logo-habit-tracker.png"
                  className="mr-3 w-auto h-16"
                  alt="Logo"
                />
              </Link>
              <div className="flex items-center lg:order-2">
                {logOutUser && (
                  <Link
                    to="#"
                    className="text-white focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-[#8E7AB5] focus:outline-none"
                    onClick={handleLogOut}
                  >
                    Log out
                  </Link>
                )}

                <button
                  data-collapse-toggle="mobile-menu"
                  type="button"
                  className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-[#8E7AB5] focus:outline-none"
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
              <div
                className={`${
                  isMenuOpen ? "block" : "hidden"
                } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
                id="mobile-menu"
              >
                <ul className="flex flex-col  font-medium lg:flex-row lg:space-x-8 lg:mt-0 gap-1">
                  <li>
                    <Link
                      to="/"
                      className="text-white lg:focus:ring-2 lg:focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-[#8E7AB5] focus:outline-none"
                      onClick={toggleMenu} 
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/areas"
                      className="text-white focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-[#8E7AB5] focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Add Areas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/habits"
                      className="text-white focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-[#8E7AB5] focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Add Habits
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dailyhabits"
                      className="text-white focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 hover:bg-[#8E7AB5] focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Monthly Stats
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      )}
    </div>
  );
}

export default Header;
