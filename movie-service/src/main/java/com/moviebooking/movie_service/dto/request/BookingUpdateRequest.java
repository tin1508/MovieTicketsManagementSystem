package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingUpdateRequest {
    Integer ticketQuantity;
    BigDecimal totalPrice;
    BookingStatus status;
}
