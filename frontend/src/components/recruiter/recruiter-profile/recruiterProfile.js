import React, { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import RecruiterNavbar from '../recruiterNavbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faIdBadge,
  faUserTag
} from '@fortawesome/free-solid-svg-icons';

const RecruiterProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-1 py-3">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center sm:text-left">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col sm:flex-row overflow-hidden transition-all hover:shadow-xl">
          {/* Left: Profile Picture */}
          <div className="sm:w-1/3 bg-gray-100 flex items-center justify-center p-8 group relative">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-300 flex items-center justify-center text-6xl font-bold text-gray-500 select-none transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">
                {user.firstName?.[0] || 'U'}
              </span>
            </div>
          </div>

          {/* Right: Profile Details */}
          <div className="sm:w-2/3 p-10 space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProfileItem icon={faUser} label="First Name" value={user.firstName} />
              <ProfileItem icon={faUser} label="Middle Name" value={user.middleName || '—'} />
              <ProfileItem icon={faUser} label="Last Name" value={user.lastName} />
            </div>
            
            {/* Username Alone */}
            <ProfileItem icon={faUserTag} label="Username" value={user.username} />
            
            {/* Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileItem icon={faEnvelope} label="Email Address" value={user.email} />
              <ProfileItem icon={faPhone} label="Mobile Number" value={user.mobileNumber} />
            </div>
            
            {/* Other fields */}
            <ProfileItem icon={faCalendar} label="Date of Birth" value={user.dob} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="w-8 h-8 flex items-center justify-center text-blue-500">
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="text-lg font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default RecruiterProfile;