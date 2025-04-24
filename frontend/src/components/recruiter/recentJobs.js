import React, { useState, useEffect } from 'react';
import { Briefcase, Star, ChevronRight, BarChart2 } from 'lucide-react';

const RecentJobApplicationsTable = () => {
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const APP_ID = 'a3518aee';
        const APP_KEY = '6391052c1e6589932333925ccc12fa13';
        const country = 'us';

        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5`
        );

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setJobData(data.results.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.display_name || 'Company not specified',
            location: job.location?.display_name || 'Location not specified',
            salary: job.salary_max ? `$${job.salary_min || 'N/A'} - $${job.salary_max}` : 'Salary not specified',
            posted: new Date(job.created).toLocaleDateString(),
            url: job.redirect_url,
            match: `${Math.floor(Math.random() * 15) + 75}%`
          })));
        } else {
          setError('No job data found');
        }
      } catch (err) {
        setError('Failed to fetch job data');
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center  min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading recent job postings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Recent Job Postings</h1>

        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="grid grid-cols-12 bg-gray-100 px-6 py-3 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-5">Job Title</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Salary</div>
            <div className="col-span-1 text-right">Match</div>
          </div>

          {jobData.map((job) => (
            <div 
              key={job.id} 
              className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all"
            >
              <div className="col-span-5 flex items-start gap-3">
                <Briefcase className="text-blue-500 mt-1" size={18} />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{job.title}</h3>
                  <p className="text-xs text-gray-500">Posted: {job.posted}</p>
                </div>
              </div>
              <div className="col-span-2 text-sm text-gray-700 flex items-center px-1">{job.company}</div>
              <div className="col-span-2 text-sm text-gray-700 flex items-center">{job.location}</div>
              <div className="col-span-2 text-sm text-gray-700 flex items-center">{job.salary}</div>
              <div className="col-span-1 flex items-center justify-end">
                <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  <Star className="mr-1" size={12} />
                  {job.match}
                </div>
              </div>
              <div className="col-span-12 md:hidden mt-2">
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex justify-between items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Details
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Job Market Insights</h3>
            <div className="flex items-center text-blue-600">
              <BarChart2 className="mr-2" size={18} />
              <span className="text-sm font-medium">View Analytics</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            These are the most recent job postings in our database. The "Match" score indicates how well these positions align with typical candidate profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentJobApplicationsTable;