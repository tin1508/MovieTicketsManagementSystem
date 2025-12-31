package com.moviebooking.movie_service.dto.request;

import com.moviebooking.movie_service.enums.RoomStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomUpdateRequest {
    Integer totalRows;
    Integer seatsPerRow;
    RoomStatus status;
}