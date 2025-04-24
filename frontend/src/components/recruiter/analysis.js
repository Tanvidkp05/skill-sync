import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Briefcase } from 'lucide-react';
import RecruiterNavbar from './recruiterNavbar';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);



const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, skills, match_percent, missing_skills, skill_info } = location.state || {};

  useEffect(() => {
    console.log("State in Analysis:", location.state);
  }, [location.state]);

  const handleViewJobs = () => {
    navigate('/job-recommendations', { 
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
      
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Career Path Analysis
            </h1>
            <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Prediction Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all hover:scale-[1.01]">
          <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            Recommended Career Path
          </h2>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {prediction || 'Data Science'}
          </h1>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" 
              style={{ width: `${match_percent || 56}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            Match Confidence: {match_percent || 56}%
          </p>
        </div>
        {skills && missing_skills && skills.length > 0 && missing_skills.length > 0 && (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills vs Gaps</h2>
    <div className="h-96">
      <Radar
        data={{
          labels: [...skills, ...missing_skills],
          datasets: [
            {
              label: 'Your Skills',
              data: [...skills.map(() => 100), ...missing_skills.map(() => 0)],
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderColor: 'rgba(99, 102, 241, 1)',
              borderWidth: 2,
            },
            {
              label: 'Required Skills',
              data: [...skills.map(() => 100), ...missing_skills.map(() => 100)],
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              borderColor: 'rgba(234, 179, 8, 1)',
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { display: true },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: { stepSize: 20 },
            },
          },
        }}
      />
    </div>
  </div>
)}

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Required Skills */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills detected</p>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Skill Gaps
            </h2>
            <div className="flex flex-wrap gap-3">
              {missing_skills && missing_skills.length > 0 ? (
                missing_skills.map((skill, i) => (
                  <span 
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No additional skills recommended</p>
              )}
            </div>
          </div>
        </div>

        {/* Skill Details */}
        {skill_info && skill_info.skills && skill_info.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              <span className="text-indigo-600">Smart</span> Resume Feedback
            </h2>
            <div className="space-y-6">
              {skill_info.skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg mr-4">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {skill.name}
                      </h3>
                      <div className="mt-2 text-gray-600 space-y-2">
                        <p className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span><strong className="text-gray-800">Description:</strong> {skill.description}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span><strong className="text-gray-800">How to Learn:</strong> {skill.how_to_learn}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          <span><strong className="text-gray-800">Importance:</strong> {skill.importance}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < skill_info.skills.length - 1 && (
                    <hr className="my-4 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Upload
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Briefcase className="mr-2" size={18} />
            View Job Recommendations
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Analysis;