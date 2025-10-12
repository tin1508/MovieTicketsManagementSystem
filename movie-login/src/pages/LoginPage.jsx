import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from '../context/AuthContext'; // ✅ thêm dòng này

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // ✅ lấy hàm login từ context

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        console.log('Đang gửi thông tin:', { username, password });

        setTimeout(() => {
            if (username === 'admin' && password === '123456') {
                console.log('Đăng nhập thành công!');
                
                // ✅ Gọi login() để cập nhật trạng thái vào context
                login({ username });

                // ✅ Chuyển sang trang dashboard
                navigate('/dashboard'); 
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Đăng Nhập Hệ Thống</h2>
                    <p>Chào mừng bạn trở lại!</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập của bạn"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                    </div>
                    <div className="form-options">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" className="forgot-password">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>
                <div className="signup-link">
                    <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
