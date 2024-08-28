import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recruiter from './components/recruiter/recuiter';
import ViewAppl from './components/recruiter/viewApplications/viewAppl';
import RecruiterProfile from './components/recruiter/recruiter-profile/recruiterProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Recruiter />} />
        <Route path="/view-applications" element={<ViewAppl />} />
        <Route path='/recruiter-profile' element={<RecruiterProfile />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;