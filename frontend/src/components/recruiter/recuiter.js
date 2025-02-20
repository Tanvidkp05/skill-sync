import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import RecruiterNavbar from './recruiterNavbar';
import RecentJobApplicationsTable from './recentJobs';
import JobPostingForm from './JobPostingForm';
import Searchbar from './searchbar/Searchbar';

const Recruiter = () => {
  const { user } = useContext(UserContext);  // Access the user data from UserContext
  const [recentJobApplications, setRecentJobApplications] = useState([]);
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);
  const [showSearchbar, setShowSearchbar] = useState(false);

  useEffect(() => {
    // Fetch recent job applications from your backend
    fetchRecentJobApplications();
  }, []);

  const fetchRecentJobApplications = async () => {
    try {
      const response = await fetch('/api/job-applications/recent');
      const data = await response.json();
      setRecentJobApplications(data);
    } catch (error) {
      // console.error('Error fetching recent job applications:', error);
    }
  };

  return (
    <div className="bg-gray-100 ">
      <RecruiterNavbar />
      <div className="flex h-screen text-foreground">
      <div className="flex-1 p-4">
      <div className="bg-card p-4 rounded-lg shadow">
      <div className="mt-3 flex">
      <div className="w-1/2 pr-4">
      <div className='flex justify-center text-center flex-col'>
      <h1 className="text-4xl font-semibold mb-2">
                Welcome <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-900 bg-clip-text text-transparent">{user.username}</span> to Skill-Sync
        </h1>
      <p className="text-muted-foreground mb-4 mt-4">"Get a quick overview of your resume and profession, empowering you to assess your qualifications and understand your likelihood of landing your next job with confidence."</p>
      </div>
      <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setShowJobPostingForm(true);
             
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
          >
            Upload Resume
          </button>
          <button 
            onClick={() => {
              setShowSearchbar(!showSearchbar);
              setShowJobPostingForm(false); // Ensure job posting form is hidden when searchbar is open
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
          >
            Search for Jobs 
          </button>
          </div>
        {showJobPostingForm && (
          <JobPostingForm onClose={() => setShowJobPostingForm(false)} />
        )}

          </div>
          <div className="w-2/3 h-1/2">
          <img src="https://www.hiresuccess.com/assets/pages/home/hire-success-c63b5a1698a943f27af88e76d837e16bae737605be93c747577099f2e76e5799cb6181f8e8cf5ff1d4e7e5fd072710760a7ff6d8de3b884cf73c001e92bdf1ca.png"alt=' ' width={400} height={300}
           style={{
            float: '',
            marginLeft: '180px'
          }} />
        </div>


          </div>
        </div>
        <div className='bg-gray-100 flex flex-col justify-center'>
        {showSearchbar && (
          <Searchbar />
        )}
        <RecentJobApplicationsTable recentJobApplications={recentJobApplications} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Recruiter;