import React, { useState } from 'react';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [dob, setDob] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role, firstName, middleName, lastName, username, dob, mobileNumber }),
            });

            if (response.ok) {
                // Redirect to login page
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                alert('Registration failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const sharedInputClasses = 'w-full p-2 border border-border rounded';
    const sharedLabelClasses = 'block text-muted-foreground';
    const bgZinc100 = 'bg-zinc-100';
    const bgWhiteOpacity90 = 'bg-white bg-opacity-90';

    return (
        <div className={`flex items-center justify-center min-h-screen ${bgZinc100}`} style={{ backgroundImage: "url('https://img.lovepik.com/photo/45009/7677.jpg_wh860.jpg')", backgroundSize: 'cover' }}>
            <div className={`bg-card p-8 rounded-lg shadow-lg w-full max-w-md ${bgWhiteOpacity90}`} style={{ marginTop: '50px', marginBottom: '50px' }}>
                <h2 className="text-2xl font-semibold text-center">Registration Form</h2>
                <form onSubmit={handleRegister} className="mt-4 space-y-4">
                    <div className='row'>
                        <div className='col'>
                            <label className={sharedLabelClasses} htmlFor="firstname">
                                First Name
                            </label>
                            <input className={sharedInputClasses} type="text" id="firstname" placeholder="Enter first name" onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className='col'>
                            <label className={sharedLabelClasses} htmlFor="middleName">
                                Middle Name
                            </label>
                            <input className={sharedInputClasses} type="text" id="middleName" placeholder="Enter Middle name" onChange={(e) => setMiddleName(e.target.value)} required />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <label className={sharedLabelClasses} htmlFor="lastName">
                                Last Name
                            </label>
                            <input className={sharedInputClasses} type="text" id="lastName" placeholder="Enter Last name" onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <div className='col'>
                            <label className={sharedLabelClasses} htmlFor="username">
                                Username
                            </label>
                            <input className={sharedInputClasses} type="text" id="username" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className={sharedLabelClasses} htmlFor="email">
                            Email
                        </label>
                        <input className={sharedInputClasses} type="email" id="email" placeholder="Enter email address" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className={sharedLabelClasses} htmlFor="password">
                            Password
                        </label>
                        <input className={sharedInputClasses} type="password" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <label className={sharedLabelClasses} htmlFor="mobile">
                            Mobile Number
                        </label>
                        <input className={sharedInputClasses} type="tel" id="mobile" placeholder="Enter mobile number" onChange={(e) => setMobileNumber(e.target.value)} required />
                    </div>
                    <div>
                        <label className={sharedLabelClasses} htmlFor="dob">
                            Birth Date
                        </label>
                        <input className={sharedInputClasses} type="date" id="dob" onChange={(e) => setDob(e.target.value)} required />
                    </div>

                    <div>
                        <label className={sharedLabelClasses}>Role</label>
                        <div className="flex items-center">
                            <label className="mr-4">
                                <input type="radio" name="role" value="user" className="mr-1" onChange={(e) => setRole(e.target.value)} required /> User
                            </label>
                            <label>
                                <input type="radio" name="role" value="admin" className="mr-1" onChange={(e) => setRole(e.target.value)} required /> Admin
                            </label>
                            <label className="ml-4">
                                <input type="radio" name="role" value="company" className="mr-1" onChange={(e) => setRole(e.target.value)} required /> Company
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/80">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;
