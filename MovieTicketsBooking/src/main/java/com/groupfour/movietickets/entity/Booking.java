package com.groupfour.movietickets.entity;

import com.groupfour.movietickets.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Entity
@Table(name="bookings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String userId;
    String showtimeId;
    String bookingCode;
    LocalDate bookingDate;
    double orgPrice;
    double totalPrice;

    @Enumerated(EnumType.STRING)
    BookingStatus status;
}
