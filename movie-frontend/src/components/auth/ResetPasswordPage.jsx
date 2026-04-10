import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import '../../styles/Auth.css';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!token) return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2 className="auth-title" style={{color:'#ef4444'}}>Lỗi Token</h2>
                <p className="auth-subtitle">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
            </div>
        </div>
    );

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setMessage("Đổi mật khẩu thành công! Đang chuyển hướng...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Token có thể đã hết hạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <h2 className="auth-title">Đặt Lại Mật Khẩu</h2>
                <p className="auth-subtitle">Vui lòng nhập mật khẩu mới của bạn</p>
                
                <form onSubmit={handleReset}>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Mật khẩu mới" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="auth-input"
                            placeholder="Nhập lại mật khẩu mới" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
                    </button>
                </form>
                
                {message && <div className="auth-message message-success">{message}</div>}
                {error && <div className="auth-message message-error">{error}</div>}
            </div>
        </div>
    );
};

export default ResetPasswordPage;