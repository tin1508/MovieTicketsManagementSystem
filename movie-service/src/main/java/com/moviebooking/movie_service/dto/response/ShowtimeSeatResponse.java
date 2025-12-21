package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeSeatResponse {
    String id;
    ShowtimesResponse showtimes;
    SeatResponse seat;
    ShowtimeSeatStatus status;
}

