package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.GenreCreationRequest;
import com.moviebooking.movie_service.dto.request.GenreUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.GenreMapper;
import com.moviebooking.movie_service.repository.GenreRepository;
import com.moviebooking.movie_service.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreService {
    GenreRepository genreRepository;
    GenreMapper genreMapper;
    MovieRepository movieRepository;

    public GenreResponse createGenre(GenreCreationRequest request){
        if(genreRepository.existsByName((request.getName()))) throw new AppException(ErrorCode.GENRE_EXISTED);

        Genre genre = genreMapper.toGenre(request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    public void deleteGenre(Long genreId){
        Genre genre =genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));

        if (movieRepository.existsByGenres_Id(genreId)){
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        genreRepository.deleteById(genreId);
    }

    public GenreResponse getGenre(Long genreId){
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
        return genreMapper.toGenreResponse(genre);
    }

    public List<GenreResponse> getAllGenres(){
        return genreRepository.findAll()
                .stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    public GenreResponse updateGenre(Long genreId, GenreUpdateRequest request){
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
        if (!genre.getName().equals(request.getName()) && genreRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.GENRE_EXISTED);
        }

        genreMapper.updateGenre(genre, request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }
}
