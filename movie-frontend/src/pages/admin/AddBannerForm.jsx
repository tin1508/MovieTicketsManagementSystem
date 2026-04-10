import React, { useState, useEffect } from 'react';
// Import CSS chung để ăn theo style Glassmorphism
import '../../styles/MovieListPage.css'; 
import '../../styles/Modal.css';

const AddBannerForm = ({ onAddBanner, onClose, isLoading }) => {
    const [title, setTitle] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [displayOrder, setDisplayOrder] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

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

        const formData = new FormData();
        formData.append('title', title);
        formData.append('targetUrl', targetUrl);
        formData.append('displayOrder', displayOrder);
        formData.append('file', selectedFile);

        onAddBanner(formData);
    };

    return (
        // Thêm class 'wide-form' để bỏ viền và ăn theo layout rộng của Modal
        <form onSubmit={handleSubmit} className="add-movie-form wide-form">
            
            {error && <div className="error-message" style={{marginBottom: '20px'}}>{error}</div>}

            {/* Layout Grid 2 cột */}
            <div className="form-grid-layout" style={{ gap: '30px' }}>
                
                {/* --- CỘT TRÁI: Nhập liệu --- */}
                <div className="form-column">
                    <div className="form-group">
                        <label>Tiêu đề Banner <span className="required">*</span></label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="VD: Phim Hot Tháng 11"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Link Đích (Target URL) <span className="required">*</span></label>
                        <input 
                            type="text" 
                            value={targetUrl} 
                            onChange={(e) => setTargetUrl(e.target.value)} 
                            placeholder="VD: /phim/lat-mat-7"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Thứ tự hiển thị</label>
                        <input 
                            type="number" 
                            value={displayOrder} 
                            onChange={(e) => setDisplayOrder(e.target.value)} 
                            min="1"
                            placeholder="VD: 1"
                        />
                    </div>
                </div>

                {/* --- CỘT PHẢI: Upload Ảnh --- */}
                <div className="form-column">
                     <div className="form-group" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <label>Ảnh Banner (Tỉ lệ ngang) <span className="required">*</span></label>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {/* Nút chọn ảnh */}
                            <label 
                                htmlFor="banner-upload" 
                                className="file-upload-label" 
                                style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', margin: 0 }}
                            >
                                <i className="fas fa-cloud-upload-alt"></i> Chọn ảnh...
                            </label>
                            <input 
                                id="banner-upload" 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} 
                            />

                            {/* Khung Preview */}
                            <div className="image-preview" style={{ flex: 1, minHeight: '150px', margin: 0 }}>
                                {preview ? (
                                    <img 
                                        src={preview} 
                                        alt="Banner Preview" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                                    />
                                ) : (
                                    <div style={{textAlign: 'center', color: '#aaa'}}>
                                        <p>Chưa có ảnh</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
                    Hủy
                </button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Đang lưu...' : 'Lưu Banner'}
                </button>
            </div>
        </form>
    );
};

export default AddBannerForm;