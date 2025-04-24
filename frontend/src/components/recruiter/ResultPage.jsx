import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, CheckCircle, Star, ChevronRight, BarChart2 } from 'lucide-react';
import RecruiterNavbar from './recruiterNavbar';

const JobRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, skills, match_percent, missing_skills, skill_info } = location.state || {};
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRecommendations = async () => {
      try {
        const APP_ID = 'a3518aee';
        const APP_KEY = '6391052c1e6589932333925ccc12fa13';
        const country = 'us'; // You can make this dynamic based on user preference
        
        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(prediction)}&results_per_page=3`
        );
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setJobRecommendations(data.results.map(job => ({
            title: job.title,
            company: job.company?.display_name || 'Company not specified',
            location: job.location?.display_name || 'Location not specified',
            salary: job.salary_max ? `$${job.salary_min || 'N/A'} - $${job.salary_max}` : 'Salary not specified',
            type: job.contract_type || 'Full-time',
            description: job.description,
            match: `${Math.floor(Math.random() * 10) + 85}%`, // Random match percentage for demo
            posted: new Date(job.created).toLocaleDateString(),
            url: job.redirect_url,
            skills: extractSkillsFromDescription(job.description)
          })));
        } else {
          setError('No job recommendations found for this profession.');
        }
      } catch (err) {
        setError('Failed to fetch job recommendations. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Simple function to extract "skills" from description (very basic implementation)
    const extractSkillsFromDescription = (description) => {
      if (!description) return [];
      const commonSkills = [
        'Python', 'JavaScript', 'Java', 'C++', 'SQL',
        'Machine Learning', 'Data Analysis', 'React',
        'Node.js', 'AWS', 'Docker', 'Kubernetes'
      ];
      return commonSkills.filter(skill => 
        description.toLowerCase().includes(skill.toLowerCase())
      ).slice(0, 5); // Limit to 5 skills
    };

    fetchJobRecommendations();
  }, [prediction]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Finding the best job recommendations for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Recommendations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const handleViewAnalysis = () => {
    navigate('/analysis', { 
      state: { 
        prediction,
        skills,
        match_percent,
        missing_skills,
        skill_info 
      } 
    });
  };

  return (
    <div>
      <RecruiterNavbar />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Upload
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <Briefcase className="text-blue-500 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">
              Recommended Profession: <span className="text-blue-600">{prediction}</span>
            </h1>
          </div>
          
          <p className="text-gray-600 mb-6">
            Based on your resume, we've identified these job opportunities that match your skills and experience.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              High Match
            </div>
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {jobRecommendations.length} Opportunities
            </div>
          </div>
          <button
              onClick={handleViewAnalysis}
              className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart2 className="mr-2" size={18} />
              View Detailed Analysis
            </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Jobs</h2>
        
        <div className="space-y-4">
          {jobRecommendations.map((job, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company} • {job.location}</p>
                </div>
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="mr-1" size={14} />
                  {job.match} Match
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex flex-wrap justify-between items-center">
                <div className="text-gray-700">
                  <span className="font-medium">{job.salary}</span> • {job.type}
                </div>
                <div className="text-gray-500 text-sm">
                  Posted {job.posted}
                </div>
              </div>
              
              <a 
                href={job.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-between text-blue-600 hover:text-blue-800 font-medium py-2 border-t border-gray-100"
              >
                View Details
                <ChevronRight size={18} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Next Steps</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
              <span className="text-gray-700">Refine your resume with keywords from these job descriptions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
              <span className="text-gray-700">Set up job alerts for "{prediction}" positions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
              <span className="text-gray-700">Connect with recruiters specializing in this field</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default JobRecommendations;