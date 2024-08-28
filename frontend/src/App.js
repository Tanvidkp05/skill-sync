import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import CompanyPanel from './components/CompanyPanel';
import Landing from './components/Landing';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/company-panel" element={<CompanyPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
