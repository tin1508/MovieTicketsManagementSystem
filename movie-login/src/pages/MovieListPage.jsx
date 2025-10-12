import React from 'react';
import MovieTable from '../components/movies/MovieTable';
import { mockMovies } from '../data/mockMovies';

const MovieListPage = () => {
    return (
        <div>
            <div className="page-header">
                <h1>Quản lý Phim</h1>
                <button className="btn-add-new">Thêm Phim Mới</button>
            </div>
            <MovieTable movies={mockMovies} />
        </div>
    );
};

export default MovieListPage;