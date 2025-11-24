import React, { useState } from 'react';
// Import CSS chung (chứa .add-movie-form, .form-group...)
import '../../styles/MovieListPage.css'; 
import '../../styles/Modal.css';

const AddBannerForm = ({ onAddBanner, onClose, isLoading }) => {
    const [title, setTitle] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [displayOrder, setDisplayOrder] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!title || !targetUrl || !selectedFile) {
            setError('Vui lòng điền đầy đủ thông tin và chọn ảnh.');
            return;
        }

        // Tạo FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('targetUrl', targetUrl);
        formData.append('displayOrder', displayOrder);
        formData.append('file', selectedFile);

        onAddBanner(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="add-movie-form">
            
            {error && <div className="form-error-message">{error}</div>}

            <div className="form-group">
                <label>Tiêu đề Banner</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="VD: Phim Hot Tháng 11"
                />
            </div>

            <div className="form-group">
                <label>Link Đích (Target URL)</label>
                <input 
                    type="text" 
                    value={targetUrl} 
                    onChange={(e) => setTargetUrl(e.target.value)} 
                    placeholder="VD: /phim/dang-chieu"
                />
            </div>

            <div className="form-group">
                <label>Thứ tự hiển thị</label>
                <input 
                    type="number" 
                    value={displayOrder} 
                    onChange={(e) => setDisplayOrder(e.target.value)} 
                />
            </div>

            <div className="form-group">
                <label>Ảnh Banner (Tỉ lệ 21:9)</label>
                {/* Nút chọn ảnh màu VÀNG (từ Modal.css mới) */}
                <label htmlFor="banner-upload" className="file-upload-label">
                    Chọn ảnh...
                </label>
                <input 
                    id="banner-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    // style={{ display: 'none' }} (Đã có trong CSS)
                />
            </div>

            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Xem trước" />
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                    Hủy
                </button>
                {/* Nút Thêm màu VÀNG */}
                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Đang thêm...' : 'Thêm Banner'}
                </button>
            </div>
        </form>
    );
};

export default AddBannerForm;