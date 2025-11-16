import React, { useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';
import UserTable from '../pages/user/UserTable.jsx';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
// TODO: Tạo các component form AddUserForm và EditUserForm

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // TODO: State cho Modals
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Hàm tải danh sách người dùng
    const fetchUsers = useCallback(async (pageToFetch) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. 'data' bây giờ sẽ là MẢNG [...] (vì service đã "mở bọc" result)
            const data = await userService.getAllUsers(pageToFetch, 10);

            // 2. SỬA LỖI: Kiểm tra xem 'data' có phải là MẢNG không
            if (Array.isArray(data)) {
                setUsers(data);
                
                // 3. LƯU Ý VỀ PHÂN TRANG (Pagination):
                // API của bạn không trả về 'totalPages'.
                // Chúng ta tạm thời đặt là 1 trang để không bị lỗi.
                setTotalPages(1); 
                setCurrentPage(0);

            } 
            // 4. (Phòng hờ) Nếu API trả về { content: [...] }
            else if (data && data.content) {
                setUsers(data.content);
                setTotalPages(data.totalPages || 0);
            } 
            // 5. Nếu không nhận diện được
            else {
                console.error("Dữ liệu người dùng không hợp lệ:", data);
                setUsers([]);
                setTotalPages(0);
            }

        } catch (err) {
            setError('Lỗi khi tải danh sách người dùng.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []); // Bỏ 'page' khỏi dependency, vì hàm fetchUsers không đổi

    // Tải dữ liệu khi component mount hoặc đổi trang
    useEffect(() => {
        // 'currentPage' chỉ dùng để gọi lại API nếu bạn
        // muốn phân trang ở backend
        fetchUsers(currentPage); 
    }, [currentPage, fetchUsers]);


    // Tải dữ liệu khi component mount hoặc đổi trang
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, fetchUsers]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Xử lý Xóa (Ví dụ) ---
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.id);
            // Tải lại trang đầu tiên
            fetchUsers(0); 
            setCurrentPage(0);
        } catch (err) {
            setError('Lỗi khi xóa người dùng.');
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    // --- TODO: Xử lý Sửa ---
    const handleEditClick = (user) => {
        // setCurrentUserToEdit(user);
        // setIsEditModalOpen(true);
        alert(`Sửa người dùng: ${user.username}`); // Tạm thời
    };


    // Render nội dung
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
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>Quản lý Người dùng</h1>
                {/* <button className="btn-add-new" onClick={() => {}}>
                    + Thêm Người dùng
                </button> */}
            </div>

            {renderContent()}

            {!isLoading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modal Xác nhận Xóa */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                title="Xác nhận Xóa Người dùng"
            >
                <div className="confirm-delete-content">
                    <p>Bạn có chắc chắn muốn xóa người dùng
                        <strong> "{userToDelete?.username}"</strong>?
                    </p>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancelDelete}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn-submit-danger"
                            onClick={handleConfirmDelete}
                        >
                            Xác nhận Xóa
                        </button>
                    </div>
                </div>
            </Modal>

            {/* TODO: Thêm Modal Sửa Người dùng (EditUserForm) */}

        </div>
    );
};

export default UserListPage;