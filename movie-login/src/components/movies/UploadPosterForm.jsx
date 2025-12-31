// components/movies/UploadPosterForm.jsx
import React, { useState } from 'react';

const UploadPosterForm = ({ movie, onClose, onUploadSuccess, isLoading }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("KIỂU FILE THỰC TẾ (MIME Type):", file.type);
            setSelectedFile(file);
            setError(null);
            // Tạo link tạm để xem trước ảnh
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Vui lòng chọn một file ảnh.');
            return;
        }
        // Gọi hàm submit từ component cha (MovieListPage)
        onUploadSuccess(selectedFile);
    };

    return (
        <form onSubmit={handleSubmit} className="upload-poster-form">
            <p>Tải poster cho phim: <strong>{movie?.title}</strong></p>

            {/* Vùng chọn file */}
            <div className="form-group">
                <label htmlFor="file-upload" className="file-upload-label">
                    Chọn ảnh...
                </label>
                <input 
                    id="file-upload"
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" // Chỉ chấp nhận ảnh
                    onChange={handleFileChange} 
                />
            </div>

            {/* Hiển thị lỗi */}
            {error && <p className="form-error-message">{error}</p>}

            {/* Xem trước ảnh */}
            {preview && (
                <div className="image-preview">
                    <img src={preview} alt="Xem trước poster" />
                </div>
            )}

            {/* Nút bấm */}
            <div className="form-actions">
                <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Hủy
                </button>
                <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={!selectedFile || isLoading}
                >
                    {isLoading ? 'Đang tải...' : 'Xác nhận Tải lên'}
                </button>
            </div>
        </form>
    );
};

export default UploadPosterForm;