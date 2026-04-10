import React from 'react';
import '../../styles/Pagination.css'; // Sẽ tạo file này sau

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                {/* Nút Về trang trước */}
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button onClick={() => onPageChange(currentPage - 1)} className="page-link">
                        &laquo;
                    </button>
                </li>

                {/* Các nút số trang */}
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                        <button onClick={() => onPageChange(number)} className="page-link">
                            {number + 1}
                        </button>
                    </li>
                ))}

                {/* Nút Tới trang sau */}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button onClick={() => onPageChange(currentPage + 1)} className="page-link">
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;