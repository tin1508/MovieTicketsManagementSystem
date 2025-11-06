import React from 'react';
import '../../styles/MovieListPage.css'; // Sẽ tạo file này sau

const MovieTable = ({ movies, onEditClick, onDeleteClick }) => {
    const statusTranslations = {
        'COMING_SOON': 'Sắp chiếu',
        'NOW_SHOWING': 'Đang chiếu',
        'ENDED': 'Đã kết thúc'
    };
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Phim</th>
                        <th>Đạo diễn</th>
                        <th>Thể loại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>
                            <td>{movie.title}</td>
                            <td>{movie.director}</td>
                            <td>{Array.isArray(movie.genres) ? movie.genres.map(g => g.name).join(', ') : ''}</td>
                            <td>
                                <span className={`status ${(movie.movieStatus || '').toLowerCase()}`}>
                                    {statusTranslations[movie.movieStatus] || movie.movieStatus || "N/A"}
                                </span>
                            </td>
                            <td className="action-buttons">
                                <button className="btn-edit" onClick={() => onEditClick(movie)}>Sửa</button>
                                <button className="btn-delete" onClick={() => onDeleteClick(movie)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieTable;