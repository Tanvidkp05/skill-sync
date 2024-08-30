import React from 'react';
import RecruiterNavbar from '../recruiterNavbar';

const RecruiterProfile = () => {
  const recruiterData = {
    firstName: 'ishani',
    middleName: 'hiteshkumar',
    lastName: 'patel',
    email: 'ishani@example.com',
    mobileNumber: '1234567890',
    dateOfBirth: '2005-14-02',
    username: 'ishanipatel',
    designation: 'Recruiter',
    companyName: 'charusat',
  };

  return (
    <div>
    <RecruiterNavbar />
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-indigo-400 to-gray-300 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl mt-8">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 mb-8">
          Recruiter Profile
        </h2>
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">First Name: </span>
            <span className="text-gray-700">{recruiterData.firstName}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Middle Name: </span>
            <span className="text-gray-700">{recruiterData.middleName}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Last Name: </span>
            <span className="text-gray-700">{recruiterData.lastName}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Email: </span>
            <span className="text-gray-700">{recruiterData.email}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Mobile Number: </span>
            <span className="text-gray-700">{recruiterData.mobileNumber}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Date of Birth: </span>
            <span className="text-gray-700">{recruiterData.dateOfBirth}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Username: </span>
            <span className="text-gray-700">{recruiterData.username}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Designation: </span>
            <span className="text-gray-700">{recruiterData.designation}</span>
          </p>
          <p className="text-lg font-semibold">
            <span className="text-indigo-500">Company Name: </span>
            <span className="text-gray-700">{recruiterData.companyName}</span>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RecruiterProfile;
