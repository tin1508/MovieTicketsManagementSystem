package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingCreationRequest {
    String userId;
    String showtimeId;
    List<String> showtimeSeatIds;
    Integer ticketQuantity;
    BigDecimal totalPrice;
    BookingStatus status;
}

