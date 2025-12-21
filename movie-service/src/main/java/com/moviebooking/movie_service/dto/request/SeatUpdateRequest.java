package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.entity.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatUpdateRequest {
    SeatType seatType;
}
