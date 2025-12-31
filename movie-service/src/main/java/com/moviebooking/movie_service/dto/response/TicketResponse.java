package com.moviebooking.movie_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketResponse {
    String ticketCode;
    String seatName;
    String roomName;
    String movieTitle;
    Double price;
    LocalTime startTime;
    LocalDate showtimesDate;
}
