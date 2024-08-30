import React from 'react';
import RecruiterNavbar from '../recruiterNavbar';
import './recruiterProfile.css'
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
    
    <div className="recruiter-profile-container">
      <RecruiterNavbar />
      <div className="profile-details">
        <h2>Recruiter Profile</h2>
        <p>
          <span className="profile-details-label">First Name:</span>
          <span className="profile-details-value">{recruiterData.firstName}</span>
        </p>
        <p>
          <span className="profile-details-label">Middle Name:</span>
          <span className="profile-details-value">{recruiterData.middleName}</span>
        </p>
        <p>
          <span className="profile-details-label">Last Name:</span>
          <span className="profile-details-value">{recruiterData.lastName}</span>
        </p>
        <p>
          <span className="profile-details-label">Email:</span>
          <span className="profile-details-value">{recruiterData.email}</span>
        </p>
        <p>
          <span className="profile-details-label">Mobile Number:</span>
          <span className="profile-details-value">{recruiterData.mobileNumber}</span>
        </p>
        <p>
          <span className="profile-details-label">Date of Birth:</span>
          <span className="profile-details-value">{recruiterData.dateOfBirth}</span>
        </p>
        <p>
          <span className="profile-details-label">Username:</span>
          <span className="profile-details-value">{recruiterData.username}</span>
        </p>
        <p>
          <span className="profile-details-label">Designation:</span>
          <span className="profile-details-value">{recruiterData.designation}</span>
        </p>
        <p>
          <span className="profile-details-label">Company Name:</span>
          <span className="profile-details-value">{recruiterData.companyName}</span>
        </p>
      </div>
    </div>
  );
};

export default RecruiterProfile;