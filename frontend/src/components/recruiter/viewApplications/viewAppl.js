import {React, useState} from 'react';
import RecruiterNavbar from '../recruiterNavbar';
import jobData from './dummy.json'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DropdownJob  from '../dropdownJob';

const ViewAppl = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleDropdownClick = (job) => {
    setShowDropdown(!showDropdown);
    setSelectedJobId(job);
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <RecruiterNavbar />
      <h1 className="text-center mb-8 mt-2 text-5xl font-semibold">Job Postings</h1> 
      <ul className="grid grid-cols-4 gap-4 justify-items-center px-20"> 
        {jobData.map((job) => (
          <li
            key={job.title}
            className="bg-indigo-300 p-4 rounded-3xl shadow-sm border w-3 min-w-full h-52 bg-opacity-80"
          >
            <div className='flex justify-end'>
              <MoreVertIcon className='justify-end'
                onClick={() =>
                  handleDropdownClick(job)}
              />
              {showDropdown &&
                        selectedJobId === job && (
                          <DropdownJob
                            onClose={() => setShowDropdown(false)}
                          />
                        )}
              </div>
            <div className="flex justify-center">
              <strong className="text-2xl">{job.title}</strong>
            </div>
            <br />
            <strong>Status:</strong> {job.status}
            <br />
            <strong>Date:</strong> {job.date}
            <br />
            <strong>Applicants:</strong> {job.applicants}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppl;