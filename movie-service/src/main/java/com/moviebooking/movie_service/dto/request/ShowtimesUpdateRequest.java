package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.ShowtimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimesUpdateRequest {
    String roomId;
    String movieId;
    LocalDate showtimesDate;
    LocalTime startTime;
    LocalTime endTime;
    ShowtimeStatus status;
}