import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import '../../styles/ProfilePage.css'; // Import CSS

// --- HÀM HELPER: TÍNH TUỔI ---
const calculateAge = (dobString) => {
    if (!dobString) return null;
    try {
        const birthday = new Date(dobString);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (e) {
        console.error("Ngày sinh không hợp lệ:", dobString, e);
        return null;
    }
};

const ProfilePage = () => {
    const { user, logout } = useAuth(); 
    const [profile, setProfile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        phoneNumber: '', // <-- Đã thêm
        email: '',       // <-- Đã thêm
    });

    // Hàm tải dữ liệu (Chỉ tải Profile)
    const loadProfileData = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            const profileData = await userService.getMyProfile();
            setProfile(profileData || {});
        } catch (err) {
            setError('Lỗi khi tải dữ liệu trang cá nhân.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]); 
    
    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]); 

    // --- Các hàm Sửa ---
    const handleEditClick = () => {
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            dob: profile?.dob || '',
            phoneNumber: profile?.phoneNumber || '', // <-- Đã thêm
            email: profile?.email || '',       // <-- Đã thêm
        });
        setIsEditing(true); 
    };

    const handleCancelClick = () => {
        setIsEditing(false); 
        setError(null); 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const payload = {
                ...formData,
                dob: formData.dob || null 
            };
            
            await userService.updateMyProfile(payload);
            
            await loadProfileData(); 
            setIsEditing(false); 
        } catch (err) {
            setError('Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- HÀM RENDER PROFILE ---
    const renderProfile = () => {
        if (!profile && isLoading) return <p>Đang tải thông tin...</p>;
        if (error) return <p className="page-error-message">{error}</p>;
        if (!user) return null;

        // === CHẾ ĐỘ SỬA (EDIT MODE) ===
        if (isEditing) {
            return (
                <form className="profile-edit-form" onSubmit={handleSaveClick}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={user.username} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Họ</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Tên</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>

                    {/* --- THÊM 2 TRƯỜNG MỚI VÀO FORM --- */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    </div>
                    {/* ---------------------------------- */}

                    <div className="form-group">
                        <label htmlFor="dob">Ngày sinh (để tính tuổi)</label>
                        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>

                    {error && !isLoading && <p className="form-error-message">{error}</p>}

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={handleCancelClick} disabled={isLoading}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            );
        }

        // === CHẾ ĐỘ XEM (VIEW MODE) ===
        const age = calculateAge(profile?.dob);
        const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

        return (
            <div className="profile-info-box">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Họ Tên:</strong> {fullName || 'Chưa cập nhật'}</p>
                <p><strong>Tuổi:</strong> {age ? `${age} tuổi` : 'Chưa cập nhật'}</p>
                
                {/* --- THÊM 2 TRƯỜNG MỚI VÀO CHẾ ĐỘ XEM --- */}
                <p><strong>Email:</strong> {profile?.email || 'Chưa cập nhật'}</p>
                <p><strong>Điện thoại:</strong> {profile?.phoneNumber || 'Chưa cập nhật'}</p>
                {/* ------------------------------------- */}

                <p><strong>Vai trò:</strong> {user.roles?.join(', ')}</p>
                
                <div className="profile-actions">
                    <button onClick={handleEditClick} className="btn-edit">
                        Sửa thông tin
                    </button>
                    <button onClick={logout} className="btn-logout">
                        Đăng xuất
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="homepage-container"> 
            <section className="movie-section">
                <h2>Trang Cá Nhân</h2>
                {renderProfile()}
            </section>
        </div>
    );
};

export default ProfilePage;
