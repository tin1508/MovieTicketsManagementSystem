package com.groupfour.movietickets.dto.response;

import com.groupfour.movietickets.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingsResponse {
    String bookingCode;
    LocalDate bookingDate;
    double orgPrice;
    double totalPrice;
    BookingStatus status;
}
