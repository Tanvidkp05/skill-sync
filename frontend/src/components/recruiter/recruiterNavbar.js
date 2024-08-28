import React from 'react';

const RecruiterNavbar = () => {
  return (
    <div className="flex justify-between bg-gray-200 px-6 py-4">
      <div className="flex space-x-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full">
          {/* Replace with your logo */}
        </div>
        <ul className="flex space-x-5 justify-center">
        <li className="flex items-center justify-center">View Applications</li>
          <li className="flex items-center justify-center">Profile</li>
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