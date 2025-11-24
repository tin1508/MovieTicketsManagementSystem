import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import * as authService from '../../services/authService';
import '../../styles/ProfilePage.css';
import { FaKey } from 'react-icons/fa'; // Import icon Chìa khóa

// --- COMPONENT CON 1: FORM THÔNG TIN (CÓ NÚT CHÌA KHÓA) ---
const ProfileInfoForm = ({ profile, onProfileUpdate, togglePassword, isPasswordOpen }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', phoneNumber: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { logout } = useAuth(); 

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                dob: profile.dob || '',
                phoneNumber: profile.phoneNumber || '',
                email: profile.email || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleNameChange = (e) => {
        const fullName = e.target.value;
        const [firstName, ...lastNameParts] = fullName.split(' ');
        setFormData({ ...formData, firstName: firstName || '', lastName: lastNameParts.join(' ') || '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); setError(null); setSuccess(null);
        try {
            const payload = { ...formData, dob: formData.dob || null };
            await userService.updateMyProfile(payload);
            setSuccess('Lưu thông tin thành công!');
            onProfileUpdate();
        } catch (err) {
            setError(err.message || 'Cập nhật thất bại.');
        } finally { setIsLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-box">
            {/* HEADER VỚI NÚT CHÌA KHÓA */}
            <div className="profile-box-header">
                <h3>Thông tin cá nhân</h3>
                <button 
                    type="button" 
                    className={`btn-toggle-password ${isPasswordOpen ? 'active' : ''}`}
                    onClick={togglePassword}
                    title={isPasswordOpen ? "Đóng đổi mật khẩu" : "Mở đổi mật khẩu"}
                >
                    <FaKey />
                </button>
            </div>

            {/* (Phần thông báo lỗi/thành công giữ nguyên) */}
            {error && <div className="form-error-message" style={{marginBottom:'1.5rem'}}>{error}</div>}
            {success && <div className="form-success-message" style={{marginBottom:'1.5rem'}}>{success}</div>}
            
            <div className="form-grid two-cols">
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input type="text" value={`${formData.firstName} ${formData.lastName}`} onChange={handleNameChange} />
                </div>
                <div className="form-group">
                    <label>Ngày sinh</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
            </div>

            <div className="form-actions-group">
                <button type="submit" className="btn-submit-profile" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'LƯU THÔNG TIN'}
                </button>
                <button type="button" className="btn-logout-profile" onClick={logout}>
                    ĐĂNG XUẤT
                </button>
            </div>
        </form>
    );
};

// --- COMPONENT CON 2: FORM ĐỔI MẬT KHẨU ---
const ChangePasswordForm = () => {
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { logout } = useAuth();

    const handleChange = (e) => { setPassData({ ...passData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
        setIsLoading(true); setError(null); setSuccess(null);
        try {
            await userService.changePassword(passData.oldPassword, passData.newPassword);
            setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setTimeout(() => { logout(); }, 2000);
        } catch (err) {
             const message = err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại.';
             setError(message);
        } finally { setIsLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-box">
            <div className="profile-box-header">
                <h3>Đổi mật khẩu</h3>
            </div>
            
            {error && <div className="form-error-message" style={{marginBottom:'1.5rem'}}>{error}</div>}
            {success && <div className="form-success-message" style={{marginBottom:'1.5rem'}}>{success}</div>}

            <div className="form-group"><label>Mật khẩu cũ *</label><input type="password" name="oldPassword" value={passData.oldPassword} onChange={handleChange} required /></div>
            <div className="form-group"><label>Mật khẩu mới *</label><input type="password" name="newPassword" value={passData.newPassword} onChange={handleChange} required /></div>
            <div className="form-group"><label>Xác thực mật khẩu *</label><input type="password" name="confirmPassword" value={passData.confirmPassword} onChange={handleChange} required /></div>
            
            <div className="form-actions-left">
                <button type="submit" className="btn-submit-profile" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'XÁC NHẬN ĐỔI'}
                </button>
            </div>
        </form>
    );
};

// --- COMPONENT CHÍNH ---
const ProfilePage = () => {
    const { user } = useAuth(); 
    const [profile, setProfile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State mở/đóng mật khẩu
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const loadProfileData = useCallback(async () => {
        if (!user) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const profileData = await userService.getMyProfile();
            setProfile(profileData || {});
        } catch (err) { setError('Lỗi khi tải dữ liệu.'); } finally { setIsLoading(false); }
    }, [user]); 
    
    useEffect(() => { loadProfileData(); }, [loadProfileData]); 

    if (isLoading && !profile) return <div className="homepage-container"><p style={{color:'white'}}>Đang tải...</p></div>;

    return (
        <div className="homepage-container"> 
            <h1 className="main-page-title">THÔNG TIN KHÁCH HÀNG</h1>
            {error && <p className="page-error-message">{error}</p>}
            
            <div className="profile-layout">
                {/* HỘP 1: THÔNG TIN */}
                <ProfileInfoForm 
                    profile={profile} 
                    onProfileUpdate={loadProfileData}
                    togglePassword={() => setIsPasswordOpen(!isPasswordOpen)}
                    isPasswordOpen={isPasswordOpen}
                />

                {/* HỘP 2: ĐỔI MẬT KHẨU (TRƯỢT) */}
                <div className={`password-accordion ${isPasswordOpen ? 'open' : ''}`}>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;