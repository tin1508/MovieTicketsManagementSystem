// components/movies/UploadPosterForm.jsx
import React, { useState, useEffect } from 'react';

const UploadPosterForm = ({ movie, onClose, onUploadSuccess, isLoading }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    
    // THAY ĐỔI 1: Khởi tạo preview bằng ảnh cũ (nếu có)
    const [preview, setPreview] = useState(movie?.posterUrl || null);
    
    const [error, setError] = useState(null);

    // (Tùy chọn) Cập nhật lại preview nếu prop movie thay đổi bên ngoài
    useEffect(() => {
        if (!selectedFile && movie?.posterUrl) {
            setPreview(movie.posterUrl);
        }
    }, [movie, selectedFile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("KIỂU FILE THỰC TẾ (MIME Type):", file.type);
            setSelectedFile(file);
            setError(null);
            // Tạo link tạm để xem trước ảnh mới
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Vui lòng chọn một file ảnh mới để thay đổi.');
            return;
        }
        onUploadSuccess(selectedFile);
    };

    return (
        <form onSubmit={handleSubmit} className="upload-poster-form">
            <p>Quản lý poster cho phim: <strong>{movie?.title}</strong></p>

            {/* Vùng chọn file */}
            <div className="form-group">
                <label 
                    htmlFor="file-upload" 
                    className="file-upload-label"
                    style={{
                        color: '#ffffff', // Hoặc '#000' nếu muốn màu đen
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)', // Đổ bóng giúp chữ sáng rõ
                        fontWeight: 'bold'
                    }}
                >
                    {selectedFile ? 'Chọn ảnh khác...' : 'Tải ảnh mới lên...'}
                </label>
                <input 
                    id="file-upload"
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                    onChange={handleFileChange} 
                />
            </div>

            {error && <p className="form-error-message">{error}</p>}

            {/* Xem trước ảnh */}
            {preview && (
                <div className="image-preview-container" style={{textAlign: 'center', marginTop: '15px'}}>
                    {/* THAY ĐỔI 2: Hiển thị chú thích rõ ràng */}
                    <p style={{fontSize: '0.9rem', color: selectedFile ? '#28a745' : '#6c757d', marginBottom: '5px'}}>
                        {selectedFile ? ' Xem trước ảnh mới:' : ' Poster hiện tại:'}
                    </p>
                    
                    <div className="image-preview">
                        <img 
                            src={preview} 
                            alt="Poster Preview" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '300px', 
                                borderRadius: '8px',
                                border: selectedFile ? '2px solid #28a745' : '1px solid #ddd' // Viền xanh nếu là ảnh mới
                            }} 
                        />
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Đóng
                </button>
                <button 
                    type="submit" 
                    className="btn-submit"
                    // Chỉ cho phép bấm submit khi ĐÃ CHỌN file mới
                    disabled={!selectedFile || isLoading}
                >
                    {isLoading ? 'Đang tải...' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
};

export default UploadPosterForm;