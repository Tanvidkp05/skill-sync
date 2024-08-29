import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.role === 'user') {
                    window.location.href = '/user-dashboard';
                } else if (data.role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (data.role === 'company') {
                    window.location.href = '/company-panel';
                }
            } else {
                const errorData = await response.json();
                alert('Login failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex items-center">
                    <label className="w-24 text-gray-700 font-medium">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-49 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 "
                    />
                </div>
                <div>
                    <label className="w-24 text-gray-700 font-medium">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-49 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</button>
            </form>
        </div>
    );
}

export default Login;