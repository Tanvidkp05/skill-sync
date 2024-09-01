import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recruiter from './components/recruiter/recuiter';
import ViewAppl from './components/recruiter/viewApplications/viewAppl';
import RecruiterProfile from './components/recruiter/recruiter-profile/recruiterProfile';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Landing from './components/authentication/Landing';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import ApplDetails from './components/recruiter/viewApplications/ApplDetails';
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <BrowserRouter>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company-panel" element={<Recruiter />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/view-applications" element={<ViewAppl />} />
        <Route path='/recruiter-profile' element={<RecruiterProfile />}/>
        <Route path="/view-applications/:Jtitle"
              element={<ApplDetails />}
                  />
      </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;