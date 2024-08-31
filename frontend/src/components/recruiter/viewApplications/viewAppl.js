import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterNavbar from '../recruiterNavbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DropdownJob from '../dropdownJob';
import axios from 'axios';

const ViewAppl = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const navigate = useNavigate();

  const handleDropdownClick = (job) => {
    if (selectedJobId === job) {
      setShowDropdown(false);
      setSelectedJobId(null);
    } else {
      setShowDropdown(true);
      setSelectedJobId(job);
    }
  };

  const handleLinkClick = (event, jobid) => {
    if (event.target.tagName !== 'BUTTON') {
      navigate(`/view-applications/${jobid}`); // Adjust route param if needed
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const token = localStorage.getItem('token'); // Retrieve token from localStorage
          console.log(token); // Should print the token

          const response = await axios.get('http://localhost:5000/api/jobpostings', {
              headers: {
                  'Authorization': `Bearer ${token}`, // Include token in Authorization header
              },
          });
  
          // Process the response
          console.log(response.data);
          setApplicationDetails(response.data);
          setIsLoading(false);
      } catch (error) {
          console.error('Error fetching job postings:', error.response ? error.response.data : error.message);
      }
  };
    fetchData();
  }, []);

  return (
    <div className='bg-gray-100 min-h-screen'>
      <RecruiterNavbar />
      <h1 className="text-center mb-8 mt-2 text-5xl font-semibold">Job Postings</h1>
      <ul className="grid grid-cols-4 gap-4 justify-items-center px-20">
        {applicationDetails.length > 0 ? ( // Check if there's data before mapping
          applicationDetails.map((applicationDetails) => (
            <li key={applicationDetails._id} className="bg-indigo-300 p-4 rounded-3xl shadow-sm border w-full h-52 bg-opacity-80 relative">
              <div className="flex justify-end">
                <MoreVertIcon
                  className="cursor-pointer"
                  onClick={() => handleDropdownClick(applicationDetails)}
                />
                {showDropdown && selectedJobId === applicationDetails && (
                  <DropdownJob /> // Assuming DropdownJob renders job details
                )}
              </div>
              <Link
                to={`/view-applications/${applicationDetails.title}`} // Adjust route param if needed
                onClick={(event) => handleLinkClick(event, applicationDetails.title)}
                className="no-underline text-black"
              >
                <div className="flex justify-center mt-1">
                  <strong className="text-2xl">{applicationDetails.title}</strong>
                </div>
                <br />
                <strong>Status:</strong> {applicationDetails.status}
                <br />
                <strong>Date:</strong> {applicationDetails.datePosted}
                <br />
                <strong>Applicants:</strong> 0
                {/* Adjust for any other fields you want to display */}
              </Link>
            </li>
          ))
        ) : (
          <p>No job postings found.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewAppl;