package com.groupfour.movietickets.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name="booking_details")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

//    @ManyToOne
//    @JoinColumn(name = "booking_id")
//    Booking booking;
//
    @OneToOne
    @JoinColumn(name = "showtime_seat_id")
    ShowtimeSeat showtimeSeat;
}
