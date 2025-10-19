package com.groupfour.movietickets.dto.request;

import com.groupfour.movietickets.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUpdateRequest {
    LocalDate bookingDate;
    double orgPrice;
    double totalPrice;
    BookingStatus status;
}
