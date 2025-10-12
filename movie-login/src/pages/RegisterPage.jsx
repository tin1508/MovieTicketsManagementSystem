import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Chúng ta sẽ tái sử dụng CSS của trang Login

const RegisterPage = () => {
    const navigate = useNavigate();

    // State cho các trường input
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State cho lỗi và loading
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // --- VALIDATION PHÍA CLIENT ---
        if (!fullName || !username || !password) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        // -----------------------------

        setIsLoading(true);

        // Giả lập gọi API đăng ký
        setTimeout(() => {
            console.log('Đăng ký với thông tin:', { fullName, username, password });
            // Giả lập thành công
            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            navigate('/'); // Chuyển hướng về trang đăng nhập

            // --- Giả lập thất bại (ví dụ: username đã tồn tại) ---
            // if (username === 'admin') {
            //     setError('Tên đăng nhập đã tồn tại.');
            //     setIsLoading(false);
            // } else {
            //     alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            //     navigate('/');
            // }

        }, 1500);
    };

    return (
        <div className="login-container">
            <div className="login-box" style={{ maxWidth: '450px' }}> {/* Tăng chiều rộng một chút */}
                <div className="login-header">
                    <h2>Tạo Tài Khoản Mới</h2>
                    <p>Tham gia hệ thống quản lý phim của chúng tôi!</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="fullName">Họ và Tên</label>
                        <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>
                <div className="signup-link">
                    <p>Đã có tài khoản? <Link to="/">Đăng nhập tại đây</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;