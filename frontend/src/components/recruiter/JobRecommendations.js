import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const JobRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { predictions, recommendedJobs } = location.state || { predictions: [], recommendedJobs: [] };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold">JOB RECOMMENDATIONS</h1>
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            <X />
          </button>
        </div>

        {predictions.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-sm">Predicted Profession:</h2>
            <ul className="list-disc ml-4 text-sm">
              {predictions.map((profession, index) => (
                <li key={index}>{profession}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendedJobs.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-sm">Recommended Jobs:</h2>
            <div className="overflow-y-auto max-h-60 space-y-3 mt-2 p-2 border rounded-lg">
              {recommendedJobs.map((job, index) => (
                <div key={index} className="border p-3 rounded-lg bg-gray-50">
                  <h3 className="font-medium">
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {job.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-xs">{job.company} • {job.location}</p>
                  <p className="text-gray-700 text-sm mt-1">{job.description.substring(0, 150)}...</p>
                  <p className="text-gray-500 text-xs mt-1">Posted: {new Date(job.posted).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedJobs.length === 0 && predictions.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            No job recommendations found for this profession.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;