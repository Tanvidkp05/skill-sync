import React from 'react';
import { NavLink } from 'react-router-dom';

const RecruiterNavbar = () => {
  return (
    <div className="flex justify-between bg-gray-200 px-6 py-4">
      <div className="flex space-x-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          {/* Replace with your logo */}
        </div>
        <ul className="flex space-x-5 justify-center">
          <li className="flex items-center justify-center hover:bg-gray-100 px-2">
            <NavLink to="/" className="text-gray-700 hover:text-blue-500 transition-colors duration-200" >Home</NavLink>
          </li>
          <li className="flex items-center justify-center hover:bg-gray-100 px-2">
            <NavLink to="/view-applications" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">View Applications</NavLink>
          </li>
          <li className="flex items-center justify-center hover:bg-gray-100 px-2">
            <NavLink to="/recruiter-profile" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">Profile</NavLink>
          </li>
        </ul>
      </div>
      <div className="flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Action 1
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Action 2
        </button>
      </div>
    </div>
  );
};

export default RecruiterNavbar;