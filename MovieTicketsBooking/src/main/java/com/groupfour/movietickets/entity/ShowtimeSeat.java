package com.groupfour.movietickets.entity;

import com.groupfour.movietickets.enums.ShowtimeSeatStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    ShowtimeSeatStatus status;
}
