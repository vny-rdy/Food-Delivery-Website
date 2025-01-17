import React, { useState } from 'react';

const LoginModal = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const adminUsername = 'admin'; // Replace with your actual admin username
        const adminPassword = 'root'; // Replace with your actual admin password

        if (username === adminUsername && password === adminPassword) {
            onLogin(); // Notify the parent component of successful login
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />
                <div className="flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
