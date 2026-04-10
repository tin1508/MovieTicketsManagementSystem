import React, { useState, useEffect, useCallback } from 'react';
import * as bannerService from '../../services/bannerService';
import Modal from '../../components/common/Modal';
import AddBannerForm from '../../pages/admin/AddBannerForm.jsx';
import '../../styles/MovieListPage.css'; 

// ✨ Import icons từ react-icons
import { FaTrashAlt, FaPlus } from 'react-icons/fa';

const BannerManagementPage = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // Style cho icons
    const iconStyle = {
        width: '14px',
        height: '14px',
        verticalAlign: 'middle',
        marginRight: '6px'
    };

    const headerIconStyle = {
        width: '16px',
        height: '16px',
        verticalAlign: 'middle',
        marginRight: '8px'
    };

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
                <h1>Quản lý Banner</h1>
                {/* ✨ Thêm icon cho nút Add */}
                <button className="btn-add-new" onClick={() => setIsAddModalOpen(true)}>
                    <FaPlus style={headerIconStyle} />
                    Thêm Banner Mới
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
                                <th style={{ width: '170px', textAlign: 'center' }}>Ảnh Preview</th>
                                <th>Tiêu đề</th>
                                <th>Link Đích</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Thứ tự</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length > 0 ? (
                                banners.map((banner) => (
                                    <tr key={banner.id} style={{ height: '120px' }}>
                                        <td style={{ 
                                            width: '170px', 
                                            padding: '1rem',
                                            verticalAlign: 'middle'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <img 
                                                    src={banner.imageUrl} 
                                                    alt="preview" 
                                                    style={{ 
                                                        width: '150px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px', 
                                                        border: '1px solid #333'
                                                    }} 
                                                />
                                            </div>
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            {banner.title}
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            {banner.targetUrl}
                                        </td>
                                        <td style={{ 
                                            verticalAlign: 'middle',
                                            textAlign: 'center' 
                                        }}>
                                            {banner.displayOrder}
                                        </td>
                                        
                                        {/* ✨ Thêm icon cho nút Delete */}
                                        <td className="action-buttons" style={{ verticalAlign: 'middle' }}>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteClick(banner)}
                                                title="Xóa banner"
                                            >
                                                <FaTrashAlt style={iconStyle} />
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

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm Banner Mới"
                className="modal-wide"
            >
                <AddBannerForm 
                    onAddBanner={handleAddBanner}
                    onClose={() => setIsAddModalOpen(false)}
                    isLoading={isAdding}
                />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Xác nhận Xóa"
            >
                <div className="confirm-delete-content">
                    <p style={{color: '#ddd', fontSize: '1.1rem', textAlign: 'center'}}>
                        Bạn có chắc muốn xóa banner: <br/>
                        <strong style={{color: '#ff6b6b'}}>{bannerToDelete?.title}</strong>?
                    </p>
                    <div className="form-actions" style={{marginTop: '20px', justifyContent: 'center'}}>
                        <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Hủy</button>
                        <button className="btn-submit-danger" onClick={confirmDelete}>Xóa</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BannerManagementPage;