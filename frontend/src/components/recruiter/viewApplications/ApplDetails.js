import React from 'react'
import RecruiterNavbar from '../recruiterNavbar'

const ApplDetails = () => {
  return (
    <div>
        <RecruiterNavbar />
        <div className='flex flex-col justify-center text-center'>
        <h1>Details </h1>
        <br /> <br />
        <h3>Job title:</h3>
        <h3>Applicants data: </h3>
        </div>
    </div>
  )
}

export default ApplDetails