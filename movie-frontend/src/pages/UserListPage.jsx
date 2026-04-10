import React, { useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService'; 
import UserTable from '../pages/user/UserTable';
import '../styles/MovieListPage.css'; // File CSS chung
// Import các icon cho Modal
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination States
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 1. STATE QUẢN LÝ THÔNG BÁO (MODAL) ---
    const [notification, setNotification] = useState({
        show: false,
        type: '',       // 'confirm', 'success', 'error'
        message: '',
        title: '',
        dataId: null,   // Lưu ID User cần xử lý
        dataStatus: null // Lưu trạng thái hiện tại (để biết là đang Khóa hay Mở)
    });

    // Hàm tải danh sách người dùng
    const fetchUsers = useCallback(async (pageToFetch, keyword = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userService.getAllUsers(pageToFetch + 1, 10, keyword);

            if (response && response.result) {
                setUsers(response.result.data || []); 
                setTotalPages(response.result.totalPages || 0);
            } 
            else if (Array.isArray(response)) {
                setUsers(response);
                setTotalPages(1);   
            }
            else if (response && response.content) {
                setUsers(response.content);
                setTotalPages(response.totalPages || 0);
            }
            else {
                setUsers([]); 
            }

        } catch (err) {
            setError('Lỗi khi tải danh sách người dùng.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(currentPage, searchTerm); 
    }, [currentPage, fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); 
        fetchUsers(0, searchTerm); 
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(0);
        fetchUsers(0, ''); 
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // --- 2. HÀM MỞ MODAL XÁC NHẬN (Thay vì window.confirm) ---
    const handleToggleStatus = (userId, currentStatus) => {
        const actionName = currentStatus ? "KHÓA" : "MỞ KHÓA";
        
        setNotification({
            show: true,
            type: 'confirm',
            title: `Xác nhận ${actionName}`,
            message: `Bạn có chắc chắn muốn ${actionName} tài khoản này không?`,
            dataId: userId,
            dataStatus: currentStatus // Lưu lại để dùng trong hàm confirm
        });
    };

    // --- 3. HÀM THỰC HIỆN HÀNH ĐỘNG (Khi bấm Đồng ý) ---
    const confirmToggleStatus = async () => {
        const userId = notification.dataId;
        const currentStatus = notification.dataStatus;
        const actionName = currentStatus ? "KHÓA" : "MỞ KHÓA";

        // Đóng modal confirm
        closeNotification();

        try {
            await userService.toggleUserStatus(userId);
            
            // Cập nhật lại list local để UI mượt mà
            setUsers(prevUsers => prevUsers.map(user => {
                if (user.id === userId) {
                    // Logic update state tùy thuộc vào tên biến API trả về
                    if (user.isActive !== undefined) {
                        return { ...user, isActive: !user.isActive };
                    } else {
                        return { ...user, active: !user.active };
                    }
                }
                return user; 
            }));

            // Hiện thông báo thành công
            showNotification('success', 'Thành công', `Đã ${actionName} tài khoản thành công!`);

        } catch (err) {
            console.error(err);
            // Hiện thông báo lỗi
            showNotification('error', 'Lỗi', `Không thể ${actionName} tài khoản. Vui lòng thử lại.`);
            fetchUsers(currentPage); 
        }
    };

    // Helper hiển thị thông báo nhanh
    const showNotification = (type, title, message) => {
        setNotification({
            show: true,
            type: type,
            title: title,
            message: message,
            dataId: null,
            dataStatus: null
        });
    }

    const closeNotification = () => {
        setNotification({ ...notification, show: false });
    }

    const renderContent = () => {
        if (isLoading) return <p>Đang tải danh sách người dùng...</p>;
        if (error) return <p className="page-error-message">{error}</p>;
        
        return (
            <UserTable
                users={users}
                onToggleStatus={handleToggleStatus} 
                onEditClick={() => {}} 
                onDeleteClick={() => {}}
            />
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>Quản lý Người dùng</h1>
            </div>

            <div className="search-bar-container">
                <form onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="🔍 Tìm theo Username, Email hoặc SĐT..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">
                        Tìm kiếm
                    </button>
                </form>
                
                {searchTerm && (
                    <button onClick={handleClearSearch} className="btn-clear">
                        Xóa lọc
                    </button>
                )}
            </div>

            {renderContent()}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{ fontSize: '1.2rem', paddingBottom: '5px' }}
                                >
                                    <span>&laquo;</span> 
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, index) => {
                                if (index === 0 || index === totalPages - 1 || (index >= currentPage - 2 && index <= currentPage + 2)) {
                                    return (
                                        <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(index)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                }
                                if (index === currentPage - 3 || index === currentPage + 3) {
                                    return <li key={index} className="page-item disabled"><span className="page-link">...</span></li>;
                                }
                                return null; 
                            })}

                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    style={{ fontSize: '1.2rem', paddingBottom: '5px' }}
                                >
                                    <span>&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* --- 4. MODAL THÔNG BÁO (THEO STYLE MỚI) --- */}
            {notification.show && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                            {notification.type === 'confirm' && <FaExclamationTriangle color="#f0ad4e" />}
                            {notification.type === 'success' && <FaCheckCircle color="#28a745" />}
                            {notification.type === 'error' && <FaTimesCircle color="#dc3545" />}
                        </div>

                        <h3 className="modal-title">{notification.title}</h3>
                        <p className="modal-message">{notification.message}</p>

                        <div className="modal-actions">
                            {notification.type === 'confirm' ? (
                                <>
                                    <button className="btn-modal btn-cancel" onClick={closeNotification}>Hủy bỏ</button>
                                    <button className="btn-modal btn-confirm" onClick={confirmToggleStatus}>Đồng ý</button>
                                </>
                            ) : (
                                // Dùng class 'btn-close-modal' để tránh lỗi CSS Bootstrap
                                <button className="btn-modal btn-close-modal" onClick={closeNotification}>Đóng</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserListPage;