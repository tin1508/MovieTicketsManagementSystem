// components/layout/UserFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Import icons
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
// Import CSS
import '../../../styles/UserFooter.css'; // Sẽ tạo file CSS sau

const UserFooter = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                
                {/* CỘT 1: LIÊN HỆ */}
                <div className="footer-column">
                    <h4>Liên hệ với chúng tôi</h4>
                    <p>
                        <MdLocationOn />
                        <span>123 Đường ABC, Phường X, Quận Y, TP. Z</span>
                    </p>
                    <p>
                        <MdPhone />
                        <span>0909.123.456</span>
                    </p>
                    <p>
                        <MdEmail />
                        <span>hcmusbookingservice@gmail.com</span>
                    </p>
                </div>

                {/* CỘT 2: VỀ CHÚNG TÔI (Copy từ header) */}
                <div className="footer-column">
                    <h4>Về MYSTAR</h4>
                    <Link to="/about" className="footer-link">Giới thiệu</Link>
                    <Link to="/services" className="footer-link">Dịch vụ giải trí khác</Link>
                    <Link to="/events" className="footer-link">Tổ chức sự kiện</Link>
                    <Link to="/promo" className="footer-link">Khuyến mãi</Link>
                </div>

                {/* CỘT 3: MẠNG XÃ HỘI */}
                <div className="footer-column">
                    <h4>Kết nối</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://youtube.com" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaYoutube size={24} />
                        </a>
                        <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                    </div>
                </div>

            </div>
            <div className="footer-bottom">
                <p>Movie Booking System Footer © 2025. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default UserFooter;