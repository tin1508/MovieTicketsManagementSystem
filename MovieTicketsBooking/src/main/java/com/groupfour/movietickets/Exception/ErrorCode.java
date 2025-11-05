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
    BOOKING_NOTFOUND(1002, "Booking not found", HttpStatus.NOT_FOUND),
    PAYMENT_NOTFOUND(1003, "Payment not found", HttpStatus.NOT_FOUND),
    BOOKING_PAID(1004, "Booking has been paid", HttpStatus.CONFLICT),
    BOOKING_DETAIL_NOTFOUND(1005, "Booking detail not found", HttpStatus.NOT_FOUND),
    SHOWTIME_SEAT_NOTFOUND(1006, "Showtime seat not found", HttpStatus.NOT_FOUND),
    QR_GENERATION_FAILED(1007, "Generate qr failed", HttpStatus.BAD_REQUEST);

    int code;
    String message;
    HttpStatus status;
    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
