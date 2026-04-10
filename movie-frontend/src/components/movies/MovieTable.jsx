import React from 'react';
import { FaEdit, FaTrashAlt, FaCloudUploadAlt, FaCalendarAlt } from 'react-icons/fa';

const MovieTable = ({ movies, onEditClick, onDeleteClick, onUploadClick, onViewShowtimes }) => {
    
    const iconStyle = {
        width: '14px',
        height: '14px',
        verticalAlign: 'middle',
        marginRight: '6px'
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th style={{ width: '25%' }}>Tên Phim</th>
                        <th style={{ width: '15%' }}>Đạo diễn</th>
                        <th style={{ width: '10%' }}>Năm</th>
                        <th style={{ width: '10%' }}>Thời lượng</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Trạng thái</th>
                        <th style={{ width: '30%', textAlign: 'center' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <tr key={movie.id}>
                                <td className="font-bold" style={{ color: '#fff', fontSize: '1.05rem' }}>
                                    {movie.title}
                                </td>
                                
                                <td>{movie.director}</td>
                                
                                <td>{new Date(movie.releaseDate).getFullYear()}</td>
                                
                                <td>{movie.duration} phút</td>
                                
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`status ${movie.movieStatus.toLowerCase()}`}>
                                        {movie.movieStatus === 'NOW_SHOWING' ? 'Đang chiếu' : 
                                         movie.movieStatus === 'COMING_SOON' ? 'Sắp chiếu' : 'Đã chiếu'}
                                    </span>
                                </td>
                                
                                <td className="action-buttons">
                                    {/* --- NÚT LỊCH CHIẾU (Màu xanh dương + Icon lịch) --- */}
                                    <button 
                                        className="btn-showtimes" 
                                        onClick={() => onViewShowtimes(movie)}
                                        title="Xem lịch chiếu phim này"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px', 
                                            padding: '6px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            backgroundColor: '#0ea5e9', // Màu xanh dương
                                            color: 'white',
                                            marginRight: '5px'
                                        }}
                                    >
                                        <FaCalendarAlt style={{ width: '14px', height: '14px' }} /> 
                                        <span>Lịch Chiếu</span>
                                    </button>

                                    {/* --- NÚT UPLOAD (Đã hiện lại chữ) --- */}
                                    <button 
                                        className="btn-upload" 
                                        onClick={() => onUploadClick(movie)}
                                        title="Tải lên Poster"
                                    >
                                        <FaCloudUploadAlt style={iconStyle} />
                                        <span>Upload</span>
                                    </button>

                                    {/* --- NÚT SỬA (Đã hiện lại chữ) --- */}
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => onEditClick(movie)}
                                        title="Chỉnh sửa phim"
                                    >
                                        <FaEdit style={iconStyle} />
                                        <span>Sửa</span>
                                    </button>

                                    {/* --- NÚT XÓA (Đã hiện lại chữ) --- */}
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => onDeleteClick(movie)}
                                        title="Xóa phim"
                                    >
                                        <FaTrashAlt style={iconStyle} />
                                        <span>Xóa</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                Chưa có dữ liệu phim.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MovieTable;