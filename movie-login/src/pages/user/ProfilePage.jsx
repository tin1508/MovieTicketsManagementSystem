import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import '../../styles/ProfilePage.css';
import { FaKey, FaHistory, FaUserEdit } from 'react-icons/fa'; 

// Import component Lịch sử (Đảm bảo đường dẫn đúng với nơi bạn tạo file ở Bước 2)
import MyBookingHistory from '../../components/profile/MyBookingHistory.jsx'; 

// --- FORM THÔNG TIN ---
const ProfileInfoForm = ({ profile, onProfileUpdate }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '', phoneNumber: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
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

    const handleNameChange = (e) => {
        const fullName = e.target.value;
        const [first, ...last] = fullName.split(' ');
        setFormData({ ...formData, firstName: first || '', lastName: last.join(' ') || '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        // 1. Xử lý dữ liệu trước khi gửi (QUAN TRỌNG)
        // Nếu ngày sinh rỗng, phải chuyển thành NULL, không được để string rỗng ""
        const { email, ...updateData } = formData;
        const payload = {
            ...updateData,
            dob: formData.dob === "" ? null : formData.dob 
        };

        console.log("Data đang gửi đi:", payload); // Bật F12 xem dòng này có hiện không

        try {
            // Gọi API
            await userService.updateMyProfile(payload);
            
            setMessage({ type: 'success', text: 'Lưu thông tin thành công!' });
            
            // Reload lại dữ liệu mới nhất
            if (onProfileUpdate) onProfileUpdate();

        } catch (err) {
            console.error("Lỗi cập nhật:", err); // Xem lỗi đỏ trong Console
            
            // Ưu tiên lấy message từ Backend trả về
            const serverMsg = err.response?.data?.message;
            const errorMsg = serverMsg || err.message || 'Cập nhật thất bại.';
            
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-box">
            <div className="profile-box-header">
                <h3><FaUserEdit style={{marginRight:'8px'}}/> Thông tin cá nhân</h3>
            </div>
            {message.text && (
                <div className={message.type === 'error' ? 'form-error-message' : 'form-success-message'} style={{marginBottom:'1.5rem'}}>
                    {message.text}
                </div>
            )}
            <div className="form-grid two-cols">
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input type="text" value={`${formData.firstName} ${formData.lastName}`} onChange={handleNameChange} />
                </div>
                <div className="form-group">
                    <label>Ngày sinh</label>
                    <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email} disabled style={{opacity: 0.7, cursor: 'not-allowed'}} />
                </div>
            </div>
            <div className="form-actions-group">
                <button type="submit" className="btn-submit-profile" disabled={isLoading}>{isLoading ? 'Đang lưu...' : 'LƯU THÔNG TIN'}</button>
                <button type="button" className="btn-logout-profile" onClick={logout}>ĐĂNG XUẤT</button>
            </div>
        </form>
    );
};

// --- FORM ĐỔI MẬT KHẨU ---
const ChangePasswordForm = () => {
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return;
        }
        setIsLoading(true); setMessage({ type: '', text: '' });
        try {
            await userService.changePassword(passData.oldPassword, passData.newPassword);
            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang đăng xuất...' });
            setTimeout(logout, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại.' });
        } finally { setIsLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-box">
            <div className="profile-box-header"><h3>Đổi mật khẩu</h3></div>
            {message.text && (
                <div className={message.type === 'error' ? 'form-error-message' : 'form-success-message'} style={{marginBottom:'1.5rem'}}>
                    {message.text}
                </div>
            )}
            <div className="form-group"><label>Mật khẩu cũ *</label><input type="password" value={passData.oldPassword} onChange={(e)=>setPassData({...passData, oldPassword: e.target.value})} required /></div>
            <div className="form-group"><label>Mật khẩu mới *</label><input type="password" value={passData.newPassword} onChange={(e)=>setPassData({...passData, newPassword: e.target.value})} required /></div>
            <div className="form-group"><label>Xác thực mật khẩu *</label><input type="password" value={passData.confirmPassword} onChange={(e)=>setPassData({...passData, confirmPassword: e.target.value})} required /></div>
            <div className="form-actions-left">
                <button type="submit" className="btn-submit-profile" disabled={isLoading}>{isLoading ? 'Đang xử lý...' : 'XÁC NHẬN ĐỔI'}</button>
            </div>
        </form>
    );
};

// --- TRANG CHÍNH ---
const ProfilePage = () => {
    const { user } = useAuth(); 
    const [profile, setProfile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(''); // '' | 'PASSWORD' | 'HISTORY'

    const loadProfileData = useCallback(async () => {
        if (!user) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await userService.getMyProfile();
            setProfile(data || {});
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    }, [user]); 
    
    useEffect(() => { loadProfileData(); }, [loadProfileData]); 

    if (isLoading && !profile) return <div className="homepage-container"><p style={{color:'white', textAlign:'center', marginTop:'50px'}}>Đang tải hồ sơ...</p></div>;

    const toggleSection = (section) => setActiveSection(activeSection === section ? '' : section);

    return (
        <div className="homepage-container"> 
            <h1 className="main-page-title">HỒ SƠ KHÁCH HÀNG</h1>
            
            {/* THANH ĐIỀU HƯỚNG */}
            <div style={{display:'flex', justifyContent:'center', gap:'15px', marginBottom:'30px'}}>
                 <button 
                    className={activeSection === 'PASSWORD' ? 'active-btn-profile' : 'btn-outline-profile'}
                    onClick={() => toggleSection('PASSWORD')}
                    style={{padding:'10px 20px', borderRadius:'30px', border:'1px solid #F4F169', background: activeSection === 'PASSWORD' ? '#F4F169' : 'transparent', color: activeSection === 'PASSWORD' ? '#000' : '#F4F169', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px'}}
                 >
                    <FaKey /> Đổi mật khẩu
                 </button>

                 <button 
                    className={activeSection === 'HISTORY' ? 'active-btn-profile' : 'btn-outline-profile'}
                    onClick={() => toggleSection('HISTORY')}
                    style={{padding:'10px 20px', borderRadius:'30px', border:'1px solid #F4F169', background: activeSection === 'HISTORY' ? '#F4F169' : 'transparent', color: activeSection === 'HISTORY' ? '#000' : '#F4F169', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px'}}
                 >
                    <FaHistory /> Lịch sử vé
                 </button>
            </div>
            
            <div className="profile-layout">
                {/* 1. Form thông tin (Luôn hiện) */}
                <ProfileInfoForm profile={profile} onProfileUpdate={loadProfileData} />

                {/* 2. Đổi mật khẩu (Accordion) */}
                <div className={`password-accordion ${activeSection === 'PASSWORD' ? 'open' : ''}`}>
                    <ChangePasswordForm />
                </div>

                {/* 3. Lịch sử vé (Accordion) - MỚI */}
                <div className={`history-accordion ${activeSection === 'HISTORY' ? 'open' : ''}`} 
                     style={{overflow:'hidden', transition:'all 0.4s ease', maxHeight: activeSection === 'HISTORY' ? '2000px' : '0', opacity: activeSection === 'HISTORY' ? 1 : 0}}>
                    <div style={{paddingTop: '20px'}}>
                        <MyBookingHistory />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;