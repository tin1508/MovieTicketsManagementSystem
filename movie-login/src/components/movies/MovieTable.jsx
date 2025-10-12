import React from 'react';
import '../../styles/MovieListPage.css'; // Sẽ tạo file này sau

const MovieTable = ({ movies }) => {
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
                            <td>{movie.genre}</td>
                            <td>
                                <span className={`status ${movie.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {movie.status}
                                </span>
                            </td>
                            <td className="action-buttons">
                                <button className="btn-edit">Sửa</button>
                                <button className="btn-delete">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieTable;