package com.moviebooking.movie_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.moviebooking.movie_service.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="showtime_id")
    @JsonIgnoreProperties({"bookings"})
    Showtimes showtimes;

    String bookingCode;
    LocalDate bookingDate;
    Integer ticketQuantity;
    BigDecimal totalPrice;

    @Column(name = "expire_at")
    LocalDateTime expiresAt;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    Payment payment;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BookingDetail> bookingDetails = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    BookingStatus status;
}
