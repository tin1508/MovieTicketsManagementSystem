import React from 'react';
import '../../styles/Modal.css'; // Sẽ tạo file này ngay sau đây

const Modal = ({ isOpen, onClose, title, children, customClass = '' }) => {
    if (!isOpen) {
        return null; // Không render gì cả nếu modal không mở
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;