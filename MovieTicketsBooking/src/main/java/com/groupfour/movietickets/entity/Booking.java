package com.groupfour.movietickets.entity;

import com.groupfour.movietickets.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;


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
    int ticketQuantity;
    double totalPrice;

    @Column(name = "expire_at")
    LocalDateTime expiresAt;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    Payment payment;

//    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
//    List<BookingDetail> bookingDetails;

    @Enumerated(EnumType.STRING)
    BookingStatus status;
}
