import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterNavbar from '../recruiterNavbar';
import jobData from './dummy.json';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DropdownJob from '../dropdownJob';

const ViewAppl = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
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
    if (event.target.tagName !== "BUTTON") {
      navigate(`/view-applications/${jobid}`);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <RecruiterNavbar />     
      <h1 className="text-center mb-8 mt-2 text-5xl font-semibold">Job Postings</h1>
      <ul className="grid grid-cols-4 gap-4 justify-items-center px-20">
        {jobData.map((job) => (
          <li key={job.title} className="bg-indigo-300 p-4 rounded-3xl shadow-sm border w-full h-52 bg-opacity-80 relative">
            <div className="flex justify-end">
              <MoreVertIcon
                className="cursor-pointer"
                onClick={() => handleDropdownClick(job)}
              />
              {showDropdown && selectedJobId === job && (
                <DropdownJob />
              )}
            </div>
            <Link
                      to={`/view-applications/${job.title}`}
                      onClick={(event) =>
                        handleLinkClick(event, job.title)
                      }
                      className="no-underline text-black"
                    >
            <div className="flex justify-center mt-1">
              <strong className="text-2xl">{job.title}</strong>
            </div>
            <br />
            <strong>Status:</strong> {job.status}
            <br />
            <strong>Date:</strong> {job.date}
            <br />
            <strong>Applicants:</strong> {job.applicants}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppl;
