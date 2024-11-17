import React, { useState, useEffect } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import axios from 'axios';
import { X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; // Ensure you have pdfjs-dist installed

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

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js'; 

const JobPostingForm = ({ onClose }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Ensure workerSrc is set correctly for pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
          
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
      setPdfFile(null);
    }
  };

  const extractKeywordsFromResume = async (file) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const numPages = pdf.numPages;
        let textContent = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const textItems = text.items.map(item => item.str);
          textContent += textItems.join(' ') + ' ';
        }

        const cleanedText = cleanResume(textContent);
        const keywords = cleanedText.split(/\s+/).filter(word => word.length > 3);
        resolve(keywords);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    try {
      const token = localStorage.getItem('token');
      if(!token){
        console.log("no token found");
      }

      const response = await axios.post('http://localhost:5000/api/jobpostings/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Send the token in the headers
          'Content-Type': 'multipart/form-data',  // Indicate that you're sending form data
        },
      });
    
      console.log('Response from upload:', response.data);
      const result = response.data.result; // Access the 'result' field
    if (result) {
      const prediction = result.replace('Prediction: ', '').trim(); // Clean the text
      setPredictions([prediction]); // Update the state with the cleaned prediction
    } else {
      alert('No prediction found in the response.');
    }

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error uploading PDF: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
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
          >
            Upload PDF
          </button>
        </form>

        {predictions.length > 0 && (
  <div className="mt-4">
    <h2 className="font-semibold text-sm">Predicted Professions:</h2>
    <ul className="list-disc ml-4 text-sm">
      {predictions.map((profession, index) => (
        <li key={index}>{profession}</li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default JobPostingForm;
