import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  }, []);

  const handleChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file before submitting.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("no token found");
      }

      const response = await axios.post('http://localhost:5000/api/jobpostings/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response from upload:', response.data);
      const { prediction, skills, match_percent, missing_skills, skill_info } = response.data;

if (prediction && skills) {
  console.log(skills);
  
  navigate('/prediction-result', { state: {
    prediction,
    skills,
    match_percent,
    missing_skills,
    skill_info
  } });
} else {
  alert('Prediction or skills data missing from response.');
}

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error uploading PDF: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <UploadCloud size={48} className="text-blue-500" />
                <p className="text-gray-600">
                  {pdfFile 
                    ? pdfFile.name 
                    : 'Drag & drop your PDF here or click to browse'}
                </p>
                <p className="text-sm text-gray-500">Only PDF files are accepted</p>
                <label className="cursor-pointer mt-4">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    Select File
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!pdfFile || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                pdfFile && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Analyze Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
