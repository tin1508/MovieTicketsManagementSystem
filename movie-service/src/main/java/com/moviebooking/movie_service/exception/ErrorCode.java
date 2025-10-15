package com.moviebooking.movie_service.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error"),
    MOVIE_EXIST(2001, "Movie existed"),
    MOVIE_NOT_FOUND(2001, "Movie not found"),
    GENRE_NOT_FOUND(2003, "Genre not found"),
    GENRE_EXISTED(2004, "Genre existed")
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private final int code;
    private final String message;
}
