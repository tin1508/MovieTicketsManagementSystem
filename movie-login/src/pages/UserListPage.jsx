import React, { useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService'; 
import UserTable from '../pages/user/UserTable';
import '../styles/MovieListPage.css'; // Đảm bảo bạn đã import file CSS mới

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination States
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm tải danh sách người dùng
    const fetchUsers = useCallback(async (pageToFetch, keyword = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userService.getAllUsers(pageToFetch + 1, 10, keyword);

            if (response && response.result) {
                setUsers(response.result.data || []); 
                setTotalPages(response.result.totalPages || 0); // Lấy tổng số trang từ API
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
                console.error("Dữ liệu người dùng không hợp lệ:", response);
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

    const handleToggleStatus = async (userId, currentStatus) => {
        const actionName = currentStatus ? "KHÓA" : "MỞ KHÓA";
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản này không?`);
        if (!isConfirmed) return;

        try {
            await userService.toggleUserStatus(userId);
            setUsers(prevUsers => prevUsers.map(user => {
                if (user.id === userId) {
                    if (user.isActive !== undefined) {
                        return { ...user, isActive: !user.isActive };
                    } else {
                        return { ...user, active: !user.active };
                    }
                }
                return user; 
            }));
            alert(`Đã ${actionName} tài khoản thành công!`);
        } catch (err) {
            console.error(err);
            alert(`Lỗi: Không thể ${actionName} tài khoản.`);
            fetchUsers(currentPage); 
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p>Đang tải danh sách người dùng...</p>;
        }
        if (error) {
            return <p className="page-error-message">{error}</p>;
        }
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

            {/* --- PHẦN PHÂN TRANG (PAGINATION) MỚI --- */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            
                            {/* Nút Previous */}
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    style={{ fontSize: '1.2rem', paddingBottom: '5px' }} // Chỉnh lại chút cho cân
                                >
                                    {/* Thay thẻ <i> bằng ký tự này */}
                                    <span>&laquo;</span> 
                                </button>
                            </li>

                            {/* Logic hiển thị số trang */}
                            {[...Array(totalPages)].map((_, index) => {
                                // Logic rút gọn: Chỉ hiện trang đầu, cuối, và trang xung quanh hiện tại
                                // (Để tránh bị dài quá nếu có 100 trang)
                                if (
                                    index === 0 || 
                                    index === totalPages - 1 || 
                                    (index >= currentPage - 2 && index <= currentPage + 2)
                                ) {
                                    return (
                                        <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(index)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    );
                                }
                                
                                // Hiển thị dấu "..."
                                if (
                                    index === currentPage - 3 || 
                                    index === currentPage + 3
                                ) {
                                    return <li key={index} className="page-item disabled"><span className="page-link">...</span></li>;
                                }

                                return null; 
                            })}

                            {/* Nút Next */}
                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    style={{ fontSize: '1.2rem', paddingBottom: '5px' }}
                                >
                                    {/* Thay thẻ <i> bằng ký tự này */}
                                    <span>&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
            {/* ------------------------------------------ */}
        </div>
    );
};

export default UserListPage;