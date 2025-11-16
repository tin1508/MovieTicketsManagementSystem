import React from 'react';
// Import CSS (dùng chung với trang Phim)
import '../../styles/MovieListPage.css'; 

const UserTable = ({ users, onEditClick, onDeleteClick }) => {
 return (
    <div className="table-container">
        <table>
            <thead>
                <tr>
                        {/* 1. Sửa lại tiêu đề cho khớp (5 cột) */}
                    <th>ID</th>
                    <th>Username</th>
                    <th>Họ Tên</th>
                    <th>Vai trò (Roles)</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>
                                {`${user.firstName || ''} ${user.lastName || ''}`}
                            </td>
                            <td>
                                {user.roles?.join(', ')}
                            </td>
                            
                            <td className="action-buttons">
                                <button 
                                    className="btn-edit" 
                                    onClick={() => onEditClick(user)}
                                >
                                    Sửa
                                </button>
                                <button 
                                    className="btn-delete"
                                    onClick={() => onDeleteClick(user)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                        Không tìm thấy người dùng nào.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;