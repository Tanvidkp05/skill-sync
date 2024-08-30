import React, { useState } from 'react';
import { X } from 'lucide-react';

const JobPostingForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState(''); 
  const [location, setLocation] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [status, setStatus] = useState('Open');

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'requirements':
        setRequirements(value);
        break;
      case 'salary':
        setSalary(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'dateposted':
        setDatePosted(value);
        break;
      case 'status':
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the datePosted to dd-mm-yy format
    const [year, month, day] = datePosted.split('-');
    const formattedDate = `${day}-${month}-${year.slice(2)}`; // dd-mm-yy format

    try {
      const response = await fetch('http://localhost:5000/api/jobpostings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          requirements,
          salary,
          location,
          datePosted: formattedDate,
          status
        }),
      });

      if (response.ok) {
        console.log('Job posting created successfully');
        alert("Job posting created");
        onClose(); // Close the form
      } else {
        const errorData = await response.json();
        alert('Error in posting job: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);   
    }
  };

  return (
    <div className='fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white p-4 rounded-lg shadow-lg w-full max-w-sm'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='text-lg font-semibold'>POST JOB</h1>
          <button onClick={onClose} className='text-gray-600 hover:text-gray-900'>
            <X />
          </button>
        </div>
        <form className='space-y-2' onSubmit={handleSubmit}>
          {/* Form Fields */}
          {/* Job Title */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Job Title:</label>
            <input
              type='text'
              name='title'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
              onChange={handleChange}
            />
          </div>

          {/* Job Description */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Job Description:</label>
            <textarea
              name='description'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              rows='2'
              required
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Requirements */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Requirements:</label>
            <textarea
              name='requirements'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              rows='2'
              required
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Salary */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Salary:</label>
            <input
              type='number'
              name='salary'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Location:</label>
            <input
              type='text'
              name='location'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
              onChange={handleChange}
            />
          </div>

          {/* Date Posted */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Date Posted:</label>
            <input
              type='date'
              name='dateposted'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Status:</label>
            <select
              name='status'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
              onChange={handleChange}
            >
              <option value='Open'>Open</option>
              <option value='Closed'>Closed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-xs'
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;
