package com.moviebooking.movie_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailResponse {
    String id;
    ShowtimeSeatResponse showtimeSeat;
    BigDecimal price;
}
