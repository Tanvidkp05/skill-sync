import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RecruiterNavbar from '../recruiterNavbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';

const ViewAppl = () => {
  // State declarations
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [openPdf, setOpenPdf] = useState(null);
  const navigate = useNavigate();

  // Event handlers
  const handleDropdownClick = (application) => {
    if (selectedJobId === application._id) {
      setShowDropdown(false);
      setSelectedJobId(null);
    } else {
      setShowDropdown(true);
      setSelectedJobId(application._id);
    }
  };

  const handleLinkClick = (event, jobid) => {
    if (event.target.tagName !== 'BUTTON') {
      navigate(`/view-applications/${jobid}`);
    }
  };

  const fetchJobPostings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token not found in localStorage');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/jobpostings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setApplicationDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setIsLoading(false);
    }
  };

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePdfClick = (pdfFile) => {
    setOpenPdf(pdfFile);
  };

  const closeModal = () => {
    setOpenPdf(null);
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <RecruiterNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-center mb-12 text-4xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Recent Uploads
          </span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicationDetails.length > 0 ? (
              applicationDetails.map((application) => (
                <div 
                  key={application._id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-visible border border-gradient-to-r from-blue-500 to-pink-500"
                >
                  <div className="p-6 bg-pink-100 rounded-2xl opacity-90">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          to={`/view-applications/${application._id}`}
                          onClick={(event) => handleLinkClick(event, application._id)}
                          className="hover:text-purple-600 transition-colors duration-200"
                        >
                          <h2 className="text-2xl font-semibold text-black mb-4">
                            {application.title}
                          </h2>
                        </Link>

                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <div className="w-6 h-6 mr-2 text-purple-500">
                              <FontAwesomeIcon icon={faUser} />
                            </div>
                            <span>{application.pdfPath}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <div className="w-6 h-6 mr-2 text-blue-500">
                              <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <span>
                              {application.datePosted 
                                ? new Date(application.datePosted).toLocaleDateString() 
                                : 'No date available'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <button 
                          onClick={() => handleDropdownClick(application)}
                          className="p-2 hover:bg-purple-50 rounded-full transition-colors duration-200 text-gray-500 hover:text-purple-600"
                        >
                          <MoreVertIcon />
                        </button>

                        {showDropdown && selectedJobId === application._id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                            <div className="py-1">
                              <button className="block w-full px-4 py-1 text-left hover:bg-gray-50 text-gray-700">
                                Edit Post
                              </button>
                              <button className="block w-full px-4 py-1 text-left hover:bg-gray-50 text-gray-700">
                                Delete Post
                              </button>
                              
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {application.pdfFile && (
                      <button 
                        onClick={() => handlePdfClick(application.pdfFile)}
                        className="mt-4 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 rounded-lg hover:from-purple-100 hover:to-blue-100 transition-all duration-200 border border-purple-100 hover:border-purple-200"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                        <span>View PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No job postings available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {openPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative">
            <button 
              onClick={closeModal}
              className="absolute -top-3 -right-3 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
            >
              ×
            </button>
            
            <div className="p-4 h-[80vh] overflow-y-auto">
              <Document
                file={`http://localhost:5000/${openPdf}`}
                onLoadSuccess={onLoadSuccess}
              >
                <Page pageNumber={pageNumber} width={800} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppl;