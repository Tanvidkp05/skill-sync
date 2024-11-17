import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import RecruiterNavbar from '../recruiterNavbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DropdownJob from '../dropdownJob';
import axios from 'axios';
import { Document, Page } from 'react-pdf'; // Using react-pdf to render the PDF

const ViewAppl = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [openPdf, setOpenPdf] = useState(null); // State to track which PDF is opened
  const navigate = useNavigate();

  const handleDropdownClick = (job) => {
    if (selectedJobId === job) {
      setShowDropdown(false);
      setSelectedJobId(null);
    } else {
      setShowDropdown(true);
      setSelectedJobId(job);
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
    else{
      console.log("no error");
      
    }
      const response = await axios.get('http://localhost:5000/api/jobpostings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setApplicationDetails(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

  // Handler to display the PDF for each job posting
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Open the selected PDF in a modal
  const handlePdfClick = (pdfFile) => {
    setOpenPdf(pdfFile);
  };

  // Close the modal
  const closeModal = () => {
    setOpenPdf(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <RecruiterNavbar />
      <h1 className="text-center mb-8 mt-2 text-5xl font-semibold">Recent uploads</h1>
      <ul className="grid grid-cols-4 gap-4 justify-items-center px-20">
        {applicationDetails.length > 0 ? (
          applicationDetails.map((application) => (
            <li key={application._id} className="bg-indigo-300 p-4 rounded-3xl shadow-sm border w-full h-52 bg-opacity-80 relative">
              <div className="flex justify-end">
                <MoreVertIcon
                  className="cursor-pointer"
                  onClick={() => handleDropdownClick(application)}
                />
                {showDropdown && selectedJobId === application && (
                  <DropdownJob />
                )}
              </div>
              <Link
                to={`/view-applications/${application._id}`}
                onClick={(event) => handleLinkClick(event, application._id)}
                className="no-underline text-black"
              >
                <div className="flex justify-center mt-1">
                  <strong className="text-2xl">{application.title}</strong>
                </div>
                <br />
                <strong>Name:</strong> {application.pdfPath}
                <br />
                <strong>Date:</strong> {application.datePosted}
                <br />
              </Link>

              {application.pdfFile && (
                <div className="mt-4">
                  <button onClick={() => handlePdfClick(application.pdfFile)} className="text-blue-500 hover:underline">
                    View PDF
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No previous history</p>
        )}
      </ul>

      {/* Modal to display the PDF */}
      {openPdf && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-3/4">
            <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full">X</button>
            <Document
              file={`http://localhost:5000/${openPdf}`} // Assuming the file is served from this path
              onLoadSuccess={onLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppl;
