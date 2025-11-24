// components/layout/UserNavbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { 
    FaSearch, 
    FaUserCircle, 
    FaMapMarkerAlt, 
    FaCalendarAlt, 
    FaAngleDown,
    FaTicketAlt,
    FaGift
} from 'react-icons/fa';
import '../../../styles/UserNavbar.css';

const UserNavbar = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/tim-kiem?q=${encodeURIComponent(keyword.trim())}`);
            setKeyword('');
        }
    };

    return (
        <header className="main-header">
            <div className="navbar-top">
                <div className="nav-left">
                    <Link to="/" className="nav-logo">
                        <img src="/logo/cufilm1.png" alt="U-Film" />
                    </Link>
                </div>

                <div className="nav-center">
                    <Link to="/booking" className="btn-cta btn-cta-yellow">
                        <FaTicketAlt />
                        <span>Đặt vé ngay</span>
                    </Link>
                    <Link to="/concessions" className="btn-cta btn-cta-purple">
                        <FaGift />
                        <span>Đổi bắp nước</span>
                    </Link>
                </div>

                <div className="nav-right">
                    <form className="nav-search" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="Tìm phim..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            aria-label="Tìm kiếm phim"
                        />
                        <button type="submit" className="search-button" aria-label="Tìm kiếm">
                            <FaSearch size={16} />
                        </button>
                    </form>

                    {isAuthenticated && user ? (
                        <Link to="/tai-khoan" className="nav-auth"> {/* Link tới trang Profile */}
                            <FaUserCircle size={20} />
                            <span>Chào, {user.username}</span> {/* Hiển thị username */}
                        </Link>
                    ) : (
                        // 5. CHƯA ĐĂNG NHẬP: HIỂN THỊ LOGIN
                        <Link to="/login" className="nav-auth">
                            <FaUserCircle size={20} />
                            <span>Đăng nhập</span>
                        </Link>
                    )}

                    <div className="nav-lang">
                        <span>VN</span>
                        <FaAngleDown size={12} />
                    </div>
                </div>
            </div>

            <div className="navbar-bottom">
                <div className="nav-bottom-left">
                    <Link to="/theaters" className="nav-link">
                        <FaMapMarkerAlt size={16} />
                        <span>Chọn rạp</span>
                    </Link>
                    <Link to="/showtimes" className="nav-link">
                        <FaCalendarAlt size={16} />
                        <span>Lịch chiếu</span>
                    </Link>
                </div>

                <div className="nav-bottom-right">
                    <Link to="/promo" className="nav-link-sub">Khuyến mãi</Link>
                    <Link to="/events" className="nav-link-sub">Tổ chức sự kiện</Link>
                    <Link to="/services" className="nav-link-sub">Dịch vụ giải trí khác</Link>
                    <Link to="/about" className="nav-link-sub">Giới thiệu</Link>
                </div>
            </div>
        </header>
    );
};

export default UserNavbar;