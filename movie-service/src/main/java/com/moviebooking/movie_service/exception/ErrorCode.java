package com.moviebooking.movie_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    MOVIE_EXIST(2001, "Movie existed", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(2002, "Movie not found", HttpStatus.NOT_FOUND),
    GENRE_NOT_FOUND(2003, "Genre not found", HttpStatus.NOT_FOUND),
    GENRE_EXISTED(2004, "Genre existed", HttpStatus.BAD_REQUEST),

    FILE_STORAGE_FAILED(3001, "Faile to store file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_NOT_FOUND(3002, "File not found", HttpStatus.NOT_FOUND),
    INVALID_FILE_TYPE(3003, "Invalid file type", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(3004, "File size exceeds the limit", HttpStatus.BAD_REQUEST),
    INVALID_FILE_PATH(3005, "Invalid file path (contains '...'", HttpStatus.BAD_REQUEST)

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }


}
