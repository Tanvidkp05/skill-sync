import React from 'react'

const dropdownJob = () => {
  return (
    <div className='bg-white dropdown z-1000 dropdown-content'>
    <ul className="workspace-list">
      <li className='p-2'>
        <button className="workspace-btn">
          Edit Workspace
        </button>
      </li>
      <li className='p-2'>
        <button className="workspace-btn" >
          Delete Workspace
        </button>
      </li>
    </ul>
  </div>
  )
}

export default dropdownJob