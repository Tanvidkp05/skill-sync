import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const RecruiterNavbar = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-between bg-gray-200 px-6 py-3 no-underline">
      <div className="flex items-center justify-center ">
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          {/* Replace with your logo */}
        </div>
        <ul className="flex items-center justify-center">
          <li className="flex items-center justify-center hover:bg-gray-100 px-3 py-2">
            <NavLink to="/company-panel" className="text-gray-700 hover:text-blue-500 transition-colors duration-200 no-underline text-lg" >Home</NavLink>
          </li>
          <li className="flex items-center justify-center hover:bg-gray-100 px-3 py-2">
            <NavLink to="/view-applications" className="text-gray-700 hover:text-blue-500 transition-colors duration-200 no-underline text-lg">View Applications</NavLink>
          </li>
          <li className="flex items-center justify-center hover:bg-gray-100 px-3 py-2">
            <NavLink to="/recruiter-profile" className="text-gray-700 hover:text-blue-500 transition-colors duration-200 no-underline text-lg">Profile</NavLink>
          </li>
        </ul>
      </div>
      <div className="flex space-x-4 items-center justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-12" 
        onClick={handleClick}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default RecruiterNavbar;