import React from 'react';
import { X } from 'lucide-react';

const JobPostingForm = ({ onClose }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-white p-4 rounded-lg shadow-lg w-full max-w-sm'>
        <div className='flex justify-between items-center mb-2'>
          <h1 className='text-lg font-semibold'>POST JOB</h1>
          <button onClick={onClose} className='text-gray-600 hover:text-gray-900'>
            <X />
          </button>
        </div>
        <form className='space-y-2'>
          {/* Form Fields */}
          {/* Job Title */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Job Title:</label>
            <input
              type='text'
              name='title'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
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
            />
          </div>

          {/* Status */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Status:</label>
            <select
              name='status'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
            >
              <option value='open'>Open</option>
              <option value='closed'>Closed</option>
            </select>
          </div>

          {/* Recruiter ID */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Recruiter ID:</label>
            <input
              type='text'
              name='recruiterid'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
            />
          </div>

          {/* Application Link */}
          <div>
            <label className='block text-gray-700 text-xs font-medium'>Application Link:</label>
            <input
              type='url'
              name='application'
              className='w-full mt-1 p-1 border border-gray-300 rounded text-xs'
              required
            />
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
