package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "showtime_seats",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"showtime_id", "seat_id"})
        }
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    Showtimes showtimes;

    @Enumerated(EnumType.STRING)
    ShowtimeSeatStatus status;

    @ManyToOne
    @JoinColumn(name="seat_id", nullable = false)
    Seat seat;

    String holdBy;
    LocalDateTime holdExpiredAt;
}
