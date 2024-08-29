import React, { useState, useEffect } from 'react';
import RecruiterNavbar from './recruiterNavbar';
import RecentJobApplicationsTable from './recentJobs';
import JobPostingForm from './JobPostingForm';
import Searchbar from './searchbar/Searchbar';

const Recruiter = () => {
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
      console.error('Error fetching recent job applications:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <RecruiterNavbar />
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Welcome to the Recruiter Module Dashboard</h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Get a quick overview of your recruitment tasks and metrics. Stay organized and efficient in managing job postings, candidates, interviews, and analytics.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setShowJobPostingForm(true);
              setShowSearchbar(false); // Ensure searchbar is hidden when job posting form is open
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
          >
            Create Job Postings
          </button>
          <button
            onClick={() => {
              setShowSearchbar(true);
              setShowJobPostingForm(false); // Ensure job posting form is hidden when searchbar is open
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
          >
            Search Candidates
          </button>
        </div>
        {showJobPostingForm && (
          <JobPostingForm onClose={() => setShowJobPostingForm(false)} />
        )}
        {showSearchbar && (
          <Searchbar />
        )}
        <RecentJobApplicationsTable recentJobApplications={recentJobApplications} />
      </div>
    </div>
  );
};

export default Recruiter;
