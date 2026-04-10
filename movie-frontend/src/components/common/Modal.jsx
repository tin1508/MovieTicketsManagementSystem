import React from 'react';
import '../../styles/Modal.css';

const Modal = ({ isOpen, onClose, title, children, customClass }) => {
    if (!isOpen) {
        return null;
    }

    // FIX: Dùng customClass thay vì className
    const modalStyle = customClass === 'modal-wide' ? {
        width: '1100px',
        maxWidth: '95vw',
        minWidth: '800px',
        height: 'auto',
        maxHeight: '95vh'
    } : {};

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className={`modal-content ${customClass || ''}`}
                style={modalStyle} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;