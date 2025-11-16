// components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const roles = await login(username, password);

            if (roles.includes('ADMIN')) {
                navigate('/dashboard');
            } else {
                navigate('/'); 
            }
        } catch (err) {
            const errMsg = err.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
            setError(errMsg);
            setIsLoading(false);
        }
    };

    return (
        <> {/* Dùng React.Fragment (thẻ rỗng) để bọc */}
            <div className="login-header">
                <h2>Đăng Nhập</h2>
                <p>Chào mừng trở lại!</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="login-username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="login-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="login-password">Mật khẩu</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </>
    );
};

export default LoginForm;