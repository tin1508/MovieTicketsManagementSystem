package com.groupfour.movietickets.dto.request;

import com.groupfour.movietickets.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingCreationRequest {
    LocalDate bookingDate;
    double orgPrice;
    double totalPrice;
    BookingStatus status;
}
