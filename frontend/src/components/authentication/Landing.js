import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Skill-Sync</h1>
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-500 text-white px-4 py-2 rounded-md m-4"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="bg-blue-500 text-white px-4 py-2 rounded-md m-4"
      >
        Register
      </button>
    </div>
  );
}

export default Landing;