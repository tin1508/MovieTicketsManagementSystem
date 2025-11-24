import React, { useState, useEffect, useCallback } from 'react';
import * as bannerService from '../../services/bannerService';
import Modal from '../../components/common/Modal';
import AddBannerForm from './AddBannerForm';
// Import CSS giao diện Admin
import '../../styles/MovieListPage.css'; 

const BannerManagementPage = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State cho Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // 1. Tải danh sách
    const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await bannerService.getAllBanners();
            setBanners(data || []);
        } catch (err) {
            setError('Lỗi khi tải danh sách banner.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    // 2. Xử lý Thêm
    const handleAddBanner = async (formData) => {
        setIsAdding(true);
        try {
            await bannerService.createBanner(formData);
            await fetchBanners();
            setIsAddModalOpen(false);
        } catch (err) {
            alert('Thêm thất bại: ' + err.message);
        } finally {
            setIsAdding(false);
        }
    };

    // 3. Xử lý Xóa
    const handleDeleteClick = (banner) => {
        setBannerToDelete(banner);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        try {
            await bannerService.deleteBanner(bannerToDelete.id);
            await fetchBanners();
            setIsDeleteModalOpen(false);
            setBannerToDelete(null);
        } catch (err) {
            alert('Xóa thất bại.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 style={{ color: '#fff' }}>Quản lý Banner</h1>
                {/* Nút màu VÀNG (từ CSS mới) */}
                <button className="btn-add-new" onClick={() => setIsAddModalOpen(true)}>
                    + Thêm Banner Mới
                </button>
            </div>

            {error && <p className="page-error-message">{error}</p>}
            
            {isLoading ? (
                <p style={{ color: '#fff' }}>Đang tải...</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ảnh Preview</th>
                                <th>Tiêu đề</th>
                                <th>Link Đích</th>
                                <th>Thứ tự</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length > 0 ? (
                                banners.map((banner) => (
                                    <tr key={banner.id}>
                                        <td>
                                            <img 
                                                src={banner.imageUrl} 
                                                alt="preview" 
                                                style={{ width: '150px', borderRadius: '4px', border: '1px solid #333' }} 
                                            />
                                        </td>
                                        <td style={{ color: '#e0e0e0' }}>{banner.title}</td>
                                        <td style={{ color: '#e0e0e0' }}>{banner.targetUrl}</td>
                                        <td style={{ color: '#e0e0e0' }}>{banner.displayOrder}</td>
                                        <td className="action-buttons">
                                            {/* Nút Xóa màu ĐỎ */}
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteClick(banner)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>
                                        Chưa có banner nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Thêm */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm Banner Mới"
            >
                <AddBannerForm 
                    onAddBanner={handleAddBanner}
                    onClose={() => setIsAddModalOpen(false)}
                    isLoading={isAdding}
                />
            </Modal>

            {/* Modal Xóa */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Xác nhận Xóa"
            >
                <div className="confirm-delete-content">
                    <p>Bạn có chắc muốn xóa banner: <strong>{bannerToDelete?.title}</strong>?</p>
                    <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Hủy</button>
                        <button className="btn-submit-danger" onClick={confirmDelete}>Xóa</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BannerManagementPage;