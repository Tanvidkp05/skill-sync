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
                const token = data.token;
    
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', token);
    
                // Decode the token to get the role
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the payload
                const role = decodedToken.user.role;
    
                // Redirect based on the role
                if (role === 'user') {
                    window.location.href = '/user-dashboard';
                } else if (role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (role === 'company') {
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
    

    const bgZinc100 = 'bg-zinc-100';
    const bgWhiteOpacity90 = 'bg-white bg-opacity-90';
    const textZinc800 = 'text-zinc-800';
    const textZinc700 = 'text-zinc-700';
    const borderZinc300 = 'border border-zinc-300';
    const focusRing = 'focus:outline-none focus:ring focus:ring-primary';
    const primary = 'bg-primary';
    const primaryHover = 'hover:bg-primary/80';

    return (
        <div
            className={`flex items-center justify-center min-h-screen ${bgZinc100}`}
            style={{
                backgroundImage: "url('https://img.lovepik.com/photo/45009/7677.jpg_wh860.jpg')",
                backgroundSize: 'cover',
            }}
        >
            <div className={`rounded-lg shadow-lg p-8 max-w-sm w-full ${bgWhiteOpacity90}`}>
                <h2 className={`text-2xl font-semibold text-center ${textZinc800}`}>Login</h2>
                <form onSubmit={handleLogin} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="email" className={`block ${textZinc700}`}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full p-2 ${borderZinc300} rounded ${focusRing}`}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className={`block ${textZinc700}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`w-full p-2 ${borderZinc300} rounded ${focusRing}`}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className={textZinc700}>
                            Remember me
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={`w-full ${primary} text-white p-2 rounded ${primaryHover}`}
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="#" className="text-sm text-blue-500 hover:underline">
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;
