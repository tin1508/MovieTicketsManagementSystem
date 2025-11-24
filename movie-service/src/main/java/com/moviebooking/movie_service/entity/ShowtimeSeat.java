package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name="showtime_seats")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne(mappedBy = "showtimeSeat")
    BookingDetail bookingDetail;
    @ManyToOne
    @JoinColumn(name = "showtime_id")
    Showtimes showtimes;

    BigDecimal price;
    ShowtimeSeatStatus status;
}
