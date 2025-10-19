package com.groupfour.movietickets.Exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    BOOKING_EXISTED(1001, "Booking is existed", HttpStatus.CONFLICT),
    BOOKING_NOTFOUND(1002, "Booking not found", HttpStatus.NOT_FOUND);

    int code;
    String message;
    HttpStatus status;
    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
