// components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService'; 

// 1. Khai báo trạng thái mặc định ban đầu ở ngoài hoặc trong component
const initialFormState = {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    dob: '',
};

const RegisterForm = () => {
    const navigate = useNavigate();
    
    // 2. Sử dụng initialFormState khi khởi tạo
    const [form, setForm] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
         const { name, value } = e.target;
         setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
         event.preventDefault();
       
        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
       
         setIsLoading(true);
         setError(null);
         try {
            const {...payload } = form;
            // Xử lý logic dob rỗng
            if (!payload.dob) {
                payload.dob = null;
            }

             await registerUser(payload); 
             
             alert('Đăng ký thành công! Vui lòng đăng nhập.');
             
             // 3. Reset form về trạng thái ban đầu (trống)
             setForm(initialFormState);

             // 4. Chuyển về trang login
             navigate('/login'); 

         } catch (err) {
             const errMsg = err.result?.message || err.message || 'Lỗi không xác định';
             setError(errMsg);
         } finally {
             setIsLoading(false);
         }
    };

    return (
        <> 
            <div className="login-header">
                <h2>Đăng Ký Tài Khoản</h2>
                <p>Tạo tài khoản mới của bạn</p>
            </div>
            
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="reg-username">Tên đăng nhập *</label>
                    <input
                        type="text" name="username" id="reg-username"
                        value={form.username} onChange={handleChange} required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-password">Mật khẩu *</label>
                    <input
                        type="password" name="password" id="reg-password"
                        value={form.password} onChange={handleChange} required
                    />
                </div>
                 <div className="input-group">
                    <label htmlFor="reg-confirmPassword">Xác nhận mật khẩu *</label>
                    <input
                        type="password" name="confirmPassword" id="reg-confirmPassword"
                        value={form.confirmPassword} onChange={handleChange} required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-firstName">Họ</label>
                    <input
                        type="text" name="firstName" id="reg-firstName"
                        value={form.firstName} onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-lastName">Tên</label>
                    <input
                        type="text" name="lastName" id="reg-lastName"
                        value={form.lastName} onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-email">Email cá nhân</label>
                    <input
                        type="email" name="email" id="reg-email" // Nên để type="email"
                        value={form.email} onChange={handleChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="reg-phoneNumber">Số điện thoại</label>
                    <input
                        type="text" name="phoneNumber" id="reg-phoneNumber"
                        value={form.phoneNumber} onChange={handleChange}
                    />
                </div>
                 <div className="input-group">
                    <label htmlFor="reg-dob">Ngày sinh</label>
                    <input
                        type="date" name="dob" id="reg-dob"
                        value={form.dob} onChange={handleChange}
                    />
                </div>
                
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>
        </>
    );
};

export default RegisterForm;