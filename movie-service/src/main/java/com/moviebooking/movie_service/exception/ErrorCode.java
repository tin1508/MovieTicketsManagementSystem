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

    FILE_STORAGE_FAILED(6001, "Faile to store file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_NOT_FOUND(6002, "File not found", HttpStatus.NOT_FOUND),
    INVALID_FILE_TYPE(6003, "Invalid file type", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(6004, "File size exceeds the limit", HttpStatus.BAD_REQUEST),
    INVALID_FILE_PATH(6005, "Invalid file path (contains '...'", HttpStatus.BAD_REQUEST),

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
    USER_LOCKED(1014, "User has been locked", HttpStatus.FORBIDDEN),
    EMAIL_NOTEXISTED(1015, "Email not existed", HttpStatus.NOT_FOUND),

    BANNER_NOT_FOUND(5001, "Banner not existed", HttpStatus.NOT_FOUND),
    BANNER_EXISTED(5002, "Banner existed", HttpStatus.BAD_REQUEST),

    BOOKING_EXISTED(3001, "Booking is existed", HttpStatus.CONFLICT),
    BOOKING_NOTFOUND(3002, "Booking is not found", HttpStatus.NOT_FOUND),
    PAYMENT_NOTFOUND(3003, "Payment is not found", HttpStatus.NOT_FOUND),
    BOOKING_PAID(3004, "Booking has been paid", HttpStatus.CONFLICT),
    BOOKING_DETAIL_NOTFOUND(3005, "Booking detail is not found", HttpStatus.NOT_FOUND),
    SHOWTIME_SEAT_NOTFOUND(3006, "Showtime seat is not found", HttpStatus.NOT_FOUND),
    QR_GENERATION_FAILED(3007, "Generate qr failed", HttpStatus.BAD_REQUEST),
    SHOWTIMES_NOTFOUND(3008, "Showtimes are not found", HttpStatus.NOT_FOUND),
    SEAT_NOT_SELECTED(3009, "Seats are not selected", HttpStatus.BAD_REQUEST),
    SEAT_NOT_FOUND(3010, "Seats are not found", HttpStatus.NOT_FOUND),
    SEAT_NOT_AVAILABLE(3011, "Seat is not available", HttpStatus.CREATED),
    BOOKING_STATUS_INVALID(3012, "Booking status is invalid", HttpStatus.BAD_REQUEST),
    BOOKING_EXPIRED(3013, "Booking is expired", HttpStatus.BAD_REQUEST),
    SEAT_STATUS_INVALID(3014, "Seat status is invalid", HttpStatus.BAD_REQUEST),
    CINEMA_NOTFOUND(3015, "Cinema is not found", HttpStatus.NOT_FOUND),
    ROOM_NOTFOUND(3016, "Room is not found", HttpStatus.NOT_FOUND),
    SEAT_TYPE_NOTFOUND(3017, "Seat type is not found", HttpStatus.NOT_FOUND),
    SHOWTIMES_EXIST(3018, "Showtimes have already existed", HttpStatus.BAD_REQUEST),


    SEAT_ALREADY_TAKEN(4003, "Seat is taken", HttpStatus.BAD_REQUEST),
    INVALID_SEAT_STATE(4004, "Seat state is invalid", HttpStatus.BAD_REQUEST ),
    SEAT_NOT_HELD_BY_USER(4005, "Seat has not been held by user", HttpStatus.BAD_REQUEST ),
    SEAT_ERROR(4006, "Seat is available or booked", HttpStatus.BAD_REQUEST),
    SEAT_HOLD_EXPIRED(4007, "Holding seat is expired", HttpStatus.BAD_REQUEST ),
    PAYMENT_ALREADY_EXISTS(4008, "Payment is already existed", HttpStatus.BAD_REQUEST),
    TRANSACTION_ALREADY_EXISTED(4009, "Transaction is already existed", HttpStatus.BAD_REQUEST );

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }


}
