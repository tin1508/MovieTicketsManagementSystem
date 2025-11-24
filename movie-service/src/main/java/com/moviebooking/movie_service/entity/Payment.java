package com.moviebooking.movie_service.entity;

import com.moviebooking.movie_service.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @OneToOne
    @JoinColumn(name = "booking_id")
    Booking booking;
    String transactionId;
    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;
    BigDecimal amount;
    String qrBankUrl;
    LocalDateTime createdAt;
    LocalDateTime processAt;
}
