import { Lock, Unlock, Circle } from 'lucide-react';

const UserTable = ({ users, onToggleStatus }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Họ Tên</th>
                        <th>Vai trò (Roles)</th>
                        <th style={{ textAlign: 'center', width: '150px' }}>Trạng thái</th>
                        <th style={{ textAlign: 'center', width: '120px' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user) => {
                            const currentStatus = user.isActive !== undefined ? user.isActive : user.active;

                            return (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>
                                        {`${user.firstName || ''} ${user.lastName || ''}`}
                                    </td>
                                    <td>
                                        {user.roles?.map(role => role.name || role).join(', ')}
                                    </td>
                                    
                                    {/* ✨ THAY ĐỔI 1: Status badge với Lucide icon */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <span 
                                            className={`status ${currentStatus ? 'status-active' : 'status-locked'}`}
                                        >
                                            <Circle 
                                                size={10} 
                                                fill="currentColor" 
                                                strokeWidth={0}
                                                style={{ marginRight: '6px', verticalAlign: 'middle' }}
                                            />
                                            {currentStatus ? "Hoạt động" : "Đã khóa"}
                                        </span>
                                    </td>

                                    {/* ✨ THAY ĐỔI 2: Action button với Lucide icon */}
                                    <td className="action-buttons">
                                        <button 
                                            className={currentStatus ? "btn-lock" : "btn-unlock"}
                                            onClick={() => onToggleStatus(user.id, currentStatus)}
                                            title={currentStatus ? "Khóa tài khoản này" : "Mở khóa tài khoản này"}
                                        >
                                            {currentStatus ? (
                                                <>
                                                    <Lock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                                    Khóa
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                                    Mở
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
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