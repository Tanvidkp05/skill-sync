import React from 'react';

const DropdownJob = () => {
  return (
    <div className='bg-white shadow-lg z-50 p-2 absolute right-12 top-8 rounded-lg'>
      <ul className="p-0">
        <li className='p-2 hover:bg-gray-200'>
          <button className="workspace-bt">
            Edit Post
          </button>
        </li>
        <li className='p-2 hover:bg-gray-200'>
          <button className="workspace-btn">
            Delete Post
          </button>
        </li>
      </ul>
    </div>
  );
}

export default DropdownJob;
