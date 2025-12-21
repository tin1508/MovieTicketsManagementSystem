// pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Login.css'; // Vẫn dùng file này
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login'); 
    const location = useLocation();

    const redirectAfterLogin = location.state?.from || '/';

    useEffect(() => {
        if (location.pathname === '/register') {
            setActiveTab('register');
        } else {
            setActiveTab('login');
        }
    }, [location.pathname]);

    return (
        // 1. Đổi class "login-container" thành "auth-page-container"
        <div className="auth-page-container"> 
            
            {/* 2. Đổi class "login-box" thành "auth-box" (HỘP MÀU TRẮNG) */}
            <div className="auth-box">
                
                <div className="auth-tabs">
                    <button
                        className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        ĐĂNG NHẬP
                    </button>
                    <button
                        className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        ĐĂNG KÝ
                    </button>
                </div>
                
                {/* 3. Thêm 1 div bọc nội dung (để có padding) */}
                <div className="auth-content">
                    {activeTab === 'login' ? (
                        <LoginForm redirectPath={redirectAfterLogin}/>
                    ) : (
                        <RegisterForm />
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthPage;