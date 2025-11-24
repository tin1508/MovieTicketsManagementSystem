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
    INVALID_FILE_PATH(3005, "Invalid file path (contains '...'", HttpStatus.BAD_REQUEST),

    INVALID_KEY(1001,"invalid message key",HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002,"User existed",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least 3 characters",HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005,"User not existed",HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007,"You do not have permission",HttpStatus.FORBIDDEN),
    UNCORRECT_PASSWORD(1008, "Password is not correct", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1009, "Email existed", HttpStatus.BAD_REQUEST),
    PHONE_EXISTED(1010, "Phone existed", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1011, "Old password is incorrect", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCH(1012, "New password and confirm password do not match", HttpStatus.BAD_REQUEST),
    SAME_PASSWORD(1013, "New password must be different from old password", HttpStatus.BAD_REQUEST),

    BANNER_NOT_FOUND(4001, "Banner not existed", HttpStatus.NOT_FOUND),
    BANNER_EXISTED(4002, "Banner existed", HttpStatus.BAD_REQUEST)

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
