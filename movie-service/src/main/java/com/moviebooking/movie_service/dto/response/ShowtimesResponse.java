package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.enums.ShowtimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimesResponse {
    String id;
    MovieResponse movie;
    RoomResponse room;
    LocalDate showtimesDate;
    LocalTime startTime;
    LocalTime endTime;
    ShowtimeStatus status;
}
