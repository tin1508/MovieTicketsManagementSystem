import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';
import '../../styles/Auth.css'; // Import file CSS vừa tạo

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("1. Đã bấm nút gửi!");
        console.log("2. Email đang gửi đi:", email);
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await forgotPassword(email);
            setMessage('Link đặt lại mật khẩu đã được gửi vào email của bạn.');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2 className="auth-title">Quên Mật Khẩu?</h2>
                <p className="auth-subtitle">Nhập email để nhận link đặt lại mật khẩu</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="auth-input"
                            placeholder="Nhập email của bạn" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                    </button>
                </form>

                {message && <div className="auth-message message-success">{message}</div>}
                {error && <div className="auth-message message-error">{error}</div>}

                <div className="auth-links" style={{justifyContent: 'center', marginTop: '20px'}}>
                    <Link to="/login" className="auth-link">← Quay lại Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;