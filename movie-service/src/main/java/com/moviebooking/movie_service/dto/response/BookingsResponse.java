package com.moviebooking.movie_service.dto.response;

import com.moviebooking.movie_service.enums.BookingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingsResponse {
    String id;
    UserResponse user;
    ShowtimesResponse showtimes;
    String bookingCode;
    LocalDate bookingDate;
    Integer ticketQuantity;
    BigDecimal totalPrice;
    LocalDateTime expiresAt;
    BookingStatus status;
    String username;

    ShowtimeSeatResponse showtime;
    List<TicketResponse> tickets;
    List<BookingDetailResponse> bookingDetails;

}