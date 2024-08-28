import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Skill-Sync</h1>
            <button onClick={() => navigate('/login')} style={{ margin: '10px', padding: '10px 20px' }}>
                Login
            </button>
            <button onClick={() => navigate('/register')} style={{ margin: '10px', padding: '10px 20px' }}>
                Register
            </button>
        </div>
    );
}

export default Landing;
