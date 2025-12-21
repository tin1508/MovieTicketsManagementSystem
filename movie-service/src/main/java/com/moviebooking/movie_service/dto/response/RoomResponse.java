package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.entity.Cinema;
import com.moviebooking.movie_service.enums.RoomStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    Long id;
    CinemaResponse cinema;
    String name;
    Integer totalSeats;
    Integer totalRows;
    Integer seatsPerRow;
    RoomStatus status;
}
