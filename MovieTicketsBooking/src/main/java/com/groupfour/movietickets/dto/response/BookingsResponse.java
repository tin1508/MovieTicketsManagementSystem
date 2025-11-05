package com.groupfour.movietickets.dto.response;

import com.groupfour.movietickets.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingsResponse {
    String bookingCode;
    LocalDate bookingDate;
    int ticketQuantity;
    double totalPrice;
    LocalDateTime expiresAt;
    BookingStatus status;
}
