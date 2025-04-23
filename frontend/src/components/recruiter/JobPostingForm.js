import React, { useState, useEffect } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import axios from 'axios';
import { X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

const cleanResume = (txt) => {
  let cleanText = txt.replace(/http\S+\s/g, ' ');
  cleanText = cleanText.replace(/RT|cc/g, ' ');
  cleanText = cleanText.replace(/#\S+\s/g, ' ');
  cleanText = cleanText.replace(/@\S+/g, '  ');
  cleanText = cleanText.replace(/[%s]/g, ' ', '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~');
  cleanText = cleanText.replace(/[^\x00-\x7f]/g, ' ');
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  return cleanText;
};

const JobPostingForm = ({ onClose }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  }, []);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
      setPdfFile(null);
    }
  };

  const recommendJobs = async (predictedProfession, location = 'us') => {
    const APP_ID = 'a3518aee';
    const APP_KEY = '6391052c1e6589932333925ccc12fa13';
    const country = location.toLowerCase();
    
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(predictedProfession)}&results_per_page=10`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map(job => ({
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          url: job.redirect_url,
          posted: job.created
        }));
      } else {
        return []; // No jobs found
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return []; // Return empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!pdfFile) {
      alert('Please select a PDF file before submitting.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    try {
      const token = localStorage.getItem('token');
      if(!token){
        console.log("no token found");
      }

      // Upload PDF and get prediction
      const response = await axios.post('http://localhost:5000/api/jobpostings/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log('Response from upload:', response.data);
      const result = response.data.result;
      
      if (result) {
        const prediction = result.replace('Prediction: ', '').trim();
        setPredictions([prediction]);
        
        // Get job recommendations based on prediction
        const jobs = await recommendJobs(prediction);
        setRecommendedJobs(jobs);
      } else {
        alert('No prediction found in the response.');
      }

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error uploading PDF: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold">UPLOAD PDF</h1>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X />
          </button>
        </div>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-xs font-medium">Upload PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full mt-1 p-1 border border-gray-300 rounded text-xs"
              required
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-xs"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upload PDF'}
          </button>
        </form>

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

export default JobPostingForm;